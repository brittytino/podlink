import { generatePodNameWithGemini } from './gemini';

// Fallback pod names if Gemini fails
export const FALLBACK_POD_NAMES = [
  'Orion', 'Andromeda', 'Sirius', 'Polaris', 'Vega', 'Arcturus', 
  'Cassiopeia', 'Phoenix', 'Lyra', 'Altair', 'Betelgeuse', 'Rigel',
  'Antares', 'Capella', 'Spica', 'Aldebaran', 'Bellatrix', 'Deneb',
  'Fomalhaut', 'Regulus', 'Castor', 'Pollux', 'Procyon', 'Mira',
];

/**
 * Generates a pod name using Gemini API, with fallback to random selection
 * Ensures uniqueness by checking existing pod names
 */
export async function generatePodName(
  podType: 'REAL' | 'AI' = 'REAL',
  existingNames: string[] = [],
  goalCategory?: string | null,
  goalDescription?: string
): Promise<string> {
  try {
    // Try Gemini first
    const geminiName = await generatePodNameWithGemini(
      podType,
      existingNames,
      goalCategory,
      goalDescription
    );
    if (geminiName && !existingNames.includes(geminiName)) {
      return geminiName;
    }
  } catch (error) {
    console.error('Error generating pod name with Gemini:', error);
  }

  // Fallback to random selection
  const availableNames = FALLBACK_POD_NAMES.filter(name => !existingNames.includes(name));
  
  if (availableNames.length === 0) {
    // If all names are used, append a number
    const baseName = FALLBACK_POD_NAMES[Math.floor(Math.random() * FALLBACK_POD_NAMES.length)];
    let counter = 1;
    let newName = `${baseName}-${counter}`;
    while (existingNames.includes(newName)) {
      counter++;
      newName = `${baseName}-${counter}`;
    }
    return newName;
  }
  
  const selectedName = availableNames[Math.floor(Math.random() * availableNames.length)];
  // Add timestamp suffix for uniqueness
  return `${selectedName}-${Date.now().toString().slice(-4)}`;
}

