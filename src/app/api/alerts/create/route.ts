import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';
import { emitToPod } from '@/lib/socket-emit';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, podId, message } = await req.json();

    // Verify user belongs to the pod
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        podId: true,
        displayName: true,
        fullName: true,
        username: true,
      },
    });

    if (user?.podId !== podId) {
      return NextResponse.json({ error: 'Invalid pod' }, { status: 403 });
    }

    // Create crisis alert
    const alert = await prisma.crisisAlert.create({
      data: {
        userId,
        podId,
        message: message || null,
        status: 'ACTIVE',
        responseCount: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            displayName: true,
          },
        },
      },
    });

    // Emit crisis alert to pod EXCEPT the sender
    await emitToPod(`pod-${podId}`, 'crisis-alert-received', {
      id: alert.id,
      userId: alert.userId,
      username: alert.user.username,
      displayName: alert.user.displayName || alert.user.fullName,
      message: alert.message,
      createdAt: alert.createdAt.toISOString(),
      excludeUserId: userId, // Important: exclude sender from receiving this event
    });

    // Get pod members to send auto-replies from offline members
    const pod = await prisma.pod.findUnique({
      where: { id: podId },
      include: {
        members: {
          select: {
            id: true,
            isAI: true,
            displayName: true,
            fullName: true,
            lastCheckIn: true,
            availabilityMessage: true,
          },
        },
      },
    });

    if (pod) {
      // Get other real members (exclude sender and AI bots)
      const otherRealMembers = pod.members.filter(
        (m: any) => !m.isAI && m.id !== userId
      );

      // Check who is offline (not checked in within last 6 hours)
      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      
      const offlineMembers = otherRealMembers.filter((m: any) => {
        if (!m.lastCheckIn) return true; // Never checked in = offline
        return new Date(m.lastCheckIn) <= sixHoursAgo;
      });

      // Send prebuilt messages from offline members who have availability messages
      const membersWithMessages = offlineMembers.filter(
        (m: any) => m.availabilityMessage && m.availabilityMessage.trim()
      );

      // Send auto-replies from each offline member with a message
      for (const member of membersWithMessages) {
        const delay = 2000 + Math.random() * 3000; // 2-5 seconds delay
        
        setTimeout(async () => {
          try {
            const autoReply = await prisma.podMessage.create({
              data: {
                podId,
                userId: member.id,
                messageText: member.availabilityMessage || "I'm here to support you! Hang in there.",
                isCrisisResponse: true,
                alertId: alert.id,
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
            });

            // Increment response count
            await prisma.crisisAlert.update({
              where: { id: alert.id },
              data: {
                responseCount: {
                  increment: 1,
                },
              },
            });

            // Emit auto-reply to entire pod (including alert sender)
            await emitToPod(`pod-${podId}`, 'new-message', {
              id: autoReply.id,
              messageText: autoReply.messageText,
              userId: member.id,
              username: (autoReply.user as any).username,
              displayName: (autoReply.user as any).displayName || (autoReply.user as any).fullName,
              avatarUrl: (autoReply.user as any).avatarUrl,
              createdAt: autoReply.createdAt.toISOString(),
              isCrisisResponse: true,
              isAI: false,
            });
          } catch (error) {
            console.error('Error sending auto-reply for crisis alert:', error);
          }
        }, delay);
      }
    }

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
