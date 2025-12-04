/**
 * Content moderation utility using OpenRouter API for detecting offensive content
 * Uses AI to properly analyze messages instead of simple keyword matching
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ModerationResponse {
  isOffensive: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Check if text contains offensive or inappropriate content using OpenRouter AI
 */
export async function containsOffensiveContent(text: string): Promise<{
  isOffensive: boolean;
  reason?: string;
  matches?: string[];
}> {
  if (!text || typeof text !== 'string') {
    return { isOffensive: false };
  }

  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured, falling back to basic moderation');
    return fallbackModeration(text);
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'PodLink Content Moderation',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free', // Free model for moderation
        messages: [
          {
            role: 'system',
            content: `You are a strict content moderation AI for a mental health support platform. Analyze messages for:
1. Racial slurs and discrimination (including n-word, variations like "nigga", "negro", etc.)
2. Profanity and vulgar language (fuck, shit, bitch, etc.)
3. Hate speech targeting race, religion, gender, sexuality, etc.
4. Sexual or explicit content
5. Threats or violence
6. Spam or gibberish
7. Harassment or bullying

BE VERY STRICT with racial slurs and hate speech - these must ALWAYS be flagged regardless of context.

Respond with ONLY a JSON object in this exact format:
{"isOffensive": true/false, "reason": "brief explanation", "severity": "low/medium/high/critical"}

Mark all racial slurs as "critical" severity.`
          },
          {
            role: 'user',
            content: `Analyze this message: "${text}"`
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent moderation
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter moderation API error:', response.status);
      return fallbackModeration(text);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    
    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result: ModerationResponse = JSON.parse(jsonMatch[0]);
      
      // Log moderation results in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Content Moderation Result:', {
          text: text.substring(0, 50),
          isOffensive: result.isOffensive,
          reason: result.reason,
          severity: result.severity
        });
      }
      
      return {
        isOffensive: result.isOffensive,
        reason: result.reason,
        matches: result.isOffensive ? [result.severity || 'unknown'] : [],
      };
    }

    // If parsing fails, use fallback
    console.warn('Failed to parse AI moderation response, using fallback');
    return fallbackModeration(text);
  } catch (error) {
    console.error('Error in AI content moderation:', error);
    return fallbackModeration(text);
  }
}

/**
 * Fallback moderation using basic keyword matching
 * Used when OpenRouter API is unavailable
 */
function fallbackModeration(text: string): {
  isOffensive: boolean;
  reason?: string;
  matches?: string[];
} {
  const normalizedText = text.toLowerCase().trim();
  
  // Comprehensive offensive words list
  const offensivePatterns = [
    // Profanity
    { pattern: /\bf+u+c+k+/i, reason: 'Contains profanity' },
    { pattern: /\bs+h+i+t+/i, reason: 'Contains profanity' },
    { pattern: /\bc+u+n+t+/i, reason: 'Contains profanity' },
    { pattern: /\bb+i+t+c+h+/i, reason: 'Contains profanity' },
    { pattern: /\ba+s+s+h+o+l+e+/i, reason: 'Contains profanity' },
    { pattern: /\bd+i+c+k+/i, reason: 'Contains profanity' },
    { pattern: /\bp+u+s+s+y+/i, reason: 'Contains profanity' },
    
    // Racial slurs (CRITICAL - always block)
    { pattern: /\bn+i+g+g+e+r+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bn+i+g+g+a+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bn+i+g+r+o+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bn+e+g+r+o+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bc+o+o+n+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bc+h+i+n+k+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bs+p+i+c+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bw+e+t+b+a+c+k+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bg+o+o+k+/i, reason: 'Contains racial slur (critical)', critical: true },
    { pattern: /\bk+i+k+e+/i, reason: 'Contains racial slur (critical)', critical: true },
    
    // Homophobic slurs
    { pattern: /\bf+a+g+g+o+t+/i, reason: 'Contains homophobic slur (critical)', critical: true },
    { pattern: /\bf+a+g+/i, reason: 'Contains homophobic slur (critical)', critical: true },
    { pattern: /\bd+y+k+e+/i, reason: 'Contains homophobic slur (critical)', critical: true },
    { pattern: /\bt+r+a+n+n+y+/i, reason: 'Contains transphobic slur (critical)', critical: true },
    
    // Sexual content
    { pattern: /\bp+o+r+n+/i, reason: 'Contains sexual content' },
    { pattern: /\bs+e+x+/i, reason: 'Contains sexual content' },
  ];

  for (const { pattern, reason, critical } of offensivePatterns) {
    if (pattern.test(normalizedText)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚨 Fallback moderation detected:', { reason, critical, pattern: pattern.toString() });
      }
      
      return {
        isOffensive: true,
        reason,
        matches: [critical ? 'critical' : 'profanity'],
      };
    }
  }

  return { isOffensive: false };
}

/**
 * Filter/censor offensive content from text
 */
export function censorOffensiveContent(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Simple censoring - replace with asterisks
  return text.replace(/\b(fuck|shit|bitch|ass|damn)\b/gi, (match) => '*'.repeat(match.length));
}

/**
 * Validate message before allowing it to be sent
 * This is called BEFORE the message is saved to the database
 */
export async function validateMessage(text: string): Promise<{
  isValid: boolean;
  error?: string;
  shouldDelete?: boolean;
}> {
  // Check for offensive content using AI + fallback
  const check = await containsOffensiveContent(text);

  if (check.isOffensive) {
    // Log blocking in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 Message BLOCKED before sending:', {
        reason: check.reason,
        severity: check.matches?.[0]
      });
    }
    
    return {
      isValid: false,
      error: check.reason || 'Your message contains inappropriate content and cannot be sent',
      shouldDelete: true,
    };
  }

  return { isValid: true };
}

/**
 * Moderate message after it's been reported by another user
 * This is more strict than initial validation
 */
export async function moderateReportedMessage(messageText: string): Promise<{
  shouldDelete: boolean;
  reason?: string;
}> {
  // Use AI moderation to check reported message
  const check = await containsOffensiveContent(messageText);

  if (check.isOffensive) {
    // Log auto-deletion in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🗑️  Reported message AUTO-DELETED:', {
        reason: check.reason,
        severity: check.matches?.[0]
      });
    }
  }

  return {
    shouldDelete: check.isOffensive,
    reason: check.reason || (check.isOffensive ? 'Inappropriate content detected' : undefined),
  };
}
