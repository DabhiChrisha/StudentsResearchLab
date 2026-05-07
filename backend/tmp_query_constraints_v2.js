require('dotenv').config();
const prisma = require('./src/config/prisma');
(async () => {
  try {
    const res = await prisma.$queryRawUnsafe("SELECT conname, pg_get_constraintdef(oid) as def FROM pg_constraint WHERE conrelid = 'publication'::regclass;");
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('ERROR', e && e.message ? e.message : e);
  } finally {
    try { await prisma.$disconnect(); } catch(_){}
  }
})();
