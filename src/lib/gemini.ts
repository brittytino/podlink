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
    'Hopeful',
    'Steady',
    'Bright',
    'Calm',
    'Strong',
    'Brave',
    'Wise',
    'Kind',
    'Gentle',
    'Focused',
    'Determined',
    'Resilient',
    'Peaceful',
    'Joyful',
    'Serene',
  ];

  const nouns = [
    'Traveler',
    'Walker',
    'Seeker',
    'Explorer',
    'Warrior',
    'Guardian',
    'Friend',
    'Companion',
    'Guide',
    'Light',
    'Star',
    'Ocean',
    'Mountain',
    'River',
    'Tree',
  ];

  let attempts = 0;
  while (attempts < 100) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    const name = `${adjective} ${noun} ${number}`;

    if (!existingNames.includes(name)) {
      return name;
    }
    attempts++;
  }

  // Last resort
  return `Anonymous User ${Date.now()}`;
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
  return "You're stronger than this moment. Take a deep breath and remember why you started. You've got this! 💪 (AI-generated encouragement)";
}

function getDefaultBreathingPrompt(): string {
  return 'Take 3 deep breaths. Inhale for 4 counts, hold for 4, exhale for 4. Focus on the present moment.';
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
      ? `They have a ${userStreak} day streak. Encourage them to maintain it.`
      : 'They are just starting their journey.';

    const historyContext = conversationHistory.length > 0
      ? `\nRecent conversation:\n${conversationHistory.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const prompt = `You are a supportive AI accountability companion in a pod chat. ${contextPrompt} ${streakContext}${historyContext}

User's message: "${userMessage}"

Generate a brief, warm, and encouraging response (2-3 sentences maximum):
- Be empathetic and supportive
- Acknowledge their struggle or achievement
- Offer practical encouragement
- Keep it conversational and friendly
- If they're struggling, remind them they're not alone
- If they're celebrating, celebrate with them
- Always end on a positive note

Return ONLY your response message, nothing else.`;

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

