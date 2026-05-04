const prisma = require('./src/lib/prisma');

(async () => {
  try {
    const admins = await prisma.authorization.findMany({
      where: { is_admin: true },
      select: { user_ID: true, is_admin: true }
    });
    console.log('Admins:', admins);

    const nonAdmins = await prisma.authorization.findMany({
      where: { is_admin: false },
      select: { user_ID: true, is_admin: true },
      take: 3
    });
    console.log('\nNon-admins (sample):', nonAdmins);
  } finally {
    await prisma.$disconnect();
  }
})();
