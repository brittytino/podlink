// Friendly AI bot names for AI pods
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
 * Generates a random AI bot name
 */
export function generateAIBotName(existingNames: string[] = []): string {
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

