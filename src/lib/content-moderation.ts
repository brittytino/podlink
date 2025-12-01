/**
 * Content moderation utility for detecting offensive and racist language
 * Automatically filters messages without admin intervention
 */

// Comprehensive list of offensive words (English)
const OFFENSIVE_WORDS = [
  // Profanity
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'crap', 'piss', 'dick', 'cock',
  'pussy', 'cunt', 'bastard', 'whore', 'slut', 'fag', 'faggot', 'retard', 'motherfucker',
  'asshole', 'dumbass', 'jackass', 'dipshit', 'bullshit', 'horseshit', 'shithead','mairu','punda','suni','thaaili',
  
  // Racist slurs (partial list - being cautious)
  'nigger', 'nigga', 'chink', 'gook', 'spic', 'wetback', 'beaner', 'kike', 'kyke',
  'towelhead', 'raghead', 'paki', 'coon', 'cracker', 'honky', 'whitey', 'jap',
  
  // Hate speech
  'nazi', 'hitler', 'kkk', 'genocide', 'ethnic cleansing',
  
  // Sexual/explicit
  'porn', 'xxx', 'sex', 'rape', 'molest', 'pedophile', 'pedo',
  
  // Variants and leetspeak
  'fuk', 'fck', 'sh1t', 'b1tch', 'a$$', 'd1ck', 'c0ck', 'p0rn',
  'n1gga', 'n1gger', 'fag0t', 'ret4rd',
];

// Racist terms and phrases
const RACIST_PATTERNS = [
  /\b(all|every)\s+(blacks?|whites?|asians?|jews?|muslims?|arabs?|latinos?|hispanics?)\s+(are|is)\b/i,
  /\b(i\s+hate|fuck)\s+(blacks?|whites?|asians?|jews?|muslims?|arabs?|latinos?|hispanics?)\b/i,
  /\b(go\s+back\s+to)\s+(africa|mexico|china|india|your\s+country)\b/i,
  /\bwhite\s+power\b/i,
  /\bwhite\s+supremacy\b/i,
  /\b(race|racial)\s+superiority\b/i,
];

/**
 * Check if text contains offensive or racist content
 */
export function containsOffensiveContent(text: string): {
  isOffensive: boolean;
  reason?: string;
  matches?: string[];
} {
  if (!text || typeof text !== 'string') {
    return { isOffensive: false };
  }

  const normalizedText = text.toLowerCase().trim();
  const matches: string[] = [];

  // Check for offensive words
  for (const word of OFFENSIVE_WORDS) {
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalizedText)) {
      matches.push(word);
    }
  }

  // Check for racist patterns
  for (const pattern of RACIST_PATTERNS) {
    if (pattern.test(normalizedText)) {
      matches.push('racist language pattern detected');
    }
  }

  if (matches.length > 0) {
    return {
      isOffensive: true,
      reason: 'Contains offensive or inappropriate language',
      matches,
    };
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

  let censored = text;

  // Replace offensive words with asterisks
  for (const word of OFFENSIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    censored = censored.replace(regex, '*'.repeat(word.length));
  }

  return censored;
}

/**
 * Validate message before allowing it to be sent
 */
export function validateMessage(text: string): {
  isValid: boolean;
  error?: string;
  shouldDelete?: boolean;
} {
  const check = containsOffensiveContent(text);

  if (check.isOffensive) {
    return {
      isValid: false,
      error: check.reason || 'Message contains inappropriate content',
      shouldDelete: true,
    };
  }

  return { isValid: true };
}

/**
 * Moderate message after it's been reported
 */
export async function moderateReportedMessage(messageText: string): Promise<{
  shouldDelete: boolean;
  reason?: string;
}> {
  const check = containsOffensiveContent(messageText);

  return {
    shouldDelete: check.isOffensive,
    reason: check.reason,
  };
}
