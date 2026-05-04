const prisma = require('./src/lib/prisma');

(async () => {
  try {
    const cv = await prisma.memberCvProfile.findFirst({ select: { enrollment_no: true } });
    console.log('Enrollment number:', cv?.enrollment_no || 'none');
  } finally {
    await prisma.$disconnect();
  }
})();
