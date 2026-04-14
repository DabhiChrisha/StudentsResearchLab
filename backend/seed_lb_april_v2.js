const prisma = require('./src/lib/prisma');
const fs = require('fs');

async function main() {
  console.log('🚀 Starting April 2026 Leaderboard Seed...\n');

  // 1. Get canonical mapping from DB
  console.log('🔍 Fetching canonical student mappings...');
  const sd = await prisma.studentsDetail.findMany({
    select: { enrollment_no: true, student_name: true }
  });
  const lbCanonical = await prisma.leaderboardStat.findMany({
    where: { period: { notIn: ['2026-04', 'Apr 2026'] } },
    select: { enrollment_no: true, serial_no: true, student_name: true },
    orderBy: { created_at: 'desc' }
  });
  
  const canonicalMap = {};
  sd.forEach(s => {
    canonicalMap[s.enrollment_no.toUpperCase().trim()] = {
      student_name: s.student_name,
      serial_no: null
    };
  });
  lbCanonical.forEach(l => {
    const enc = l.enrollment_no.toUpperCase().trim();
    if (canonicalMap[enc] && canonicalMap[enc].serial_no === null) {
      canonicalMap[enc].serial_no = l.serial_no;
    }
  });

  // 2. Aggregate attendance and hours from the "attendance" table for April 2026
  console.log('📊 Aggregating attendance data from DB...');
  const attendanceData = await prisma.$queryRaw`
    SELECT enrollment_no, COUNT(*)::int as attendance, SUM(hours)::float as hours
    FROM attendance
    WHERE date >= '2026-04-01'::date AND date <= '2026-04-30'::date
    GROUP BY enrollment_no
  `;
  
  const statsMap = {};
  attendanceData.forEach(d => {
    statsMap[d.enrollment_no.toUpperCase().trim()] = {
      attendance: d.attendance,
      hours: d.hours
    };
  });

  // 3. Get debate_score from the April CSV
  console.log('📂 Reading debate scores from CSV...');
  const CSV_PATH = 'c:\\Users\\pandy\\OneDrive\\Desktop\\Desktop\\ReactJS\\StudentsResearchLab\\April 2026 - SRL Members Performance Sheet - Member Details.csv';
  const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
  const csvLines = csvContent.split('\r\n').filter(l => l.trim() !== '');
  const debateMap = {};
  
  for (let i = 2; i < csvLines.length; i++) {
    const cols = csvLines[i].split(',');
    if (cols.length < 16) continue;
    const enc = (cols[2] || '').trim().toUpperCase();
    const debate = parseInt(cols[15], 10) || 0;
    debateMap[enc] = debate;
  }

  // 4. Clean up stale data
  console.log('🧹 Cleaning up stale 2026-04 and Apr 2026 entries...');
  await prisma.$executeRaw`DELETE FROM leaderboard_stats WHERE period IN ('2026-04', 'Apr 2026')`;

  // 5. Build records for insertion
  const finalRecords = [];
  sd.forEach(s => {
    const enc = s.enrollment_no.toUpperCase().trim();
    const stats = statsMap[enc] || { attendance: 0, hours: 0 };
    const debate = debateMap[enc] || 0;
    const canonical = canonicalMap[enc] || { student_name: s.student_name, serial_no: 0 };
    
    // Only include if they have some data or appear in the CSV
    if (stats.attendance > 0 || stats.hours > 0 || debate > 0 || debateMap[enc] !== undefined) {
      finalRecords.push({
        serial_no: canonical.serial_no || 0,
        student_name: canonical.student_name,
        enrollment_no: enc,
        period: 'Apr 2026',
        attendance: stats.attendance,
        hours: stats.hours,
        debate_score: debate
      });
    }
  });

  console.log(`📝 Inserting ${finalRecords.length} records...`);
  
  // Batch insert
  await prisma.leaderboardStat.createMany({
    data: finalRecords
  });

  console.log('\n✅ April 2026 leaderboard seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
