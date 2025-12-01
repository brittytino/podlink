import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAllStreaks() {
  console.log('🔧 Resetting all AI user streaks...\n');

  const result = await prisma.user.updateMany({
    where: {
      isAI: true,
      currentStreak: {
        gt: 0,
      },
    },
    data: {
      currentStreak: 0,
      lastSuccessfulDay: null,
    },
  });

  console.log(`✅ Reset ${result.count} AI user streaks\n`);
}

resetAllStreaks()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
