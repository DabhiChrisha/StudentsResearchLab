const { PrismaClient } = require('@prisma/client');

const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function getData() {
  try {
    const students = await prisma.studentsDetail.findMany({ take: 3 });
    const activities = await prisma.activity.findMany({ take: 2 });
    const leaderboard = await prisma.leaderboardStat.findMany({ take: 2 });

    console.log('STUDENTS:');
    console.log(JSON.stringify(students, null, 2));
    console.log('\nACTIVITIES:');
    console.log(JSON.stringify(activities, null, 2));
    console.log('\nLEADERBOARD:');
    console.log(JSON.stringify(leaderboard, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

getData();
