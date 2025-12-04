/**
 * Generates a pod name using OpenRouter AI API
 * Ensures uniqueness and relevance to the goal
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Generates a pod name using OpenRouter API with fallback
 */
export async function generatePodName(
  podType: 'REAL' | 'AI' = 'REAL',
  existingNames: string[] = [],
  goalCategory?: string | null,
  goalDescription?: string
): Promise<string> {
  try {
    if (!OPENROUTER_API_KEY) {
      console.warn('OpenRouter API key not configured, using fallback');
      return generateFallbackPodName(existingNames);
    }

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
- 1-3 words maximum
- Inspiring, positive, and motivating
- Related to growth, support, or achievement
- Examples: "Rising Phoenix", "Steady Progress", "Unstoppable Force", "Victory Circle", "Unity Squad"
- Make it completely unique and different from these existing names: ${existingNames.slice(0, 20).join(', ') || 'none'}
- The name should feel like a team identity that members can be proud of

Return ONLY the pod name, nothing else. No quotes, no explanation.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'PodLink Pod Name Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: 'You are a creative name generator. Return only the pod name with no additional text or explanation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status);
      return generateFallbackPodName(existingNames);
    }

    const data = await response.json();
    const generatedName = data.choices?.[0]?.message?.content?.trim() || '';

    // Clean up the name
    const cleanedName = generatedName
      .replace(/^["']|["']$/g, '')
      .replace(/\n/g, ' ')
      .trim();

    if (cleanedName && cleanedName.length > 0 && cleanedName.length < 50 && !existingNames.includes(cleanedName)) {
      return cleanedName;
    }

    return generateFallbackPodName(existingNames);
  } catch (error) {
    console.error('Error generating pod name with OpenRouter:', error);
    return generateFallbackPodName(existingNames);
  }
}

/**
 * Fallback pod name generator
 */
function generateFallbackPodName(existingNames: string[]): string {
  const baseNames = [
    'Orion', 'Phoenix', 'Titan', 'Vanguard', 'Zenith', 'Nexus', 'Apex',
    'Summit', 'Horizon', 'Eclipse', 'Nova', 'Pulse', 'Quantum', 'Catalyst',
    'Forge', 'Ascent', 'Legacy', 'Valor', 'Unity', 'Odyssey'
  ];
  
  const prefixes = [
    'Rising', 'Bold', 'Brave', 'Strong', 'Mighty', 'Noble', 'True',
    'Fierce', 'Swift', 'Bright', 'Radiant', 'Soaring', 'Endless'
  ];

  const suffixes = [
    'Warriors', 'Champions', 'Seekers', 'Builders', 'Guardians', 'Pioneers',
    'Force', 'Squad', 'Alliance', 'Circle', 'Collective', 'League'
  ];

  // Try single word names first
  const availableSingle = baseNames.filter(name => !existingNames.includes(name));
  if (availableSingle.length > 0) {
    return availableSingle[Math.floor(Math.random() * availableSingle.length)];
  }

  // Try prefix + base combinations
  let attempts = 0;
  while (attempts < 50) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const base = baseNames[Math.floor(Math.random() * baseNames.length)];
    const name = `${prefix} ${base}`;
    
    if (!existingNames.includes(name)) {
      return name;
    }
    attempts++;
  }

  // Try base + suffix combinations
  attempts = 0;
  while (attempts < 50) {
    const base = baseNames[Math.floor(Math.random() * baseNames.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${base} ${suffix}`;
    
    if (!existingNames.includes(name)) {
      return name;
    }
    attempts++;
  }

  // Last resort: use timestamp
  const timestamp = Date.now().toString(36).slice(-6);
  return `Pod_${timestamp}`;
}