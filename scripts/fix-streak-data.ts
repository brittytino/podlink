import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixStreakData() {
  console.log('🔧 Starting streak data fix...\n');

  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  console.log(`Current date: ${now.toISOString()}`);
  console.log(`Two days ago: ${twoDaysAgo.toISOString()}\n`);

  // Get all users with check-ins
  const users = await prisma.user.findMany({
    where: {
      currentStreak: {
        gt: 0, // Has a streak
      },
    },
    select: {
      id: true,
      username: true,
      currentStreak: true,
      lastCheckIn: true,
      lastSuccessfulDay: true,
    },
  });

  console.log(`Found ${users.length} users with active streaks\n`);

  let resetCount = 0;
  let updatedCount = 0;

  for (const user of users) {
    console.log(`\n👤 Processing: ${user.username}`);
    console.log(`   Current streak: ${user.currentStreak}`);
    console.log(`   Last check-in: ${user.lastCheckIn}`);
    console.log(`   Last successful day: ${user.lastSuccessfulDay}`);

    // If last check-in was more than 2 days ago, reset streak
    if (user.lastCheckIn && user.lastCheckIn < twoDaysAgo) {
      console.log(`   ❌ Streak expired (last check-in was ${Math.floor((now.getTime() - user.lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))} days ago)`);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          currentStreak: 0,
          lastSuccessfulDay: null,
        },
      });
      
      resetCount++;
      console.log(`   ✅ Reset to 0`);
    } 
    // If last check-in was recent but lastSuccessfulDay is null, initialize it
    else if (user.lastCheckIn && !user.lastSuccessfulDay) {
      console.log(`   🔄 Initializing lastSuccessfulDay from lastCheckIn`);
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastSuccessfulDay: user.lastCheckIn,
        },
      });
      
      updatedCount++;
      console.log(`   ✅ Set lastSuccessfulDay to ${user.lastCheckIn}`);
    }
  }

  console.log('\n\n📊 Summary:');
  console.log('='.repeat(80));
  console.log(`Streaks reset (expired): ${resetCount}`);
  console.log(`Streaks updated (initialized lastSuccessfulDay): ${updatedCount}`);
  console.log(`Total users processed: ${users.length}`);
  
  console.log('\n✅ Streak data fix completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Users should see their streaks reset to 0');
  console.log('   2. When they check in next time, the new system will work correctly');
  console.log('   3. Future check-ins will use the grace period and restore system\n');
}

fixStreakData()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
