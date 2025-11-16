// Comprehensive AI response system with categories and timing

interface AIResponseContext {
  goalCategory?: string;
  goalDescription?: string;
  streak?: number;
  timeSinceAlert?: number; // seconds
  previousResponses?: string[];
  userName?: string;
}

// Category A: Immediate Validation (0-30 seconds)
const IMMEDIATE_VALIDATION = [
  "Hey {name}, I see you're struggling right now. That takes courage to admit. Take 3 deep breaths with me. In... and out...",
  "You reached out instead of giving in — that's already a victory. Let's get through this moment together.",
  "This urge will pass. They always do. You're stronger than this temporary feeling.",
  "I'm here with you right now. You're not alone in this moment.",
  "The fact that you're asking for help shows strength, not weakness.",
];

// Category B: Distraction Techniques (30-60 seconds)
const DISTRACTION_TECHNIQUES = [
  "Quick challenge: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Ground yourself in this moment.",
  "Your body is trying to trick you. Do 10 pushups RIGHT NOW. Change your physical state to change your mental state.",
  "Call someone you trust. Hearing a real voice will shift your brain chemistry. Do it now — who will you call?",
  "Put on your shoes and walk outside for 2 minutes. Fresh air changes everything.",
  "Drink a full glass of cold water. Right now. Your body needs hydration, not that craving.",
];

// Category C: Goal-Specific Encouragement (1-2 minutes)
const GOAL_SPECIFIC: Record<string, string[]> = {
  quit_social_media: [
    "Remember why you started this. Those 3 hours you waste scrolling? Imagine what you could create instead. Your future self is begging you to stay strong.",
    "That notification can wait. Your mental health can't. You made the right choice reaching out.",
    "The urge to scroll is not your fault — these apps are designed by engineers to be addictive. But you're smarter than their algorithms.",
    "Feeling FOMO? Remember: everyone's highlight reel vs your behind-the-scenes. It's fake. Your real life is happening HERE.",
    "You'll never regret NOT scrolling. But you'll always regret the wasted hours.",
  ],
  build_exercise: [
    "Your body is designed to move. Just 5 minutes. Put on your shoes. Walk out the door. That's all. The hard part is starting.",
    "You don't have to do a full workout. Just move. 5 minutes. That's it. Start now.",
    "Your future self will thank you for this moment. Just start. One step at a time.",
    "Exercise releases endorphins. You'll feel better in 10 minutes. Just start.",
  ],
  quit_junk_food: [
    "That craving is just a chemical signal. It'll be gone in 20 minutes. Drink a full glass of water and eat an apple. Give your body what it actually needs.",
    "Your body doesn't need that junk. It needs real nutrition. Make the better choice right now.",
    "Think about how you'll feel after eating that vs. how you'll feel after eating something healthy. Choose wisely.",
  ],
  quit_procrastination: [
    "The hardest part is starting. Just do 2 minutes. Set a timer. You can do anything for 2 minutes.",
    "Your future self is counting on you. Don't let them down. Start now.",
    "Break it down. What's the smallest possible first step? Do that. Right now.",
  ],
  build_meditation: [
    "Your mind needs a break. Close your eyes. Breathe. Just 2 minutes. That's all.",
    "Meditation isn't about clearing your mind. It's about observing your thoughts without judgment. Try it now.",
  ],
};

// Category D: Streak Protection (2-5 minutes)
const STREAK_PROTECTION = {
  high: [ // > 7 days
    "You've built a {streak} day streak. That's {streak} victories. Don't let one weak moment erase all that progress.",
    "You're in the top 1% of people who stick with their goals. Act like it. Don't quit now.",
    "Think about all the days you said no. Today is just another day. You've got this.",
  ],
  medium: [ // 3-7 days
    "You've built real momentum. {streak} days of progress. Don't break the chain now.",
    "You're building a real habit. This is when it gets hard. Push through.",
  ],
  low: [ // 0-2 days
    "Every master was once a beginner. Today is Day {streak}. Make it count.",
    "You're starting fresh. That's brave. Let's make today Day 1 of your success story.",
  ],
};

// Category E: Long-term Vision (5-10 minutes)
const LONG_TERM_VISION = [
  "Close your eyes. Picture yourself 90 days from now. You stuck with this. You're proud. You're different. THAT version of you is possible — but only if you don't give up right now.",
  "What would the person you want to become do in this moment? Be that person. Decide right now.",
  "Your pod is counting on you. Your streak affects theirs. You're not just fighting for yourself — you're fighting for your team.",
  "Future you is watching. Make them proud. Don't give up.",
];

// Category F: Follow-up (After 15 minutes)
const FOLLOW_UP = [
  "Hey, checking in. Did you make it through? How are you feeling now?",
  "You're still here. That means you didn't give in. Proud of you. Want to talk about what triggered this?",
  "I'm here if you need to talk. You're not alone in this.",
];

/**
 * Get AI response based on context and timing
 */
export function getContextualAIResponse(context: AIResponseContext = {}): string {
  const {
    goalCategory = '',
    goalDescription = '',
    streak = 0,
    timeSinceAlert = 0,
    previousResponses = [],
    userName = 'friend',
  } = context;

  // Replace {name} and {streak} placeholders
  const replacePlaceholders = (text: string) => {
    return text
      .replace(/{name}/g, userName)
      .replace(/{streak}/g, streak.toString());
  };

  // Filter out previously used responses
  const filterUsed = (responses: string[]) => {
    return responses.filter(r => !previousResponses.includes(r));
  };

  let selectedResponse = '';

  // Category F: Follow-up (15+ minutes)
  if (timeSinceAlert >= 900) {
    const available = filterUsed(FOLLOW_UP);
    if (available.length > 0) {
      selectedResponse = available[Math.floor(Math.random() * available.length)];
    } else {
      selectedResponse = FOLLOW_UP[Math.floor(Math.random() * FOLLOW_UP.length)];
    }
  }
  // Category E: Long-term Vision (5-10 minutes)
  else if (timeSinceAlert >= 300) {
    const available = filterUsed(LONG_TERM_VISION);
    if (available.length > 0) {
      selectedResponse = available[Math.floor(Math.random() * available.length)];
    } else {
      selectedResponse = LONG_TERM_VISION[Math.floor(Math.random() * LONG_TERM_VISION.length)];
    }
  }
  // Category D: Streak Protection (2-5 minutes)
  else if (timeSinceAlert >= 120) {
    let streakCategory: 'high' | 'medium' | 'low';
    if (streak > 7) streakCategory = 'high';
    else if (streak >= 3) streakCategory = 'medium';
    else streakCategory = 'low';

    const available = filterUsed(STREAK_PROTECTION[streakCategory]);
    if (available.length > 0) {
      selectedResponse = available[Math.floor(Math.random() * available.length)];
    } else {
      selectedResponse = STREAK_PROTECTION[streakCategory][Math.floor(Math.random() * STREAK_PROTECTION[streakCategory].length)];
    }
  }
  // Category C: Goal-Specific (1-2 minutes)
  else if (timeSinceAlert >= 60) {
    const goalResponses = GOAL_SPECIFIC[goalCategory] || [];
    if (goalResponses.length > 0) {
      const available = filterUsed(goalResponses);
      if (available.length > 0) {
        selectedResponse = available[Math.floor(Math.random() * available.length)];
      } else {
        selectedResponse = goalResponses[Math.floor(Math.random() * goalResponses.length)];
      }
    } else {
      // Fallback to distraction techniques
      const available = filterUsed(DISTRACTION_TECHNIQUES);
      if (available.length > 0) {
        selectedResponse = available[Math.floor(Math.random() * available.length)];
      } else {
        selectedResponse = DISTRACTION_TECHNIQUES[Math.floor(Math.random() * DISTRACTION_TECHNIQUES.length)];
      }
    }
  }
  // Category B: Distraction Techniques (30-60 seconds)
  else if (timeSinceAlert >= 30) {
    const available = filterUsed(DISTRACTION_TECHNIQUES);
    if (available.length > 0) {
      selectedResponse = available[Math.floor(Math.random() * available.length)];
    } else {
      selectedResponse = DISTRACTION_TECHNIQUES[Math.floor(Math.random() * DISTRACTION_TECHNIQUES.length)];
    }
  }
  // Category A: Immediate Validation (0-30 seconds)
  else {
    const available = filterUsed(IMMEDIATE_VALIDATION);
    if (available.length > 0) {
      selectedResponse = available[Math.floor(Math.random() * available.length)];
    } else {
      selectedResponse = IMMEDIATE_VALIDATION[Math.floor(Math.random() * IMMEDIATE_VALIDATION.length)];
    }
  }

  return replacePlaceholders(selectedResponse);
}

/**
 * Get AI encouragement (backward compatibility)
 */
export function getAIEncouragement(context?: {
  goalType?: string;
  goalDescription?: string;
  previousResponse?: string;
}): string {
  return getContextualAIResponse({
    goalDescription: context?.goalDescription,
    timeSinceAlert: 0,
  });
}
