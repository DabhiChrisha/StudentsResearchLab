const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportAllData() {
  try {
    console.log('Starting data export...');

    const data = {
      studentsDetails: await prisma.studentsDetail.findMany(),
      debateScores: await prisma.debateScore.findMany(),
      sessionContents: await prisma.sessionContent.findMany(),
      srlSessions: await prisma.srlSession.findMany(),
      leaderboardStats: await prisma.leaderboardStat.findMany(),
      achievementContents: await prisma.achievementContent.findMany(),
      joinUses: await prisma.joinUs.findMany(),
      memberCvProfiles: await prisma.memberCvProfile.findMany(),
      publications: await prisma.publication.findMany(),
      researchPapers: await prisma.researchPaper.findMany(),
      paperAuthors: await prisma.paperAuthor.findMany(),
      activities: await prisma.activity.findMany(),
      researchProjectMembers: await prisma.research_project_members.findMany(),
      researchProjects: await prisma.research_projects.findMany(),
      timelineEntries: await prisma.timeline_entries.findMany(),
    };

    const outputPath = path.join(__dirname, '..', 'prisma', 'exported_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2));
    
    console.log('✓ Data exported successfully to prisma/exported_data.json');
    console.log(`\nData summary:`);
    console.log(`- Students: ${data.studentsDetails.length}`);
    console.log(`- Debate Scores: ${data.debateScores.length}`);
    console.log(`- Session Contents: ${data.sessionContents.length}`);
    console.log(`- Leaderboard Stats: ${data.leaderboardStats.length}`);
    console.log(`- Achievement Contents: ${data.achievementContents.length}`);
    console.log(`- Join Requests: ${data.joinUses.length}`);
    console.log(`- Member CV Profiles: ${data.memberCvProfiles.length}`);
    console.log(`- Publications: ${data.publications.length}`);
    console.log(`- Research Papers: ${data.researchPapers.length}`);
    console.log(`- Paper Authors: ${data.paperAuthors.length}`);
    console.log(`- Activities: ${data.activities.length}`);
    console.log(`- Research Projects: ${data.researchProjects.length}`);
    console.log(`- Timeline Entries: ${data.timelineEntries.length}`);

  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportAllData();
