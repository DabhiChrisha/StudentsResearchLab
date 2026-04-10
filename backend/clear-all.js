const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearAll() {
  try {
    console.log('Clearing all data...');
    await prisma.research_project_members.deleteMany({});
    await prisma.researchProjects.deleteMany({});
    await prisma.paperAuthor.deleteMany({});
    await prisma.publication.deleteMany({});
    await prisma.researchPaper.deleteMany({});
    await prisma.activity.deleteMany({});
    await prisma.debateScore.deleteMany({});
    await prisma.leaderboardStat.deleteMany({});
    await prisma.achievementContent.deleteMany({});
    await prisma.sessionContent.deleteMany({});
    await prisma.srlSession.deleteMany({});
    await prisma.memberCvProfile.deleteMany({});
    await prisma.joinUs.deleteMany({});
    await prisma.studentsDetail.deleteMany({});
    await prisma.timeline_entries.deleteMany({});
    console.log('✓ All data cleared');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearAll();
