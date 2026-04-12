const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.authorization.findFirst();
    console.log('user:', user);
  } catch (e) {
    console.error('error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
