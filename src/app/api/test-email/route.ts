import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConfiguration } from '@/lib/email';

/**
 * Test email configuration
 * GET /api/test-email
 * Only works in development
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    console.log('🧪 Testing email configuration...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_FROM:', process.env.SMTP_FROM);
    console.log('SMTP_PASSWORD exists:', !!process.env.SMTP_PASSWORD);

    const isValid = await verifyEmailConfiguration();

    return NextResponse.json(
      { 
        success: isValid,
        message: isValid 
          ? 'Email configuration is valid and ready to send emails'
          : 'Email configuration failed. Check server logs for details.',
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          from: process.env.SMTP_FROM,
        }
      },
      { status: isValid ? 200 : 500 }
    );
  } catch (error: any) {
    console.error('❌ Email test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
