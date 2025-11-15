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
    'Practice gratitude',
    'Learn a new skill',
    'Maintain a journal',
    'Get organized',
    'Eat healthier',
  ],
};

// Actual user data provided
const userData = [
  { rollNo: '25MX301', name: 'ABISHEK S' },
  { rollNo: '25MX302', name: 'Aishwarya R' },
  { rollNo: '25MX303', name: 'Ajay Vishal B' },
  { rollNo: '25MX304', name: 'Aravindh Kannan M S' },
  { rollNo: '25MX305', name: 'Bhuvisha Sri Priya.P' },
  { rollNo: '25MX306', name: 'Chittesh' },
  { rollNo: '25MX307', name: 'DARUNYA SRI.M' },
  { rollNo: '25MX308', name: 'Dayananda J' },
  { rollNo: '25MX309', name: 'Deepa M' },
  { rollNo: '25MX310', name: 'Dhakshanamoorthy S' },
  { rollNo: '25MX311', name: 'Dinesh Kumar' },
  { rollNo: '25MX312', name: 'S.Dinesh Kumar' },
  { rollNo: '25MX313', name: 'G.Lalit Chandran' },
  { rollNo: '25MX314', name: 'HARI ANAND B' },
  { rollNo: '25MX315', name: 'Induja E' },
  { rollNo: '25MX316', name: 'Jackson Solomon Raj M' },
  { rollNo: '25MX317', name: 'Janani T' },
  { rollNo: '25MX318', name: 'JEEVA SILVIYA J' },
  { rollNo: '25MX319', name: 'Jessica.A' },
  { rollNo: '25MX320', name: 'Joshnie T' },
  { rollNo: '25MX321', name: 'Karthick K' },
  { rollNo: '25MX322', name: 'Kasbiya. M' },
  { rollNo: '25MX323', name: 'Keerthanaa J' },
  { rollNo: '25MX324', name: 'Kevin Johnson A A' },
  { rollNo: '25MX325', name: 'Kirsaan F' },
  { rollNo: '25MX326', name: 'Meyappan R' },
  { rollNo: '25MX327', name: 'Mithra N' },
  { rollNo: '25MX328', name: 'MITHULESH N' },
  { rollNo: '25MX329', name: 'Mohana Priya M' },
  { rollNo: '25MX330', name: 'Monish P' },
  { rollNo: '25MX331', name: 'Mugundhan KP' },
  { rollNo: '25MX332', name: 'Muthu Sailappan' },
  { rollNo: '25MX333', name: 'Naga Sruthi M' },
  { rollNo: '25MX334', name: 'NANDHITHASRI T' },
  { rollNo: '25MX335', name: 'Naveen pranab T' },
  { rollNo: '25MX336', name: 'Nitheesh Muthu Krishnan C' },
  { rollNo: '25MX337', name: 'Nithyashree C' },
  { rollNo: '25MX338', name: 'Poorani R' },
  { rollNo: '25MX339', name: 'PRABHAKAR O S' },
  { rollNo: '25MX340', name: 'Puratchiyan' },
  { rollNo: '25MX341', name: 'RADHU DHARSAN K M' },
  { rollNo: '25MX342', name: 'ROHITHMAHESHWARAN K' },
  { rollNo: '25MX343', name: 'SABARISH P' },
  { rollNo: '25MX344', name: 'Satya Pramodh R' },
  { rollNo: '25MX345', name: 'Shri Sanjay M' },
  { rollNo: '25MX346', name: 'Siddarth M R' },
  { rollNo: '25MX347', name: 'Sivapradeesh M' },
  { rollNo: '25MX348', name: 'S.S.SOBAN' },
  { rollNo: '25MX349', name: 'Sowmiya' },
  { rollNo: '25MX350', name: 'SRIVIKASHNI S' },
  { rollNo: '25MX351', name: 'SURIYA G V' },
  { rollNo: '25MX352', name: 'Tamilini S' },
  { rollNo: '25MX353', name: 'Trisha R' },
  { rollNo: '25MX354', name: 'Tino Britty J' },
  { rollNo: '25MX355', name: 'Vaishali S' },
  { rollNo: '25MX356', name: 'Vignesh M' },
  { rollNo: '25MX357', name: 'VijayaShri' },
  { rollNo: '25MX358', name: 'VIKRAM SETHUPATHY S' },
  { rollNo: '25MX359', name: 'Vishnuvardani K S' },
  { rollNo: '25MX360', name: 'Yaswanth R T' },
  { rollNo: '25MX361', name: 'Sanjana M' },
  { rollNo: '25MX362', name: 'Narayanasamy' },
  { rollNo: '25MX363', name: 'Tharun S' },
];

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
  console.log('🌱 Seeding database with 63 users...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.achievement.deleteMany();
  await prisma.crisisToolkitItem.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.podMessage.deleteMany();
  await prisma.crisisAlert.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pod.deleteMany();
  console.log('✅ Existing data cleared');

  // Create 63 users with actual names
  const users = [];
  for (let i = 0; i < userData.length; i++) {
    const { rollNo, name } = userData[i];
    // Username and password are the same (rollNo in lowercase)
    const username = rollNo.toLowerCase();
    const hashedPassword = await bcrypt.hash(username, 10);
    const goalType = i % 2 === 0 ? GoalType.QUIT_HABIT : GoalType.BUILD_HABIT;
    const goalDescArray = goalDescriptions[goalType];
    const goalDescription = goalDescArray[i % goalDescArray.length];

    const user = await prisma.user.create({
      data: {
        username,
        email: `${username}@podlink.demo`,
        password: hashedPassword,
        fullName: name,
        timezone: 'Asia/Kolkata',
        availabilityHours: { start: '09:00', end: '22:00' },
        goalType,
        goalDescription,
        isDemoAccount: true,
        onboardingComplete: true,
        currentStreak: Math.floor(Math.random() * 30),
        lastCheckIn: new Date(Date.now() - Math.random() * 86400000),
      },
    });

    users.push(user);
    console.log(`✅ Created user: ${name} (${username})`);
  }

  console.log(`\n✅ Created ${users.length} users\n`);

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
    console.log(`✅ Created ${pod.name} with ${podMembers.length} members`);
    userIndex += membersCount;
    podIndex++;
  }

  console.log(`\n✅ Created ${pods.length} pods\n`);

  // Create historical check-ins for each user (last 7 days)
  console.log('📅 Creating check-in history...');
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
  console.log('✅ Created check-in history\n');

  // Create pod messages
  console.log('💬 Creating pod messages...');
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
  console.log('✅ Created pod messages\n');

  // Create crisis alerts (2 per pod, 1 active, 1 resolved)
  console.log('🚨 Creating crisis alerts...');
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
  console.log('✅ Created crisis alerts\n');

  // Create crisis toolkit items for each user
  console.log('🛠️ Creating crisis toolkit items...');
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
  console.log('✅ Created crisis toolkit items\n');

  // Create achievements
  console.log('🏆 Creating achievements...');
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
  console.log('✅ Created achievements\n');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('   Username: 25mx301 (or any roll number in lowercase)');
  console.log('   Password: Same as username (e.g., 25mx301)\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
