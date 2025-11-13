import { PrismaClient } from '@prisma/client';
import { GoalType } from '../src/types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Only 3 real accounts - no demo accounts
const realUsers = [
  { username: 'brittytino', name: 'Britty Tino', email: 'brittytino@podlink.app' },
  { username: 'joshnie', name: 'Joshnie T', email: 'joshnie@podlink.app' },
  { username: 'silviya', name: 'Silviya J', email: 'silviya@podlink.app' },
];

async function main() {
  console.log('🌱 Seeding database with 3 real users...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.achievement.deleteMany();
  await prisma.crisisToolkitItem.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.podMessage.deleteMany();
  await prisma.crisisAlert.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pod.deleteMany();
  console.log('✅ Existing data cleared');

  // Create 3 real users (not demo accounts)
  const users = [];
  for (const userData of realUsers) {
    const hashedPassword = await bcrypt.hash(userData.username, 10);

    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        fullName: userData.name,
        timezone: 'Asia/Kolkata',
        availabilityHours: { start: '09:00', end: '22:00' },
        goalType: GoalType.BUILD_HABIT,
        goalDescription: 'Exercise daily',
        isDemoAccount: false, // Real accounts, not demo
        onboardingComplete: false, // They need to complete onboarding
        currentStreak: 0,
        lastCheckIn: null,
      },
    });

    users.push(user);
    console.log(`✅ Created real user: ${userData.name} (${userData.username})`);
  }

  console.log(`\n✅ Created ${users.length} real users\n`);
  console.log('📝 Login Credentials:');
  console.log('   Username: brittytino | Password: brittytino');
  console.log('   Username: joshnie | Password: joshnie');
  console.log('   Username: silviya | Password: silviya\n');
  console.log('ℹ️  Users need to complete onboarding to be assigned to pods.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
