import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { generateAIChatResponse } from '@/lib/gemini';
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
        where: { podId },
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
        },
        orderBy: { createdAt: 'asc' },
        take: 50,
      })
    );

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      messageText: msg.messageText,
      userId: msg.userId,
      username: msg.user.username,
      displayName: msg.user.displayName || msg.user.fullName, // Use displayName for anonymity
      avatarUrl: msg.user.avatarUrl,
      createdAt: msg.createdAt.toISOString(),
      isCrisisResponse: msg.isCrisisResponse,
      isAI: msg.user.isAI || false, // Include AI flag
    }));

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

    const { podId, userId, messageText, isCrisisResponse, alertId } = await req.json();

    if (!podId || !userId || !messageText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await retryDatabaseOperation(() =>
      prisma.podMessage.create({
        data: {
          podId,
          userId,
          messageText,
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

    if (isFromRealUser) {
      // Get all real members (excluding AI bots and the sender)
      const otherRealMembers = pod.members.filter(
        (m: any) => !m.isAI && m.id !== userId
      );

      // Check if any other real member is active (checked in within last 6 hours)
      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      const activeRealMembers = otherRealMembers.filter((m: any) => {
        if (!m.lastCheckIn) return false;
        return new Date(m.lastCheckIn) > sixHoursAgo;
      });

      // Trigger AI response if:
      // 1. No other active real members (they're offline/inactive)
      // 2. OR it's an AI pod (podType === 'AI')
      // 3. OR there's only 1 real member total (user is alone)
      const shouldTriggerAI = 
        activeRealMembers.length === 0 || 
        pod.podType === 'AI' || 
        otherRealMembers.length === 0;
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

          // Generate AI response using Gemini
          try {
            const aiResponse = await generateAIChatResponse({
              userMessage: messageText,
              goalCategory: user?.goalCategory || pod.goalCategory || undefined,
              goalDescription: user?.goalDescription || undefined,
              userName: user?.displayName || user?.fullName || 'friend',
              userStreak: user?.currentStreak || 0,
              conversationHistory,
            });

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
