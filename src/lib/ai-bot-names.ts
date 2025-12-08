import { generateAnonymousName as generateOpenRouterName } from '@/lib/openrouter';
import { generateAnonymousName as generateGeminiName } from '@/lib/gemini';

// Fallback AI bot names for when API calls fail
export const AI_BOT_NAMES = [
  // Girls
  'Anika', 'Nila', 'Diya', 'Yaazhini', 'Ishita',
  'Meera', 'Shruti', 'Varsha', 'Harini', 'Kavya',

  // Boys
  'Yuvan', 'Surya', 'Kavin', 'Aadhav', 'Vikram',
  'Pranav', 'Arjun', 'Rithvik', 'Karthik', 'Sharan',

  // Unisex / modern Tamil vibe
  'Aadhira', 'Thiya', 'Navin', 'Maya', 'Aaru',
  'Vinu', 'Sena', 'Riyaan', 'Laya', 'Tanu'
];

/**
 * Generate AI bot name dynamically using OpenRouter, with Gemini and static fallbacks
 */
export async function generateAIBotName(existingNames: string[] = []): Promise<string> {
  // Try OpenRouter first
  try {
    const name = await generateOpenRouterName(existingNames);
    if (name && !existingNames.includes(name)) {
      return name;
    }
  } catch (error) {
    console.log('OpenRouter name generation failed, trying Gemini...');
  }

  // Fallback to Gemini
  try {
    const name = await generateGeminiName(existingNames);
    if (name && !existingNames.includes(name)) {
      return name;
    }
  } catch (error) {
    console.log('Gemini name generation failed, using static fallback...');
  }

  // Final fallback to static list
  const availableNames = AI_BOT_NAMES.filter(name => !existingNames.includes(name));
  
  if (availableNames.length === 0) {
    // If all names are used, append a number
    const baseName = AI_BOT_NAMES[Math.floor(Math.random() * AI_BOT_NAMES.length)];
    let counter = 1;
    let newName = `${baseName} ${counter}`;
    while (existingNames.includes(newName)) {
      counter++;
      newName = `${baseName} ${counter}`;
    }
    return newName;
  }
  
  return availableNames[Math.floor(Math.random() * availableNames.length)];
}

