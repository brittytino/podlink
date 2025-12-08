import nodemailer from 'nodemailer';

// Email configuration (you'll need to add these to .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Enable debug output
  logger: true, // Log information about the connection
});

/**
 * Send email verification link to user
 * @param email - User's email address
 * @param username - User's username for personalization
 * @param verificationToken - Unique verification token
 */
export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationToken: string
): Promise<{ success: boolean; error?: string }> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - PodLink</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PodLink!</h1>
      </div>
      
      <div style="background: #ffffff; padding: 40px; border: 1px solid #e1e8ed; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #667eea; margin-top: 0;">Hi ${username}! 👋</h2>
        
        <p style="font-size: 16px; color: #555;">
          Thank you for joining PodLink - your mental health and accountability companion. We're excited to have you on board!
        </p>
        
        <p style="font-size: 16px; color: #555;">
          To get started and access your account, please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 14px 40px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-size: 16px; 
                    font-weight: 600;
                    display: inline-block;
                    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          Or copy and paste this link into your browser:
        </p>
        <p style="font-size: 13px; color: #667eea; word-break: break-all; background: #f7f9fc; padding: 12px; border-radius: 6px; border-left: 3px solid #667eea;">
          ${verificationUrl}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e1e8ed; margin: 30px 0;">
        
        <p style="font-size: 13px; color: #999; margin-bottom: 5px;">
          This verification link will expire in <strong>24 hours</strong>.
        </p>
        
        <p style="font-size: 13px; color: #999;">
          If you didn't create a PodLink account, you can safely ignore this email.
        </p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e1e8ed;">
          <p style="font-size: 13px; color: #999; margin: 5px 0;">
            Best regards,<br>
            <strong style="color: #667eea;">The PodLink Team</strong>
          </p>
          <p style="font-size: 12px; color: #aaa; margin-top: 15px;">
            PodLink - Mental Health & Accountability Platform<br>
            <a href="https://podlink.app" style="color: #667eea; text-decoration: none;">podlink.app</a>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding: 20px;">
        <p style="font-size: 11px; color: #aaa;">
          © ${new Date().getFullYear()} PodLink. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hi ${username}!

Thank you for joining PodLink - your mental health and accountability companion.

To verify your email address and activate your account, please click the link below:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create a PodLink account, you can safely ignore this email.

Best regards,
The PodLink Team

---
PodLink - Mental Health & Accountability Platform
podlink.app
  `;

  try {
    console.log('📧 Attempting to send verification email to:', email);
    console.log('📧 SMTP User:', process.env.SMTP_USER);
    console.log('📧 SMTP Host:', process.env.SMTP_HOST);
    console.log('📧 Verification URL:', verificationUrl);
    
    const info = await transporter.sendMail({
      from: `"PodLink" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email - Welcome to PodLink! 🎉',
      text: textContent,
      html: htmlContent,
    });

    console.log('✅ Verification email sent successfully:', info.messageId);
    console.log('📧 Accepted recipients:', info.accepted);
    console.log('📧 Rejected recipients:', info.rejected);

    return { success: true };
  } catch (error: any) {
    console.error('❌ Failed to send verification email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    return {
      success: false,
      error: error.message || 'Failed to send verification email',
    };
  }
}

/**
 * Send password reset email (for future implementation)
 */
export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  
  // Similar email template for password reset
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - PodLink</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Password Reset</h1>
      </div>
      <div style="background: white; padding: 40px; border: 1px solid #e1e8ed; border-top: none;">
        <h2 style="color: #667eea;">Hi ${username},</h2>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #999;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"PodLink" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Password - PodLink',
      html: htmlContent,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send password reset email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send password reset email',
    };
  }
}

/**
 * Verify transporter configuration (useful for testing)
 */
export async function verifyEmailConfiguration(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server verification failed:', error);
    return false;
  }
}
