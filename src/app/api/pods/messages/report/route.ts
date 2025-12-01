import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { moderateReportedMessage } from '@/lib/content-moderation';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { messageId, reason } = body;

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    // Check if message exists
    const message = await prisma.podMessage.findUnique({
      where: { id: messageId },
      include: {
        reports: true,
      },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Check if already deleted
    if (message.isDeleted) {
      return NextResponse.json({ error: 'Message already removed' }, { status: 400 });
    }

    // Check if user already reported this message
    const existingReport = message.reports.find(r => r.reportedBy === user.id);
    if (existingReport) {
      return NextResponse.json({ error: 'You already reported this message' }, { status: 400 });
    }

    // Create report
    const report = await prisma.messageReport.create({
      data: {
        messageId,
        reportedBy: user.id,
        reason: reason || 'Inappropriate content',
        status: 'PENDING',
      },
    });

    // Automatically moderate the message
    const moderation = await moderateReportedMessage(message.messageText);

    let messageDeleted = false;

    if (moderation.shouldDelete) {
      // Auto-delete if content is offensive
      await prisma.podMessage.update({
        where: { id: messageId },
        data: {
          isDeleted: true,
          deletedReason: moderation.reason || 'Automatic moderation: inappropriate content',
        },
      });

      // Update report status
      await prisma.messageReport.update({
        where: { id: report.id },
        data: {
          status: 'ACTION_TAKEN',
        },
      });

      messageDeleted = true;
    } else {
      // Mark as reviewed but no action needed
      await prisma.messageReport.update({
        where: { id: report.id },
        data: {
          status: 'REVIEWED',
        },
      });
    }

    return NextResponse.json({
      success: true,
      messageDeleted,
      message: messageDeleted 
        ? 'Message has been automatically removed due to inappropriate content'
        : 'Report submitted. The message does not violate our content policy.',
    });
  } catch (error) {
    console.error('Error reporting message:', error);
    return NextResponse.json(
      { error: 'Failed to report message' },
      { status: 500 }
    );
  }
}

// Get reports for a message (optional - for transparency)
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    const reports = await prisma.messageReport.findMany({
      where: { messageId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
