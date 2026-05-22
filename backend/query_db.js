const prisma = require('./src/lib/prisma');

async function main() {
  const result = await prisma.memberCvProfile.findMany({ take: 5 });
  console.log(JSON.stringify(result, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
