const { PrismaClient } = require('./src/generated/prisma');
(async () => {
  const p = new PrismaClient();
  try {
    const res = await p.$queryRawUnsafe("SELECT conname, pg_get_constraintdef(oid) as def FROM pg_constraint WHERE conrelid = 'publication'::regclass;");
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('ERROR', e && e.message ? e.message : e);
  } finally {
    await p.$disconnect();
  }
})();
