const prisma = require('./src/lib/prisma');

async function main() {
  console.log('🚀 Recalculating All Time Statistics...\n');

  // 1. Aggregate totals from all monthly periods
  const aggregatedData = await prisma.$queryRaw`
    SELECT 
      enrollment_no, 
      SUM(attendance)::int as total_attendance, 
      SUM(hours)::float as total_hours, 
      SUM(debate_score)::int as total_debate
    FROM leaderboard_stats
    WHERE period NOT IN ('All Time', '2026-04')
    GROUP BY enrollment_no
  `;

  // 2. Get canonical names and serial numbers for consistent naming
  const lbCanonical = await prisma.leaderboardStat.findMany({
    where: { period: { notIn: ['All Time', '2026-04'] } },
    select: { enrollment_no: true, serial_no: true, student_name: true },
    orderBy: { created_at: 'desc' }
  });
  
  const canonicalMap = {};
  lbCanonical.forEach(l => {
    const enc = l.enrollment_no.toUpperCase().trim();
    if (!canonicalMap[enc]) {
      canonicalMap[enc] = {
        student_name: l.student_name,
        serial_no: l.serial_no
      };
    }
  });

  // 3. Update or Create "All Time" entries
  console.log(`Processing updates for ${aggregatedData.length} students...`);

  for (const row of aggregatedData) {
    const enc = row.enrollment_no.toUpperCase().trim();
    const canon = canonicalMap[enc];
    if (!canon) continue;

    const data = {
      serial_no: canon.serial_no,
      student_name: canon.student_name,
      attendance: row.total_attendance,
      hours: row.total_hours,
      debate_score: row.total_debate
    };

    // Upsert All Time record
    await prisma.leaderboardStat.upsert({
      where: {
        serial_no_period: {
          serial_no: canon.serial_no,
          period: 'All Time'
        }
      },
      update: data,
      create: {
        ...data,
        enrollment_no: enc,
        period: 'All Time'
      }
    });
  }

  console.log('\n✅ All Time statistics updated successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
