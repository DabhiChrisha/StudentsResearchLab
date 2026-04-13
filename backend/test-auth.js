const prisma = require('./src/lib/prisma');

async function checkKeys() {
  const adminUser = await prisma.authorization.findFirst();
  console.log("Keys:", Object.keys(adminUser));
  await prisma.$disconnect();
}

checkKeys();
