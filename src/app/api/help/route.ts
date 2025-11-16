import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { generateAIEncouragement } from '@/lib/gemini';

/**
 * Handles "I Need Help" requests
 * - Checks if pod members are available
 * - Returns rotating availability messages if members are unavailable
 * - Returns AI chatbot response if AI pod or all members unavailable
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, podId } = await req.json();

    // Verify user belongs to the pod and get their details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        podId: true,
        goalType: true,
        goalDescription: true,
        goalCategory: true,
        currentStreak: true,
        fullName: true,
      },
    });

    if (user?.podId !== podId) {
      return NextResponse.json({ error: 'Invalid pod' }, { status: 403 });
    }

    // Get pod with members
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      include: {
        members: {
          where: {
            id: { not: userId }, // Exclude the user requesting help
          },
          select: {
            id: true,
            fullName: true,
            displayName: true, // Anonymous name for privacy
            isAI: true,
            availabilityMessage: true,
            availabilityHours: true,
            timezone: true,
          },
        },
      },
    });

    if (!pod) {
      return NextResponse.json({ error: 'Pod not found' }, { status: 404 });
    }

    // Check if it's an AI pod
    if (pod.podType === 'AI') {
      // Return AI chatbot response immediately using Gemini
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const aiResponse = await generateAIEncouragement(
        user.goalDescription || user.goalCategory || 'personal growth',
        `User needs immediate support. They have a ${user.currentStreak || 0} day streak.`
      );

      return NextResponse.json({
        type: 'ai_response',
        message: aiResponse,
        source: 'AI Companion',
      });
    }

    // Check member availability
    const now = new Date();
    const availableMembers = pod.members.filter((member: any) => {
      if (member.isAI) return true; // AI bots are always available

      const availability = member.availabilityHours as {
        start: string;
        end: string;
      } | null;
      if (!availability) return false;

      // Simple time check (can be enhanced with timezone conversion)
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const [startHour, startMin] = availability.start.split(':').map(Number);
      const [endHour, endMin] = availability.end.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      return currentTime >= startTime && currentTime <= endTime;
    });

    // If there are available members, create a regular alert
    if (availableMembers.length > 0) {
      const alert = await prisma.crisisAlert.create({
        data: {
          userId,
          podId,
          message: null,
          status: 'ACTIVE',
          responseCount: 0,
        },
      });

      return NextResponse.json({
        type: 'alert_created',
        alertId: alert.id,
        message: 'Your pod members have been notified.',
      });
    }

    // No one is available - show rotating availability message
    const membersWithMessages = pod.members.filter(
      (m: any) => m.availabilityMessage && m.availabilityMessage.trim()
    );

    if (membersWithMessages.length === 0) {
      // No availability messages - return AI response using Gemini
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const aiResponse = await generateAIEncouragement(
        user.goalDescription || user.goalCategory || 'personal growth',
        `User needs immediate support. They have a ${user.currentStreak || 0} day streak.`
      );

      return NextResponse.json({
        type: 'ai_response',
        message: aiResponse,
        source: 'AI Companion',
      });
    }

    // Rotate messages - don't show the same person's message twice in a row
    let selectedMember = membersWithMessages[0];
    const lastShownUserId = pod.lastShownMessageUserId;

    if (lastShownUserId) {
      // Find a different member than the last one shown
      const otherMembers = membersWithMessages.filter(
        (m: any) => m.id !== lastShownUserId
      );
      if (otherMembers.length > 0) {
        selectedMember =
          otherMembers[Math.floor(Math.random() * otherMembers.length)];
      }
    } else {
      // Randomly select from all members
      selectedMember =
        membersWithMessages[
          Math.floor(Math.random() * membersWithMessages.length)
        ];
    }

    // Update pod with last shown message user ID
    await prisma.pod.update({
      where: { id: podId },
      data: { lastShownMessageUserId: selectedMember.id },
    });

    return NextResponse.json({
      type: 'availability_message',
      message: selectedMember.availabilityMessage,
      from: selectedMember.displayName || selectedMember.fullName, // Use displayName for anonymity
      memberId: selectedMember.id,
    });
  } catch (error) {
    console.error('Help request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

