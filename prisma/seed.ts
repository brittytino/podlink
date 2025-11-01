import { PrismaClient } from '@prisma/client';
import { GoalType } from '../src/types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const goalDescriptions: Record<GoalType, string[]> = {
  QUIT_HABIT: [
    'Quit social media scrolling',
    'Stop procrastinating',
    'Reduce screen time',
    'Quit junk food',
    'Stop negative thinking',
  ],
  BUILD_HABIT: [
    'Exercise daily',
    'Read more books',
    'Meditate regularly',
    'Drink more water',
    'Wake up early',
  ],
};

const podNames = [
  'Pod Alpha', 'Pod Beta', 'Pod Gamma', 'Pod Delta', 'Pod Epsilon',
  'Pod Zeta', 'Pod Eta', 'Pod Theta', 'Pod Iota', 'Pod Kappa',
  'Pod Lambda', 'Pod Mu', 'Pod Nu', 'Pod Xi', 'Pod Omicron',
  'Pod Pi', 'Pod Rho', 'Pod Sigma', 'Pod Tau', 'Pod Upsilon',
];

const sampleMessages = [
  'Stay strong! You got this! 💪',
  'Remember why you started',
  'One day at a time, friend',
  'We believe in you!',
  'You\'re doing amazing!',
  'Keep pushing forward',
  'Proud of your progress',
  'Let\'s crush this together!',
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create 63 demo users (25mx301 to 25mx363)
  const users = [];
  for (let i = 301; i <= 363; i++) {
    const username = `25mx${i}`;
    const hashedPassword = await bcrypt.hash(username, 10);
    const goalType = i % 2 === 0 ? GoalType.QUIT_HABIT : GoalType.BUILD_HABIT;
    const goalDescArray = goalDescriptions[goalType];
    const goalDescription = goalDescArray[i % goalDescArray.length];

    const user = await prisma.user.create({
      data: {
        username,
        email: `${username}@podlink.demo`,
        password: hashedPassword,
        fullName: `Demo User ${i}`,
        timezone: 'Asia/Kolkata',
        availabilityHours: { start: '09:00', end: '22:00' },
        goalType,
        goalDescription,
        isDemoAccount: true,
        onboardingComplete: true,
        currentStreak: Math.floor(Math.random() * 30),
        lastCheckIn: new Date(Date.now() - Math.random() * 86400000), // Random within last 24h
      },
    });

    users.push(user);
  }

  console.log(`✅ Created ${users.length} demo users`);

  // Create pods (3-4 members each)
  const pods = [];
  let userIndex = 0;
  let podIndex = 0;

  while (userIndex < users.length) {
    const membersCount = Math.random() > 0.5 ? 4 : 3;
    const podMembers = users.slice(userIndex, userIndex + membersCount);
    
    const pod = await prisma.pod.create({
      data: {
        name: podNames[podIndex] || `Pod ${podIndex + 1}`,
        totalStreak: podMembers.reduce((sum, u) => sum + u.currentStreak, 0),
      },
    });

    // Assign users to pod
    await prisma.user.updateMany({
      where: { id: { in: podMembers.map(u => u.id) } },
      data: { podId: pod.id },
    });

    pods.push({ pod, members: podMembers });
    userIndex += membersCount;
    podIndex++;
  }

  console.log(`✅ Created ${pods.length} pods`);

  // Create historical check-ins for each user (last 7 days)
  for (const user of users) {
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(20, 0, 0, 0);

      await prisma.checkIn.create({
        data: {
          userId: user.id,
          stayedOnTrack: Math.random() > 0.3, // 70% success rate
          date,
        },
      });
    }
  }

  console.log('✅ Created check-in history');

  // Create pod messages
  for (const { pod, members } of pods) {
    for (let i = 0; i < 15; i++) {
      const randomMember = members[Math.floor(Math.random() * members.length)];
      const messageText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

      await prisma.podMessage.create({
        data: {
          podId: pod.id,
          userId: randomMember.id,
          messageText,
          isCrisisResponse: Math.random() > 0.7,
        },
      });
    }
  }

  console.log('✅ Created pod messages');

  // Create crisis alerts (2 per pod, 1 active, 1 resolved)
  for (const { pod, members } of pods) {
    // Active alert
    const activeMember = members[0];
    await prisma.crisisAlert.create({
      data: {
        userId: activeMember.id,
        podId: pod.id,
        message: 'Feeling tempted right now, need support!',
        status: 'ACTIVE',
        responseCount: Math.floor(Math.random() * 3),
      },
    });

    // Resolved alert
    const resolvedMember = members[1];
    await prisma.crisisAlert.create({
      data: {
        userId: resolvedMember.id,
        podId: pod.id,
        message: 'Had a tough moment earlier',
        status: 'RESOLVED',
        responseCount: members.length - 1,
        resolvedAt: new Date(Date.now() - Math.random() * 3600000),
      },
    });
  }

  console.log('✅ Created crisis alerts');

  // Create crisis toolkit items for each user
  const toolkitTemplates = [
    { title: 'Take a walk', description: 'Go outside for 10 minutes of fresh air' },
    { title: 'Deep breathing', description: '5 deep breaths, count to 4 on each' },
    { title: 'Call a friend', description: 'Reach out to someone you trust' },
    { title: 'Cold shower', description: '2 minutes of cold water to reset' },
    { title: 'Journal', description: 'Write down what you\'re feeling' },
  ];

  for (const user of users) {
    const itemCount = 3 + Math.floor(Math.random() * 2); // 3-4 items
    for (let i = 0; i < itemCount; i++) {
      const template = toolkitTemplates[i % toolkitTemplates.length];
      await prisma.crisisToolkitItem.create({
        data: {
          userId: user.id,
          title: template.title,
          description: template.description,
          orderPosition: i,
        },
      });
    }
  }

  console.log('✅ Created crisis toolkit items');

  // Create achievements
  for (const { pod, members } of pods) {
    // Pod achievements
    if (pod.totalStreak >= 7) {
      await prisma.achievement.create({
        data: {
          podId: pod.id,
          badgeType: 'SEVEN_DAY_STREAK',
        },
      });
    }

    if (pod.totalStreak >= 30) {
      await prisma.achievement.create({
        data: {
          podId: pod.id,
          badgeType: 'THIRTY_DAY_STREAK',
        },
      });
    }

    // Individual achievements
    for (const member of members) {
      if (member.currentStreak >= 7) {
        await prisma.achievement.create({
          data: {
            userId: member.id,
            badgeType: 'SEVEN_DAY_STREAK',
          },
        });
      }
    }
  }

  console.log('✅ Created achievements');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
