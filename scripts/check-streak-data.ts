import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking current streak data...\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      currentStreak: true,
      lastCheckIn: true,
      lastSuccessfulDay: true,
      restoresUsedThisMonth: true,
      restoresResetAt: true,
    },
  });

  console.log('📊 User Streak Data:');
  console.log('='.repeat(80));
  for (const user of users) {
    console.log(`\nUser: ${user.username} (${user.id})`);
    console.log(`Current Streak: ${user.currentStreak}`);
    console.log(`Last Check-in: ${user.lastCheckIn}`);
    console.log(`Last Successful Day: ${user.lastSuccessfulDay}`);
    console.log(`Restores Used: ${user.restoresUsedThisMonth}/3`);
    console.log(`Restores Reset At: ${user.restoresResetAt}`);
  }

  console.log('\n📝 Recent Check-ins:');
  console.log('='.repeat(80));
  const checkIns = await prisma.checkIn.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { username: true },
      },
    },
  });

  for (const checkIn of checkIns) {
    console.log(`\n${checkIn.user.username}:`);
    console.log(`  Date: ${checkIn.date}`);
    console.log(`  Stayed on Track: ${checkIn.stayedOnTrack}`);
    console.log(`  Created: ${checkIn.createdAt}`);
  }

  console.log('\n🔄 Streak Restores:');
  console.log('='.repeat(80));
  const restores = await prisma.streakRestore.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { username: true },
      },
    },
  });

  if (restores.length === 0) {
    console.log('No restores found.');
  } else {
    for (const restore of restores) {
      console.log(`\n${restore.user.username}:`);
      console.log(`  Restored Date: ${restore.restoredDate}`);
      console.log(`  Streak at Restore: ${restore.streakAtRestore}`);
      console.log(`  Month/Year: ${restore.month}/${restore.year}`);
      console.log(`  Created: ${restore.createdAt}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
