import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helper';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { avatarUrl } = await req.json();

    if (!avatarUrl) {
      return NextResponse.json({ error: 'Avatar URL required' }, { status: 400 });
    }

    // Validate the URL is from the allowed domain
    const allowedDomains = ['avatar.iran.liara.run', 'cloudinary.com', 'res.cloudinary.com'];
    try {
      const url = new URL(avatarUrl);
      if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
        return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
      }
    } catch (urlError) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Directly save the avatar URL without fetching
    // The avatar.iran.liara.run API provides stable, reliable URLs
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: avatarUrl },
      select: {
        avatarUrl: true,
      },
    });

    return NextResponse.json({ url: user.avatarUrl || avatarUrl });
  } catch (error) {
    console.error('Avatar update error:', error);
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}
