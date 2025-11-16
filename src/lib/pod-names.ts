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
    // If all names are used, create compound names
    const baseNames = [...FALLBACK_POD_NAMES];
    const suffixes = ['Rising', 'Victory', 'Unity', 'Progress', 'Strength', 'Valor', 'Noble', 'Prime'];
    
    let attempts = 0;
    while (attempts < 100) {
      const base = baseNames[Math.floor(Math.random() * baseNames.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const newName = `${suffix} ${base}`;
      
      if (!existingNames.includes(newName)) {
        return newName;
      }
      attempts++;
    }
    
    // Last resort: use timestamp in base36
    const timestamp = Date.now().toString(36).slice(-4);
    return `Pod_${timestamp}`;
  }
  
  const selectedName = availableNames[Math.floor(Math.random() * availableNames.length)];
  return selectedName;
}

