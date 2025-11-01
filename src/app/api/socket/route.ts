import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Socket.io server runs separately on port 3001',
    socketUrl: process.env.NEXTAUTH_URL?.replace(/\/$/, '') + ':3001' || 'http://localhost:3001'
  });
}


