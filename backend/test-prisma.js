const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing Prisma client...');
    console.log('Available models:');
    console.log('- studentsDetail:', typeof prisma.studentsDetail);
    console.log('- research_project_members:', typeof prisma.research_project_members);
    console.log('- research_projects:', typeof prisma.research_projects);
    console.log('- timeline_entries:', typeof prisma.timeline_entries);
    
    const count = await prisma.studentsDetail.count();
    console.log(`\nStudents count: ${count}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
