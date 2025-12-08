/**
 * OpenRouter AI API utility for generating AI responses
 * Supports multiple models including X.AI Grok and Google Gemini
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Available models (free tier) - ordered by preference
const AVAILABLE_MODELS = [
  'tngtech/deepseek-r1t2-chimera:free', // DeepSeek R1T2 Chimera
  'kwaipilot/kat-coder-pro:free', // KAT Coder Pro
  'nvidia/nemotron-nano-12b-v2-vl:free', // NVIDIA Nemotron
  'tngtech/deepseek-r1t-chimera:free', // DeepSeek R1T Chimera
  'z-ai/glm-4.5-air:free', // GLM 4.5 Air
  'amazon/nova-2-lite-v1:free', // Amazon Nova 2 Lite
  'google/gemma-3-27b-it:free', // Google Gemma 3
  'openai/gpt-oss-20b:free', // GPT OSS 20B
  'meta-llama/llama-3.3-70b-instruct:free', // Llama 3.3 70B
] as const;

/**
 * Try multiple models in sequence if one is rate-limited
 */
async function tryMultipleModels(
  messages: OpenRouterMessage[],
  requestBody: any
): Promise<string> {
  let lastError: any;
  
  // Try each model in sequence
  for (const model of AVAILABLE_MODELS) {
    try {
      console.log(`🔄 Trying model: ${model}`);
      
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
          'X-Title': 'PodLink Accountability App',
        },
        body: JSON.stringify({
          ...requestBody,
          model,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        console.error(`❌ Model ${model} error:`, errorData);
        
        // If rate-limited (429) or not found (404) or bad request (400), try next model
        if (response.status === 429 || response.status === 404 || response.status === 400) {
          console.log(`⏭️  Model ${model} is rate-limited, trying next...`);
          lastError = new Error(`API error: ${response.status} - ${errorData.error?.message || errorText}`);
          continue;
        }
        
        // For other errors, also try next model instead of failing immediately
        console.log(`⚠️  Model ${model} failed: ${errorData.error?.message || errorText}`);
        lastError = new Error(`API error: ${response.status} - ${errorData.error?.message || errorText}`);
        continue;
      }

      const data: OpenRouterResponse = await response.json();

      if (data.error) {
        console.error(`❌ Model ${model} returned error:`, data.error);
        lastError = new Error(data.error.message);
        continue;
      }

      const generatedText = data.choices?.[0]?.message?.content?.trim() || '';

      if (!generatedText) {
        console.error(`❌ Model ${model} returned empty response`);
        lastError = new Error('Empty response');
        continue;
      }

      console.log(`✅ Success with model: ${model}`);
      return generatedText;
    } catch (error: any) {
      console.log(`⚠️  Model ${model} failed:`, error.message);
      lastError = error;
      continue;
    }
  }
  
  // If all models failed, throw the last error
  throw lastError || new Error('All models failed');
}

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
  model?: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OpenRouter API key not configured');
    throw new Error('OpenRouter API key not configured');
  }

  console.log('🤖 OpenRouter Request:', { promptLength: prompt.length });

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

    const requestBody = {
      messages,
      temperature: 0.7,
      max_tokens: 500,
    };

    // If specific model requested, try it first
    if (model) {
      try {
        console.log(`🎯 Using requested model: ${model}`);
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'PodLink Accountability App',
          },
          body: JSON.stringify({
            ...requestBody,
            model,
          }),
        });

        if (response.ok) {
          const data: OpenRouterResponse = await response.json();
          const generatedText = data.choices?.[0]?.message?.content?.trim();
          if (generatedText) {
            console.log('✅ OpenRouter Success with requested model');
            return generatedText;
          }
        }
        console.log('⚠️  Requested model failed, trying fallback models...');
      } catch (error) {
        console.log('⚠️  Requested model error, trying fallback models...');
      }
    }

    // Try multiple models in sequence
    const result = await tryMultipleModels(messages, requestBody);
    console.log('✅ OpenRouter Success:', { responseLength: result.length });
    return result;
  } catch (error: any) {
    console.error('❌ OpenRouter Error:', {
      message: error?.message,
      name: error?.name
    });
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
      'google/gemini-2.0-flash-exp:free' // Use free Gemini for this
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
 * Generate AI chat response for crisis support and pod conversations
 */
export async function generateAIChatResponse(
  userMessage: string,
  context: {
    username: string;
    isInCrisis: boolean;
    previousMessages?: string[];
    goalCategory?: string;
    goalDescription?: string;
    streak?: number;
  }
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.warn('⚠️  OpenRouter API key missing, using fallback response');
    return getFallbackCrisisResponse(context.isInCrisis);
  }

  console.log('💬 Generating AI chat response:', {
    userMessage: userMessage.substring(0, 50),
    isInCrisis: context.isInCrisis,
    goalCategory: context.goalCategory,
    streak: context.streak
  });

  try {
    const systemPrompt = context.isInCrisis
      ? `You are a compassionate AI support companion in a mental health accountability app. A user is experiencing a crisis. Your role is to:
- Provide immediate emotional support and validation
- Encourage them to use coping strategies
- Remind them they're not alone
- Keep responses brief (2-3 sentences max)
- Be warm, supportive, and non-judgmental
- Never give medical advice
- Encourage professional help if needed

Important: Respond naturally like a caring friend would. Don't be robotic.`
      : `You are a supportive AI companion in an accountability pod chat. Your role is to:
- Give specific, actionable advice when asked
- Suggest immediate coping strategies for urges/cravings
- Acknowledge feelings and offer practical help
- Celebrate progress with genuine excitement
- Answer questions helpfully
- Keep responses conversational and brief (1-2 sentences max)
- Sound human, not like a motivational poster
- Respond directly to what they said - be specific, not generic

${context.goalCategory ? `Context: The user is working on ${context.goalCategory}.` : ''}
${context.goalDescription ? `Their goal: ${context.goalDescription}` : ''}
${context.streak ? `They have a ${context.streak} day streak.` : 'They are just starting their journey.'}

Be specific and helpful. If they ask for advice, give it. If they're struggling, help immediately.`;

    const userContext = context.previousMessages?.length
      ? `Previous conversation context: ${context.previousMessages.join(' | ')}\n\nUser (${context.username}): ${userMessage}`
      : `User (${context.username}): ${userMessage}`;

    console.log('🚀 Calling OpenRouter with automatic model selection...');

    const response = await generateAIResponse(
      userContext,
      systemPrompt
    );

    console.log('✅ AI response generated successfully:', response.substring(0, 50));
    return response;
  } catch (error: any) {
    console.error('❌ Error generating AI chat response:', {
      error: error?.message,
      fallback: 'Using fallback response'
    });
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
