import prisma from '@/lib/prisma';
import { getSimilarGoalCategories } from '@/lib/goal-categories';
import { generatePodName } from '@/lib/pod-names';
import { generateAIBotName } from '@/lib/ai-bot-names';
import bcrypt from 'bcryptjs';

interface UserWithGoal {
  goalCategory: string | null;
  goalType: string | null;
  goalDescription: string | null;
}

interface UserWithDetails extends UserWithGoal {
  availabilityHours: { start: string; end: string };
  currentStreak: number;
  lastCheckIn: Date | null;
  createdAt: Date;
}

// Comprehensive keyword mapping for goal descriptions
const GOAL_KEYWORDS = {
  QUIT_HABIT: {
    // Addiction and substance-related
    quit_pornography: ['porn', 'pornography', 'adult content', 'masturbat', 'sexual content', 'xxx', 'adult videos', 'sexual addiction'],
    quit_smoking: ['smoke', 'smoking', 'cigarette', 'tobacco', 'vape', 'vaping', 'nicotine', 'e-cigarette', 'cigar'],
    quit_alcohol: ['alcohol', 'drinking', 'beer', 'wine', 'liquor', 'drunk', 'booze', 'vodka', 'whiskey', 'cocktail'],
    quit_gambling: ['gambling', 'bet', 'betting', 'poker', 'casino', 'lottery', 'scratch card', 'slot machine'],
    
    // Technology and social media
    quit_social_media: ['social media', 'instagram', 'tiktok', 'facebook', 'twitter', 'snapchat', 'youtube', 'reddit', 'linkedin'],
    quit_gaming: ['gaming', 'video game', 'game', 'xbox', 'playstation', 'steam', 'mobile game', 'online game'],
    quit_late_night_phone: ['phone at night', 'late night phone', 'phone in bed', 'screen before bed', 'night scrolling'],
    quit_binge_watching: ['binge watching', 'netflix', 'tv shows', 'streaming', 'television', 'movies all day'],
    
    // Food and eating habits
    quit_junk_food: ['junk food', 'fast food', 'unhealthy food', 'processed food', 'candy', 'chips', 'soda', 'sugar'],
    quit_energy_drinks: ['energy drink', 'red bull', 'monster', 'caffeine addiction', 'coffee addiction'],
    quit_overeating: ['overeating', 'binge eating', 'emotional eating', 'food addiction', 'eating too much'],
    
    // Behavioral habits
    quit_procrastination: ['procrastination', 'procrastinat', 'delaying', 'putting off', 'avoiding work', 'lazy', 'time wasting'],
    quit_negative_self_talk: ['negative self talk', 'self criticism', 'negative thoughts', 'self doubt', 'inner critic'],
    quit_nail_biting: ['nail biting', 'biting nails', 'nail chewing', 'picking nails'],
    quit_overspending: ['overspending', 'shopping addiction', 'impulse buying', 'spending too much', 'financial waste'],
    quit_lying: ['lying', 'dishonesty', 'being dishonest', 'telling lies', 'not truthful'],
    quit_anger: ['anger', 'rage', 'getting angry', 'losing temper', 'aggressive', 'violent'],
    quit_jealousy: ['jealousy', 'being jealous', 'envy', 'comparison', 'comparing myself'],
    quit_gossiping: ['gossip', 'gossiping', 'talking behind back', 'spreading rumors', 'negative talk'],
    quit_avoiding_responsibilities: ['avoiding responsibilities', 'avoiding duties', 'running away', 'escaping'],
    quit_oversleeping: ['oversleeping', 'sleeping too much', 'snoozing', 'hitting snooze', 'waking up late']
  },
  
  BUILD_HABIT: {
    // Fitness and health
    build_exercise: ['exercise', 'workout', 'gym', 'fitness', 'running', 'jogging', 'cardio', 'strength training', 'sports'],
    build_stretching: ['stretching', 'yoga', 'flexibility', 'mobility', 'poses', 'stretch'],
    build_cold_showers: ['cold shower', 'cold water', 'ice bath', 'cold therapy', 'cold exposure'],
    
    // Mental health and mindfulness
    build_meditation: ['meditation', 'meditate', 'mindfulness', 'mindful', 'breathing', 'zen', 'calm'],
    build_journaling: ['journaling', 'writing diary', 'daily reflection', 'gratitude journal', 'writing thoughts'],
    build_prayer: ['prayer', 'praying', 'spiritual practice', 'worship', 'religious practice'],
    
    // Learning and productivity
    build_reading: ['reading', 'books', 'reading books', 'study', 'learning', 'literature'],
    build_learning: ['learning', 'skill', 'coding', 'programming', 'language', 'course', 'education'],
    build_planning: ['planning', 'organizing', 'goal setting', 'scheduling', 'time management', 'planner'],
    
    // Health habits
    build_water: ['drinking water', 'hydration', 'water intake', '8 glasses', 'staying hydrated'],
    build_healthy_eating: ['healthy eating', 'nutritious food', 'meal prep', 'balanced diet', 'clean eating'],
    build_sleep_schedule: ['sleep schedule', 'consistent sleep', 'sleep routine', 'bedtime', 'sleep hygiene'],
    build_early_wake: ['early wake', 'waking up early', '5am', '6am', 'morning routine', 'early bird'],
    
    // Social and relationships
    build_family_calls: ['calling family', 'family time', 'parents', 'family connection', 'staying in touch'],
    build_compliments: ['compliments', 'complimenting', 'positive words', 'encouraging others', 'kindness'],
    build_helping: ['helping others', 'acts of kindness', 'volunteering', 'being helpful', 'service'],
    build_relationships: ['relationships', 'meaningful connections', 'deep conversations', 'friendship'],
    
    // Financial and creative
    build_saving: ['saving money', 'financial discipline', 'budget', 'emergency fund', 'investing'],
    build_creative: ['creative work', 'art', 'writing', 'music', 'drawing', 'painting', 'creativity'],
    build_digital_detox: ['digital detox', 'screen free time', 'unplugged', 'device free', 'tech break']
  }
};

/**
 * Enhanced goal category detection from description
 */
function detectGoalCategoryFromDescription(
  goalDescription: string,
  goalType: 'QUIT_HABIT' | 'BUILD_HABIT'
): string | null {
  if (!goalDescription) return null;
  
  const description = goalDescription.toLowerCase().trim();
  const keywords = GOAL_KEYWORDS[goalType];
  
  // Find the best matching category based on keyword matches
  let bestCategory = null;
  let maxMatches = 0;
  
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    const matches = categoryKeywords.filter(keyword => 
      description.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

export async function assignUserToPod(
  userId: string,
  podType: 'REAL' | 'AI',
  currentUser: UserWithDetails | UserWithGoal
): Promise<{ podId: string }> {
  try {
    console.log('Starting pod assignment for user:', userId);
    
    // Normalize user data
    const normalizedUser = {
      goalType: (currentUser.goalType as 'QUIT_HABIT' | 'BUILD_HABIT') || 'BUILD_HABIT',
      goalDescription: currentUser.goalDescription || '',
      goalCategory: currentUser.goalCategory,
    };
    
    // Detect goal category from description if not set
    if (!normalizedUser.goalCategory && normalizedUser.goalDescription) {
      const detectedCategory = detectGoalCategoryFromDescription(
        normalizedUser.goalDescription,
        normalizedUser.goalType
      );
      normalizedUser.goalCategory = detectedCategory;
      console.log(`Detected goal category: ${detectedCategory} for description: "${normalizedUser.goalDescription}"`);
    }
    
    if (podType === 'AI') {
      return await assignToAIPod(userId, normalizedUser);
    } else {
      return await assignToRealPod(userId, normalizedUser);
    }
  } catch (error) {
    console.error('Pod assignment error:', error);
    // Create a fallback single-user pod to prevent onboarding failure
    return await createFallbackPod(userId, currentUser);
  }
}

/**
 * Assign user to a real pod with other users
 */
async function assignToRealPod(userId: string, currentUser: UserWithGoal): Promise<{ podId: string }> {
  try {
    // Look for existing pods with similar goals and space
    const similarCategories = currentUser.goalCategory ? 
      getSimilarGoalCategories(currentUser.goalCategory) : [];
    
    const whereClause: any = {
      podType: 'REAL',
      goalType: currentUser.goalType,
      members: {
        some: {
          isAI: false,
        },
      },
    };
    
    // Add category filtering if we have categories
    if (similarCategories.length > 0) {
      whereClause.goalCategory = { in: [currentUser.goalCategory, ...similarCategories] };
    }
    
    // Find candidate pods (not full, has space for new member)
    const candidatePods = await prisma.pod.findMany({
      where: whereClause,
      include: {
        members: {
          where: { isAI: false },
        },
      },
    });
    
    // Find a pod with space
    const availablePod = candidatePods.find(pod => pod.members.length < 4);
    
    if (availablePod) {
      await prisma.user.update({
        where: { id: userId },
        data: { podId: availablePod.id },
      });
      console.log(`Assigned user ${userId} to existing pod ${availablePod.id}`);
      return { podId: availablePod.id };
    }
    
    // No existing pods with space, create single-user pod
    return await createFallbackPod(userId, currentUser);
    
  } catch (error) {
    console.error('Error in assignToRealPod:', error);
    return await createFallbackPod(userId, currentUser);
  }
}

/**
 * Assign user to AI pod
 */
async function assignToAIPod(userId: string, currentUser: UserWithGoal): Promise<{ podId: string }> {
  try {
    // Check if user already has an AI pod
    const existingAIPod = await prisma.pod.findFirst({
      where: {
        podType: 'AI',
        members: { some: { id: userId } },
      },
    });
    
    if (existingAIPod) {
      return { podId: existingAIPod.id };
    }
    
    // Create new AI pod
    return await createNewAIPod(userId, currentUser);
    
  } catch (error) {
    console.error('Error in assignToAIPod:', error);
    return await createNewAIPod(userId, currentUser);
  }
}

/**
 * Create new AI pod with bots
 */
async function createNewAIPod(userId: string, currentUser: UserWithGoal): Promise<{ podId: string }> {
  try {
    const podCategory = currentUser.goalCategory || 'general';
    
    const existingPods = await prisma.pod.findMany({
      select: { name: true },
    });
    const existingNames = existingPods.map(p => p.name);
    const podName = await generatePodName(
      'AI',
      existingNames,
      podCategory,
      currentUser.goalDescription || ''
    );
    
    const pod = await prisma.pod.create({
      data: {
        name: podName,
        totalStreak: 0,
        podType: 'AI',
        goalType: currentUser.goalType as 'QUIT_HABIT' | 'BUILD_HABIT',
        goalCategory: podCategory,
      },
    });
    
    // Assign user to pod
    await prisma.user.update({
      where: { id: userId },
      data: { podId: pod.id },
    });
    
    // Create 1-2 AI bots
    const botCount = Math.floor(Math.random() * 2) + 1;
    const existingBotNames: string[] = [];
    
    for (let i = 0; i < botCount; i++) {
      const botName = generateAIBotName(existingBotNames);
      existingBotNames.push(botName);
      
      // Sanitize bot name for email and username (remove spaces, special chars)
      const sanitizedName = botName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const botEmail = `ai-${sanitizedName}-${pod.id.slice(0, 8)}@podlink.ai`;
      const botUsername = `ai_${sanitizedName.replace(/-/g, '_')}_${pod.id.slice(0, 8)}`;
      
      await prisma.user.create({
        data: {
          username: botUsername,
          email: botEmail,
          password: null, // AI bots don't need passwords
          fullName: botName,
          displayName: botName,
          timezone: 'UTC',
          availabilityHours: { start: '00:00', end: '23:59' },
          goalType: currentUser.goalType as 'QUIT_HABIT' | 'BUILD_HABIT',
          goalDescription: currentUser.goalDescription || '',
          goalCategory: podCategory,
          isAI: true,
          onboardingComplete: true,
          podId: pod.id,
          currentStreak: 0,
          availabilityMessage: "I'm always here to support you! 💪",
        },
      });
    }
    
    console.log(`Created new AI pod ${pod.id} with ${botCount} bots for user ${userId}`);
    return { podId: pod.id };
  } catch (error) {
    console.error('Error creating AI pod:', error);
    throw error;
  }
}

async function createFallbackPod(userId: string, currentUser: UserWithGoal): Promise<{ podId: string }> {
  try {
    const podCategory = currentUser.goalCategory || 'general';
    
    const existingPods = await prisma.pod.findMany({
      select: { name: true },
    });
    const existingNames = existingPods.map(p => p.name);
    const podName = await generatePodName(
      'REAL',
      existingNames,
      podCategory,
      currentUser.goalDescription || ''
    );
    
    const pod = await prisma.pod.create({
      data: {
        name: podName,
        totalStreak: 0,
        podType: 'REAL',
        goalType: currentUser.goalType as 'QUIT_HABIT' | 'BUILD_HABIT',
        goalCategory: podCategory,
      },
    });
    
    await prisma.user.update({
      where: { id: userId },
      data: { podId: pod.id },
    });
    
    return { podId: pod.id };
  } catch (error) {
    console.error('Error creating fallback pod:', error);
    throw new Error('Failed to assign pod');
  }
}
