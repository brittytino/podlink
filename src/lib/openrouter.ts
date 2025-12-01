/**
 * OpenRouter AI API utility for generating AI responses
 * Supports multiple models including X.AI Grok and Google Gemini
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Available models (free tier)
const AVAILABLE_MODELS = [
  'x-ai/grok-2-1212', // Fast and powerful
  'google/gemini-2.0-flash-exp:free', // Free Gemini
] as const;

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Generate AI response using OpenRouter
 */
export async function generateAIResponse(
  prompt: string,
  systemPrompt?: string,
  model: string = 'x-ai/grok-2-1212'
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const messages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'PodLink Accountability App',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(`OpenRouter API request failed: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();

    if (data.error) {
      console.error('OpenRouter error:', data.error);
      throw new Error(data.error.message);
    }

    const generatedText = data.choices?.[0]?.message?.content?.trim() || '';

    if (!generatedText) {
      throw new Error('No response generated');
    }

    return generatedText;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

/**
 * Generate anonymous username
 */
export async function generateAnonymousName(
  existingNames: string[] = []
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return generateFallbackName(existingNames);
  }

  try {
    const prompt = `Generate a unique, friendly, anonymous username for an accountability app. 
Requirements:
- 2-3 words maximum
- Positive, encouraging tone
- No personal identifiers
- Creative and memorable
- Examples: "Hopeful Wanderer", "Steady Progress", "Bright Morning", "Calm Waters"
- Make it completely unique and different from these existing names: ${existingNames.join(', ') || 'none'}

Return ONLY the username, nothing else.`;

    const response = await generateAIResponse(
      prompt,
      'You are a creative username generator. Return only the username with no additional text or explanation.',
      'google/gemini-2.0-flash-exp:free'
    );

    const cleanedName = response.replace(/^["']|["']$/g, '').trim();

    if (cleanedName && !existingNames.includes(cleanedName)) {
      return cleanedName;
    }

    return generateFallbackName(existingNames);
  } catch (error) {
    console.error('Error generating name with OpenRouter:', error);
    return generateFallbackName(existingNames);
  }
}

/**
 * Generate AI chat response for crisis support
 */
export async function generateAIChatResponse(
  userMessage: string,
  context: {
    username: string;
    isInCrisis: boolean;
    previousMessages?: string[];
  }
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return getFallbackCrisisResponse(context.isInCrisis);
  }

  try {
    const systemPrompt = context.isInCrisis
      ? `You are a compassionate AI support companion in a mental health accountability app. A user is experiencing a crisis. Your role is to:
- Provide immediate emotional support
- Validate their feelings
- Encourage them to use coping strategies
- Remind them they're not alone
- Keep responses brief (2-3 sentences max)
- Be warm, supportive, and non-judgmental
- Never give medical advice
- Encourage professional help if needed`
      : `You are a supportive AI companion in an accountability app. Your role is to:
- Encourage users on their journey
- Celebrate their progress
- Offer gentle motivation
- Keep responses brief and friendly (2-3 sentences max)
- Be positive and uplifting`;

    const userContext = context.previousMessages?.length
      ? `Previous conversation context: ${context.previousMessages.join(' | ')}\n\nUser (${context.username}): ${userMessage}`
      : `User (${context.username}): ${userMessage}`;

    const response = await generateAIResponse(
      userContext,
      systemPrompt,
      'x-ai/grok-2-1212' // Fast model for chat
    );

    return response;
  } catch (error) {
    console.error('Error generating AI chat response:', error);
    return getFallbackCrisisResponse(context.isInCrisis);
  }
}

/**
 * Fallback name generator
 */
function generateFallbackName(existingNames: string[]): string {
  const adjectives = [
    'Hopeful', 'Steady', 'Bright', 'Calm', 'Strong', 'Brave', 'Wise', 'Kind',
    'Gentle', 'Focused', 'Determined', 'Resilient', 'Peaceful', 'Joyful', 'Serene',
    'Bold', 'Warm', 'Swift', 'Eager', 'Graceful', 'Vibrant', 'Radiant', 'Quiet',
  ];

  const nouns = [
    'Traveler', 'Walker', 'Seeker', 'Explorer', 'Warrior', 'Guardian', 'Friend',
    'Guide', 'Light', 'Star', 'Ocean', 'Mountain', 'River', 'Tree', 'Phoenix',
    'Dawn', 'Path', 'Journey', 'Spirit', 'Heart', 'Soul', 'Hope', 'Dream',
  ];

  let attempts = 0;
  let name = '';

  while (attempts < 50) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    name = `${adj} ${noun}`;

    if (!existingNames.includes(name)) {
      return name;
    }
    attempts++;
  }

  return `${adjectives[0]} ${nouns[0]} ${Math.floor(Math.random() * 1000)}`;
}

/**
 * Fallback crisis responses
 */
function getFallbackCrisisResponse(isInCrisis: boolean): string {
  if (isInCrisis) {
    const responses = [
      "I'm here with you. Take a deep breath. You're not alone in this, and your pod members care about you. 💙",
      "You're incredibly brave for reaching out. Take things one moment at a time. We're here to support you. 🫂",
      "Your feelings are valid. Remember, this difficult moment will pass. Your pod is here for you. 🌟",
      "I'm so glad you're talking to us. You don't have to face this alone. Take a moment to breathe. 💪",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } else {
    const responses = [
      "That's great to hear! Keep up the amazing work. Every step forward counts! 🌟",
      "You're doing wonderfully! Your dedication is truly inspiring. Keep going! 💪",
      "I love your positive energy! You're on the right path. Proud of you! 🎉",
      "That's the spirit! Your consistency is paying off. You've got this! ✨",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export { AVAILABLE_MODELS };
