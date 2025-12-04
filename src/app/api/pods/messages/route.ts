import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { generateAIChatResponse as generateOpenRouterResponse } from '@/lib/openrouter';
import { generateAIChatResponse as generateGeminiResponse } from '@/lib/gemini';
import { validateMessage } from '@/lib/content-moderation';
import { emitToPod } from '@/lib/socket-emit';

async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.code === 'P1001' || error?.message?.includes('connect')) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const podId = searchParams.get('podId');

    if (!podId) {
      return NextResponse.json({ error: 'Pod ID required' }, { status: 400 });
    }

    const messages = await retryDatabaseOperation(() =>
      prisma.podMessage.findMany({
        where: { 
          podId,
          isDeleted: false, // Don't return deleted messages
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              displayName: true, // Anonymous name for privacy
              avatarUrl: true,
              isAI: true, // Include AI flag
            } as any,
          },
          reactions: {
            select: {
              emoji: true,
              userId: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 50,
      })
    );

    const formattedMessages = messages.map((msg: any) => {
      // Group reactions by emoji
      const reactionsMap = new Map<string, { emoji: string; count: number; userIds: string[] }>();
      
      msg.reactions?.forEach((reaction: any) => {
        if (!reactionsMap.has(reaction.emoji)) {
          reactionsMap.set(reaction.emoji, {
            emoji: reaction.emoji,
            count: 0,
            userIds: [],
          });
        }
        const reactionData = reactionsMap.get(reaction.emoji)!;
        reactionData.count++;
        reactionData.userIds.push(reaction.userId);
      });

      return {
        id: msg.id,
        messageText: msg.messageText,
        imageUrl: msg.imageUrl,
        userId: msg.userId,
        username: msg.user.username,
        displayName: msg.user.displayName || msg.user.fullName, // Use displayName for anonymity
        avatarUrl: msg.user.avatarUrl,
        createdAt: msg.createdAt.toISOString(),
        isCrisisResponse: msg.isCrisisResponse,
        isAI: msg.user.isAI || false, // Include AI flag
        reactions: Array.from(reactionsMap.values()),
      };
    });

    return NextResponse.json({ messages: formattedMessages });
  } catch (error: any) {
    console.error('Get messages error:', error);
    
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { podId, userId, messageText, isCrisisResponse, alertId, imageUrl } = await req.json();

    if (!podId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Must have either messageText or imageUrl
    if (!messageText && !imageUrl) {
      return NextResponse.json(
        { error: 'Message must contain text or image' },
        { status: 400 }
      );
    }

    // Validate message content for offensive language using AI moderation
    if (messageText) {
      const validation = await validateMessage(messageText);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.error || 'Message contains inappropriate content' },
          { status: 400 }
        );
      }
    }

    const message = await retryDatabaseOperation(() =>
      prisma.podMessage.create({
        data: {
          podId,
          userId,
          messageText: messageText || '',
          imageUrl: imageUrl || null,
          isCrisisResponse: isCrisisResponse || false,
          alertId: alertId || null,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              displayName: true,
              avatarUrl: true,
            } as any,
          },
        },
      })
    );

    // If crisis response, increment response count
    if (isCrisisResponse && alertId) {
      await retryDatabaseOperation(() =>
        prisma.crisisAlert.update({
          where: { id: alertId },
          data: {
            responseCount: {
              increment: 1,
            },
          },
        })
      );
    }

    // Include user displayName in response
    const messageWithUser = {
      ...message,
      user: {
        ...message.user,
        displayName: (message.user as any).displayName || (message.user as any).fullName,
      },
    };

    // Get pod with all members to check if anyone else is active
    const pod = await retryDatabaseOperation(() =>
      prisma.pod.findUnique({
        where: { id: podId },
        include: {
          members: {
            select: {
              id: true,
              isAI: true,
              displayName: true,
              fullName: true,
              goalCategory: true,
              goalDescription: true,
              lastCheckIn: true,
            },
          },
        },
      })
    );

    if (!pod) {
      return NextResponse.json({ message: messageWithUser });
    }

    // Check if message is from a real user (not AI bot)
    const sender = pod.members.find(m => m.id === userId);
    const isFromRealUser = sender && !sender.isAI;

    // Get all real members (excluding AI bots)
    const realMembers = pod.members.filter((m: any) => !m.isAI);

    // Trigger AI response when:
    // 1. Message is from a real user (not AI bot)
    // 2. There's only one real user in the pod (user is alone)
    // 3. OR it's a crisis response
    const shouldTriggerAI = isFromRealUser && (
      realMembers.length === 1 || // Only one real user in pod
      (isCrisisResponse && alertId) // Or it's a crisis
    );

    if (shouldTriggerAI) {
      // Get or create an AI bot for this pod
      let aiBot = pod.members.find((m: any) => m.isAI);

      // If no AI bot exists, create one
      if (!aiBot) {
        const { generateAIBotName } = await import('@/lib/ai-bot-names');
        const existingBotNames = pod.members
          .filter((m: any) => m.isAI)
          .map((m: any) => m.displayName || m.fullName);
        
        const botName = generateAIBotName(existingBotNames);
        const botEmail = `ai-${botName.toLowerCase().replace(/\s+/g, '-')}-${podId.slice(0, 8)}@podlink.ai`;
        const botUsername = `ai_${botName.toLowerCase().replace(/\s+/g, '_')}_${podId.slice(0, 8)}`;

        const newBot = await retryDatabaseOperation(() =>
          prisma.user.create({
            data: {
              username: botUsername,
              email: botEmail,
              password: null, // AI bots don't need passwords
              fullName: botName,
              displayName: botName,
              timezone: 'UTC',
              availabilityHours: {},
              goalType: 'BUILD_HABIT',
              goalDescription: 'Supporting pod members on their journey',
              goalCategory: pod.goalCategory || 'build_meditation',
              isAI: true,
              onboardingComplete: true,
              podId: pod.id,
              currentStreak: 0,
              availabilityMessage: "I'm always here to support you! 💪",
            },
            select: {
              id: true,
              displayName: true,
              fullName: true,
              goalCategory: true,
              goalDescription: true,
            },
          })
        );

        aiBot = newBot as any;
      }

      if (aiBot) {
        // Get user's goal info for context
        const user = await retryDatabaseOperation(() =>
          prisma.user.findUnique({
            where: { id: userId },
            select: { 
              goalCategory: true, 
              goalDescription: true, 
              currentStreak: true, 
              displayName: true,
              fullName: true
            },
          })
        );

        // Get recent conversation history
        const recentMessages = await retryDatabaseOperation(() =>
          prisma.podMessage.findMany({
            where: { podId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
              user: {
                select: { isAI: true, displayName: true, fullName: true },
              } as any,
            },
          })
        );

        const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = recentMessages
          .reverse()
          .map((msg: any) => ({
            role: (msg.user.isAI ? 'assistant' : 'user') as 'user' | 'assistant',
            content: msg.messageText as string,
          }));

        // Generate AI response - randomly choose between OpenRouter and Gemini
        try {
          const previousMessages = conversationHistory.slice(-3).map(msg => msg.content);
          const useOpenRouter = Math.random() < 0.5; // 50% chance for each
          
          let aiResponse: string;
          if (useOpenRouter) {
            // Use OpenRouter with free models
            aiResponse = await generateOpenRouterResponse(
              messageText,
              {
                username: user?.displayName || user?.fullName || 'friend',
                isInCrisis: isCrisisResponse || false,
                previousMessages,
              }
            );
          } else {
            // Use Gemini
            aiResponse = await generateGeminiResponse({
              userMessage: messageText,
              goalCategory: user?.goalCategory || undefined,
              goalDescription: user?.goalDescription || undefined,
              userName: user?.displayName || user?.fullName || 'friend',
              userStreak: user?.currentStreak || 0,
              conversationHistory,
            });
          }

          // Create AI message with a natural delay (1-3 seconds)
          const delay = 1000 + Math.random() * 2000;
          
          setTimeout(async () => {
            try {
              const aiMessage = await retryDatabaseOperation(() =>
                prisma.podMessage.create({
                  data: {
                    podId,
                    userId: aiBot.id,
                    messageText: aiResponse,
                    isCrisisResponse: false,
                  },
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        fullName: true,
                        displayName: true,
                        avatarUrl: true,
                        isAI: true,
                      } as any,
                    },
                  },
                })
              );

              // Emit AI message via socket.io
              await emitToPod(`pod-${podId}`, 'new-message', {
                id: aiMessage.id,
                messageText: aiMessage.messageText,
                userId: aiBot.id,
                username: (aiMessage.user as any).username,
                displayName: (aiMessage.user as any).displayName || (aiMessage.user as any).fullName,
                avatarUrl: (aiMessage.user as any).avatarUrl,
                createdAt: aiMessage.createdAt.toISOString(),
                isCrisisResponse: false,
                isAI: true,
              });
            } catch (error) {
              console.error('Error creating AI response:', error);
            }
          }, delay);
        } catch (error) {
          console.error('Error generating AI response:', error);
        }
      }
    }

    return NextResponse.json({ message: messageWithUser });
  } catch (error: any) {
    console.error('Send message error:', error);
    
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
