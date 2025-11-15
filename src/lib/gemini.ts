// Gemini API utility for generating anonymous names and AI responses

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Use gemini-1.5-flash for faster responses, or gemini-1.5-pro for better quality
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Generate a unique anonymous name using Gemini API
 * Ensures no repetition by checking against existing names
 */
export async function generateAnonymousName(
  existingNames: string[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback to random name if API key not set
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

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedName =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Clean up the name (remove quotes, extra whitespace)
    const cleanedName = generatedName
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .trim();

    if (cleanedName && !existingNames.includes(cleanedName)) {
      return cleanedName;
    }

    // If generated name is duplicate or empty, try fallback
    return generateFallbackName(existingNames);
  } catch (error) {
    console.error('Error generating name with Gemini:', error);
    // Fallback to random name generation
    return generateFallbackName(existingNames);
  }
}

/**
 * Fallback name generator if Gemini API fails
 */
function generateFallbackName(existingNames: string[]): string {
  const adjectives = [
    'Hopeful', 'Steady', 'Bright', 'Calm', 'Strong', 'Brave', 'Wise', 'Kind',
    'Gentle', 'Focused', 'Determined', 'Resilient', 'Peaceful', 'Joyful', 'Serene',
    'Bold', 'Warm', 'Swift', 'Eager', 'Graceful', 'Vibrant', 'Radiant', 'Quiet',
    'Daring', 'Noble', 'True', 'Pure', 'Clear', 'Fresh', 'Lively', 'Brisk',
  ];

  const nouns = [
    'Traveler', 'Walker', 'Seeker', 'Explorer', 'Warrior', 'Guardian', 'Friend', 'Companion',
    'Guide', 'Light', 'Star', 'Ocean', 'Mountain', 'River', 'Tree', 'Storm',
    'Flame', 'Shadow', 'Wind', 'Stone', 'Path', 'Journey', 'Dream', 'Hope',
    'Soul', 'Heart', 'Mind', 'Spirit', 'Dawn', 'Sunset', 'Moon', 'Sky',
  ];

  const secondAdjectives = [
    'Eager', 'Wise', 'Brave', 'Kind', 'Swift', 'Calm', 'Bright', 'Strong',
    'Gentle', 'Bold', 'Pure', 'True', 'Warm', 'Clear', 'Fresh', 'Quiet',
  ];

  // Try combinations without numbers first
  let attempts = 0;
  const maxAttempts = 500;
  
  while (attempts < maxAttempts) {
    let name: string;
    
    // 50% chance: Two-word combo (adjective + noun)
    // 30% chance: Three-word combo (adjective + adjective + noun)
    // 20% chance: Simple single adjective + noun
    const comboType = Math.random();
    
    if (comboType < 0.5) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      name = `${adj} ${noun}`;
    } else if (comboType < 0.8) {
      const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
      const adj2 = secondAdjectives[Math.floor(Math.random() * secondAdjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      // Avoid duplicate adjectives
      if (adj1 === adj2) {
        const adj2List = secondAdjectives.filter(a => a !== adj1);
        name = `${adj1} ${adj2List[Math.floor(Math.random() * adj2List.length)]} ${noun}`;
      } else {
        name = `${adj1} ${adj2} ${noun}`;
      }
    } else {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      name = `${adj} ${noun}`;
    }

    if (!existingNames.includes(name)) {
      return name;
    }
    attempts++;
  }

  // Last resort: use timestamp but format it attractively
  const timestamp = Date.now().toString(36).slice(-6); // Base36 encoding
  return `Traveler_${timestamp}`;
}

/**
 * Generate AI encouragement message using Gemini
 */
export async function generateAIEncouragement(
  goalDescription: string,
  context?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return getDefaultEncouragement();
  }

  try {
    const prompt = `Generate a brief, warm, and encouraging message for someone struggling with their goal: "${goalDescription}".
${context ? `Context: ${context}` : ''}

Requirements:
- Maximum 2-3 sentences
- Supportive and empathetic tone
- Focus on their strength and ability to overcome
- No personal advice, just general encouragement
- Clearly indicate this is an AI-generated message
- Example: "You're stronger than this moment. Take a deep breath and remember why you started. You've got this! 💪"

Return ONLY the message, nothing else.`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const message =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return message || getDefaultEncouragement();
  } catch (error) {
    console.error('Error generating encouragement with Gemini:', error);
    return getDefaultEncouragement();
  }
}

/**
 * Generate breathing/grounding prompt using Gemini
 */
export async function generateBreathingPrompt(
  goalCategory: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return getDefaultBreathingPrompt();
  }

  try {
    const prompt = `Generate a brief breathing or grounding exercise prompt for someone working on: "${goalCategory}".

Requirements:
- Simple, actionable steps
- 2-3 sentences maximum
- Calming and centering tone
- Example: "Take 3 deep breaths. Inhale for 4 counts, hold for 4, exhale for 4. Focus on the present moment."

Return ONLY the prompt, nothing else.`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const promptText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return promptText || getDefaultBreathingPrompt();
  } catch (error) {
    console.error('Error generating breathing prompt with Gemini:', error);
    return getDefaultBreathingPrompt();
  }
}

function getDefaultEncouragement(): string {
  const responses = [
    "I'm here with you. What's going on?",
    "Hey, tough moment? Let's work through this together.",
    "Take a pause - you've got this! What do you need right now?",
    "I hear you. What would help you most in this moment?",
    "One step at a time. What's the first small thing you can do?",
    "You're not alone in this. How can I support you?",
    "That sounds challenging. Want to talk about what you're feeling?",
    "I'm listening. What's on your mind?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getDefaultBreathingPrompt(): string {
  const prompts = [
    'Try the 4-4-4 breathing: inhale for 4, hold for 4, exhale for 4. Repeat 3 times.',
    'Take 5 slow, deep breaths. Focus just on your breathing - nothing else.',
    'Box breathing helps: 4 in, 4 hold, 4 out, 4 hold. You\'ve got this.',
    'Deep breath in... hold it... slow exhale. The urge will pass.',
    'Breathe with me: slow inhale through nose, long exhale through mouth.',
  ];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Generate pod name using Gemini API based on goal category and description
 */
export async function generatePodNameWithGemini(
  podType: 'REAL' | 'AI',
  existingNames: string[] = [],
  goalCategory?: string | null,
  goalDescription?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const podTypeContext = podType === 'AI' 
      ? 'This is an AI-powered accountability pod with supportive AI companions.'
      : 'This is a real human accountability pod where members support each other.';
    
    const goalContext = goalCategory 
      ? `The pod focuses on: ${goalCategory}. ${goalDescription ? `Goal: ${goalDescription}` : ''}`
      : 'Members are working on personal growth and habit change.';

    const prompt = `Generate a unique, inspiring, and memorable name for an accountability pod group.

Context:
${podTypeContext}
${goalContext}

Requirements:
- 1-2 words maximum
- Inspiring, positive, and motivating
- Related to growth, support, or achievement
- Examples: "Rising Phoenix", "Steady Progress", "Unstoppable", "Together Strong", "Victory Circle"
- Make it completely unique and different from these existing names: ${existingNames.join(', ') || 'none'}
- The name should feel like a team identity that members can be proud of

Return ONLY the pod name, nothing else. No quotes, no explanation.`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const generatedName =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Clean up the name (remove quotes, extra whitespace, newlines)
    const cleanedName = generatedName
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim()
      .split(' ')[0]; // Take first word if multiple words

    if (cleanedName && !existingNames.includes(cleanedName)) {
      return cleanedName;
    }

    throw new Error('Generated name is duplicate or invalid');
  } catch (error) {
    console.error('Error generating pod name with Gemini:', error);
    throw error;
  }
}

/**
 * Generate AI chat response for pod messages using Gemini
 */
export async function generateAIChatResponse(
  messageContext: {
    userMessage?: string;
    goalCategory?: string;
    goalDescription?: string;
    userName?: string;
    userStreak?: number;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return getDefaultEncouragement();
  }

  try {
    const {
      userMessage = '',
      goalCategory = '',
      goalDescription = '',
      userName = 'friend',
      userStreak = 0,
      conversationHistory = [],
    } = messageContext;

    const contextPrompt = goalCategory 
      ? `The user is working on: ${goalCategory}. ${goalDescription ? `Their goal: ${goalDescription}` : ''}`
      : 'The user is working on personal growth and habit change.';

    const streakContext = userStreak > 0 
      ? `They have a ${userStreak} day streak.`
      : 'They are just starting their journey.';

    const historyContext = conversationHistory.length > 0
      ? `\nRecent conversation:\n${conversationHistory.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const prompt = `You are Sam, a supportive friend in an accountability pod chat. ${contextPrompt} ${streakContext}${historyContext}

The user just said: "${userMessage}"

Respond naturally as a caring friend would. Be specific to their message:

- If they ask for advice, give practical, actionable tips
- If they mention urges/cravings, suggest immediate coping strategies
- If they're struggling, acknowledge their feeling and offer specific help
- If they share progress, celebrate with genuine excitement
- If they ask questions, give helpful answers
- Keep responses short (1-2 sentences max)
- Sound human and conversational, not robotic
- No generic motivational quotes
- Respond directly to what they said

Reply as Sam would, naturally and specifically to their message:`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const message =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return message || getDefaultEncouragement();
  } catch (error) {
    console.error('Error generating AI chat response with Gemini:', error);
    return getDefaultEncouragement();
  }
}

