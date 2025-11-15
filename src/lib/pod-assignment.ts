// Shared pod assignment logic that can be used by API routes and other services

import prisma from '@/lib/prisma';
import { generatePodName } from '@/lib/pod-names';
import { generateAIBotName } from '@/lib/ai-bot-names';
import { getSimilarGoalCategories } from '@/lib/goal-categories';
import { doTimeBandsOverlap, calculateResponsivenessScore } from '@/lib/pod-matching';
import bcrypt from 'bcryptjs';

interface UserWithGoal {
  goalCategory: string | null;
  goalType: string;
  goalDescription: string;
}

interface UserWithDetails extends UserWithGoal {
  availabilityHours: { start: string; end: string };
  currentStreak: number;
  lastCheckIn: Date | null;
  createdAt: Date;
}

export async function assignUserToPod(
  userId: string,
  podType: 'REAL' | 'AI',
  currentUser: UserWithDetails | UserWithGoal
): Promise<{ podId: string }> {
  if (podType === 'AI') {
    return await assignToAIPod(userId, currentUser as UserWithGoal);
  } else {
    return await assignToRealPod(userId, currentUser as UserWithDetails);
  }
}

async function assignToRealPod(userId: string, currentUser: UserWithDetails): Promise<{ podId: string }> {
  try {
    // Get similar goal categories for matching
    // If goalCategory is null or custom, try to match by goal description keywords
    let similarCategories: string[] = [];
    
    if (currentUser.goalCategory) {
      similarCategories = getSimilarGoalCategories(currentUser.goalCategory);
    } else if (currentUser.goalDescription) {
      // Dynamic matching based on goal description keywords
      const description = currentUser.goalDescription.toLowerCase();
      
      // Match keywords to categories based on goal type
      if (currentUser.goalType === 'BUILD_HABIT') {
        if (description.includes('read') || description.includes('book')) {
          similarCategories = ['build_reading'];
        } else if (description.includes('exercise') || description.includes('workout') || description.includes('gym') || description.includes('fitness')) {
          similarCategories = ['build_exercise', 'build_stretching'];
        } else if (description.includes('meditation') || description.includes('mindful')) {
          similarCategories = ['build_meditation', 'build_journaling'];
        } else if (description.includes('water') || description.includes('hydrat')) {
          similarCategories = ['build_water'];
        } else if (description.includes('sleep') || description.includes('wake')) {
          similarCategories = ['build_sleep_schedule', 'build_early_wake'];
        } else if (description.includes('plan') || description.includes('organiz')) {
          similarCategories = ['build_planning'];
        } else {
          // Default build categories
          similarCategories = ['build_exercise', 'build_meditation', 'build_reading'];
        }
      } else {
        // QUIT_HABIT matching
        if (description.includes('porn') || description.includes('adult content') || description.includes('masturbat')) {
          similarCategories = ['quit_pornography'];
        } else if (description.includes('social media') || description.includes('instagram') || description.includes('tiktok') || description.includes('facebook') || description.includes('twitter')) {
          similarCategories = ['quit_social_media', 'quit_late_night_phone'];
        } else if (description.includes('smoke') || description.includes('cigarette') || description.includes('vape')) {
          similarCategories = ['quit_smoking'];
        } else if (description.includes('alcohol') || description.includes('drink') || description.includes('drunk')) {
          similarCategories = ['quit_alcohol'];
        } else if (description.includes('game') || description.includes('gaming') || description.includes('video game')) {
          similarCategories = ['quit_gaming'];
        } else if (description.includes('procrastinat') || description.includes('delay') || description.includes('lazy')) {
          similarCategories = ['quit_procrastination', 'quit_avoiding_responsibilities'];
        } else if (description.includes('junk') || description.includes('fast food') || description.includes('unhealthy food')) {
          similarCategories = ['quit_junk_food'];
        } else {
          // Default quit categories
          similarCategories = ['quit_procrastination', 'quit_negative_self_talk', 'quit_social_media'];
        }
      }
    } else {
      // Fallback to default categories based on goal type
      similarCategories = currentUser.goalType === 'QUIT_HABIT' 
        ? ['quit_procrastination']
        : ['build_exercise'];
    }
    
    const userAvailabilityHours = currentUser.availabilityHours || { start: '09:00', end: '22:00' };

    // Ensure goalType is valid
    const goalType = currentUser.goalType === 'QUIT_HABIT' || currentUser.goalType === 'BUILD_HABIT'
      ? currentUser.goalType
      : 'BUILD_HABIT'; // Default fallback

    // Find existing pods with matching goal type (QUIT_HABIT or BUILD_HABIT) and similar categories
    // Primary matching: Same goal type (quit bad habits together, build good habits together)
    const whereClause: any = {
      podType: 'REAL',
      goalType: goalType, // Match by mindset: quit together or build together
      members: {
        some: {
          isAI: false,
        },
      },
    };

    // Secondary matching: Similar goal categories within the same goal type
    if (similarCategories.length > 0) {
      whereClause.goalCategory = { in: similarCategories };
    } else if (currentUser.goalDescription) {
      // Match pods with similar goal descriptions or any category of same type
      const description = currentUser.goalDescription.toLowerCase();
      const firstWord = description.split(' ')[0];
      if (firstWord && firstWord.length > 2) {
        whereClause.OR = [
          { goalDescription: { contains: firstWord, mode: 'insensitive' } },
          { goalCategory: { not: null } }, // Include pods with any category as fallback
        ];
      }
    }

    const candidatePods = await (prisma.pod.findMany as any)({
      where: whereClause,
      include: {
        members: {
          where: {
            isAI: false,
          },
          select: {
            id: true,
            availabilityHours: true,
            currentStreak: true,
            lastCheckIn: true,
            createdAt: true,
          },
        },
      },
    });

    // Score and find best matching pod with time-band overlap
    let bestPod: any = null;
    let bestScore = 0;

    for (const pod of candidatePods) {
      if (pod.members && pod.members.length >= 1 && pod.members.length < 4) {
        // Check time-band overlap with all existing members
        let hasOverlap = true;
        let totalScore = 0;

        for (const member of pod.members) {
          const memberHours = member.availabilityHours || { start: '09:00', end: '22:00' };
          if (!doTimeBandsOverlap(userAvailabilityHours, memberHours)) {
            hasOverlap = false;
            break;
          }
          // Calculate responsiveness score
          totalScore += calculateResponsivenessScore(
            {
              availabilityHours: userAvailabilityHours,
              currentStreak: currentUser.currentStreak || 0,
              lastCheckIn: currentUser.lastCheckIn,
              createdAt: currentUser.createdAt,
            },
            {
              availabilityHours: memberHours,
              currentStreak: member.currentStreak || 0,
              lastCheckIn: member.lastCheckIn,
              createdAt: member.createdAt,
            }
          );
        }

        if (hasOverlap) {
          const avgScore = totalScore / Math.max(pod.members.length, 1);
          if (avgScore > bestScore) {
            bestScore = avgScore;
            bestPod = pod;
          }
        }
      }
    }

    // If we found a good matching pod, assign user to it
    if (bestPod) {
      await prisma.user.update({
        where: { id: userId },
        data: { podId: bestPod.id },
      });
      return { podId: bestPod.id };
    }

    // Find other users waiting with similar goals and time-band overlap
    // Match by same goal type (quit together or build together) and similar categories
    const similarUsersWhere: any = {
      onboardingComplete: true,
      podId: null,
      isAI: false,
      id: { not: userId },
      goalType: goalType, // Same mindset: quit or build
    };

    // Only filter by category if we have categories, otherwise match by goal type only
    if (similarCategories.length > 0) {
      similarUsersWhere.goalCategory = { in: similarCategories };
    }

    const similarUsers = await (prisma.user.findMany as any)({
      where: similarUsersWhere,
      select: {
        id: true,
        availabilityHours: true,
        currentStreak: true,
        lastCheckIn: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
      take: 10, // Get more candidates to score
    });

    // Score users by responsiveness and time-band overlap
    const scoredUsers = similarUsers
      .map((user: any) => {
        const userHours = user.availabilityHours || { start: '09:00', end: '22:00' };
        const hasOverlap = doTimeBandsOverlap(userAvailabilityHours, userHours);
        if (!hasOverlap) return null;

        const score = calculateResponsivenessScore(
          {
            availabilityHours: userAvailabilityHours,
            currentStreak: currentUser.currentStreak || 0,
            lastCheckIn: currentUser.lastCheckIn,
            createdAt: currentUser.createdAt,
          },
          {
            availabilityHours: userHours,
            currentStreak: user.currentStreak || 0,
            lastCheckIn: user.lastCheckIn,
            createdAt: user.createdAt,
          }
        );

        return { ...user, score };
      })
      .filter((u: any) => u !== null)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 2); // Top 2 matches (so pod has max 3 members)

    // If we have at least 1 other user with similar goals and time overlap, create a new pod
    if (scoredUsers.length >= 1) {
      const podMembers = [userId, ...scoredUsers.slice(0, 2).map((u: any) => u.id)];

      // Get existing pod names to ensure uniqueness
      const allPodsForName = await prisma.pod.findMany({
        select: { name: true },
      });
      const existingNames = allPodsForName.map((p: { name: string }) => p.name);

      const podName = await generatePodName(
        'REAL',
        existingNames,
        currentUser.goalCategory,
        currentUser.goalDescription
      );

      const pod = await (prisma.pod.create as any)({
        data: {
          name: podName,
          totalStreak: 0,
          podType: 'REAL',
          goalType: goalType, // Store goal type for matching
          goalCategory: currentUser.goalCategory,
        },
      });

      // Assign users to pod
      await prisma.user.updateMany({
        where: {
          id: { in: podMembers },
        },
        data: {
          podId: pod.id,
        },
      });

      return { podId: pod.id };
    }

    // Create pod with just this user (will be filled later by rebalancer)
    const allPods = await prisma.pod.findMany({
      select: { name: true },
    });
    const existingNames = allPods.map((p: { name: string }) => p.name);
    const podName = await generatePodName(
      'REAL',
      existingNames,
      currentUser.goalCategory,
      currentUser.goalDescription
    );

    const pod = await (prisma.pod.create as any)({
      data: {
        name: podName,
        totalStreak: 0,
        podType: 'REAL',
        goalType: goalType, // Store goal type for matching
        goalCategory: currentUser.goalCategory,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { podId: pod.id },
    });

    return { podId: pod.id };
  } catch (error) {
    console.error('Error in assignToRealPod:', error);
    // Don't throw - return a podId anyway to avoid breaking onboarding
    // The user can be reassigned later
    throw error;
  }
}

async function assignToAIPod(userId: string, currentUser: UserWithGoal): Promise<{ podId: string }> {
  // Check if user is already in an AI pod
  const existingAIPod = await (prisma.pod.findFirst as any)({
    where: {
      podType: 'AI',
      members: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (existingAIPod) {
    return { podId: existingAIPod.id };
  }

  // Check for existing AI pod with same goal category
  const similarAIPod = await (prisma.pod.findFirst as any)({
    where: {
      podType: 'AI',
      goalCategory: currentUser.goalCategory,
      members: {
        some: {
          isAI: false,
        },
      },
    },
    include: {
      members: {
        where: {
          isAI: false,
        },
      },
    },
  });

  if (similarAIPod && similarAIPod.members && similarAIPod.members.length < 2) {
    // Add user to existing AI pod
    await prisma.user.update({
      where: { id: userId },
      data: { podId: similarAIPod.id },
    });
    return { podId: similarAIPod.id };
  }

  // Create a new AI pod with AI bots
  const existingPods = await prisma.pod.findMany({
    select: { name: true },
  });
  const existingNames = existingPods.map((p) => p.name);
  const podName = await generatePodName(
    'AI',
    existingNames,
    currentUser.goalCategory,
    currentUser.goalDescription
  );

  const pod = await (prisma.pod.create as any)({
    data: {
      name: podName,
      totalStreak: 0,
      podType: 'AI',
      goalCategory: currentUser.goalCategory!,
    },
  });

  // Assign the real user to the pod
  await prisma.user.update({
    where: { id: userId },
    data: { podId: pod.id },
  });

  // Create 1-2 AI bots for the pod
  const botCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 bots
  const existingBotNames: string[] = [];

  for (let i = 0; i < botCount; i++) {
    const botName = generateAIBotName(existingBotNames);
    existingBotNames.push(botName);

    const botEmail = `ai-${botName.toLowerCase()}-${pod.id.slice(0, 8)}@podlink.ai`;
    const botUsername = `ai_${botName.toLowerCase()}_${pod.id.slice(0, 8)}`;
    const hashedPassword = await bcrypt.hash('ai-bot-password', 10);

    await (prisma.user.create as any)({
      data: {
        username: botUsername,
        email: botEmail,
        password: hashedPassword,
        fullName: botName,
        displayName: botName, // AI bots use their name as display name
        timezone: 'UTC',
        availabilityHours: { start: '00:00', end: '23:59' },
        goalType: currentUser.goalType,
        goalDescription: currentUser.goalDescription,
        goalCategory: currentUser.goalCategory!,
        isAI: true,
        onboardingComplete: true,
        podId: pod.id,
        currentStreak: 0,
        availabilityMessage: "I'm always here to support you! 💪",
      },
    });
  }

  return { podId: pod.id };
}

