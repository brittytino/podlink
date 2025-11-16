import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    );
    
    const queryPromise = prisma.$queryRaw`SELECT 1`;
    await Promise.race([queryPromise, timeoutPromise]);
    
    // Count users to verify database access
    const userCount = await prisma.user.count();
    const podCount = await prisma.pod.count();
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      stats: {
        users: userCount,
        pods: podCount,
      },
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    
    // Check if it's a connection error (database paused)
    const isConnectionError = 
      error?.message?.includes('Can\'t reach database server') ||
      error?.message?.includes('Connection') ||
      error?.code === 'P1001' ||
      error?.code === 'P1000';
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: isConnectionError ? 'paused' : 'disconnected',
        error: isConnectionError 
          ? 'Database is paused (Neon free tier). It will wake up automatically on first query.'
          : error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        note: isConnectionError 
          ? 'Neon free tier databases pause after inactivity. The database will wake up in 2-5 seconds on the next query.'
          : undefined,
      },
      { status: 503 }
    );
  }
}

