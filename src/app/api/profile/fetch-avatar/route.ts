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
    const allowedDomains = ['avatar.iran.liara.run'];
    const url = new URL(avatarUrl);
    if (!allowedDomains.some(domain => url.hostname.includes(domain))) {
      return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
    }

    // Fetch the avatar image
    const imageResponse = await fetch(avatarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 });
    }

    // Get the image as blob and convert to base64 or use the URL directly
    // For simplicity, we'll cache the URL directly since it's from a reliable API
    // The avatar API returns a direct image URL that we can cache
    
    // Update user avatar with the fetched URL
    // Note: The avatar API URLs are stable, so we can cache them directly
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: avatarUrl },
      select: {
        avatarUrl: true,
      },
    });

    return NextResponse.json({ url: user.avatarUrl || avatarUrl });
  } catch (error) {
    console.error('Avatar fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 });
  }
}

