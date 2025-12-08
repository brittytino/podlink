import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiters configuration
const signupLimiter = new RateLimiterMemory({
  points: 5, // 5 signups
  duration: 3600, // per 1 hour
  blockDuration: 3600, // Block for 1 hour if limit exceeded
});

const loginLimiter = new RateLimiterMemory({
  points: 10, // 10 login attempts
  duration: 900, // per 15 minutes
  blockDuration: 900, // Block for 15 minutes if limit exceeded
});

const verificationEmailLimiter = new RateLimiterMemory({
  points: 3, // 3 verification emails
  duration: 3600, // per 1 hour
  blockDuration: 3600, // Block for 1 hour
});

/**
 * Check rate limit for an IP address
 * @param ip - The IP address to check
 * @param type - Type of rate limit (signup, login, verification)
 * @returns Promise<{ success: boolean; remainingPoints?: number; msBeforeNext?: number }>
 */
export async function checkRateLimit(
  ip: string,
  type: 'signup' | 'login' | 'verification'
): Promise<{ success: boolean; remainingPoints?: number; msBeforeNext?: number; error?: string }> {
  const limiter = type === 'signup' ? signupLimiter : type === 'login' ? loginLimiter : verificationEmailLimiter;
  
  try {
    const result = await limiter.consume(ip, 1);
    return {
      success: true,
      remainingPoints: result.remainingPoints,
      msBeforeNext: result.msBeforeNext,
    };
  } catch (error: any) {
    if (error.msBeforeNext) {
      const minutesRemaining = Math.ceil(error.msBeforeNext / 60000);
      const actionText = type === 'signup' ? 'create an account' : type === 'login' ? 'login' : 'send verification email';
      
      return {
        success: false,
        msBeforeNext: error.msBeforeNext,
        error: `Too many attempts. Please try to ${actionText} again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`,
      };
    }
    
    return {
      success: false,
      error: 'Rate limit check failed. Please try again.',
    };
  }
}

/**
 * Get client IP address from request headers
 * @param headers - Request headers
 * @returns IP address string
 */
export function getClientIp(headers: Headers): string {
  // Check various headers for IP (Vercel, Cloudflare, standard)
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list, get the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to localhost for development
  return '127.0.0.1';
}

/**
 * Reset rate limit for an IP (useful for testing or manual override)
 * @param ip - The IP address to reset
 * @param type - Type of rate limit to reset
 */
export async function resetRateLimit(
  ip: string,
  type: 'signup' | 'login' | 'verification'
): Promise<void> {
  const limiter = type === 'signup' ? signupLimiter : type === 'login' ? loginLimiter : verificationEmailLimiter;
  await limiter.delete(ip);
}
