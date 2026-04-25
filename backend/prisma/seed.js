const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting comprehensive database seed...\n');

    // ==================== SEED students_details ====================
    console.log('📚 Seeding students_details (37 records)...');
    const students = [
      { student_name: 'Ghetiya Poojan Rahulbhai', enrollment_no: '25MECE30003', institute_name: 'LDRP-ITR', department: 'ME', semester: 2, division: 'A', batch: '2025-2027', email: 'ghetiyapoojan@gmail.com', contact_no: '8530088085', gender: 'male', member_type: 'General Members', profile_image: '/students/Ghetiya Poojan Rahulbhai.jpeg' },
      { student_name: 'Dev Kansara', enrollment_no: '24BECE30114', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'kansaradev95@gmail.com', contact_no: '9925669832', gender: 'male', member_type: 'Peer-Nominated', profile_image: '/students/Kansara Dev Dharmeshkumar.jpeg' },
      { student_name: 'Antra Gajjar', enrollment_no: '24BECE30081', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'gajjarantra03@gmail.com', contact_no: '7990912121', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Gajjar Antra Ashvinkumar.jpeg' },
      { student_name: 'Yash Kumavat', enrollment_no: '24BECE30122', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'yashnkumavat2005@gmail.com', contact_no: '8128575707', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Yash Kumavat.jpeg' },
      { student_name: 'Chrisha Manish Dabhi', enrollment_no: '24BECE30489', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'G', batch: '2024-2028', email: 'chrishaadabhii0704@gmail.com', contact_no: '9870094446', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Dabhi Chrisha Manish.png' },
      { student_name: 'Rudr Halvadiya', enrollment_no: '24BECE30094', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'rudrhalvadiya2000@gmail.com', contact_no: '9427375784', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Halvdadiya Rudr.jpeg' },
      { student_name: 'Pragati Varu', enrollment_no: '24BECE30436', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'pragativaru23@gmail.com', contact_no: '9875122785', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Pragati Varu.jpeg' },
      { student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'pandyaaayush2006@gmail.com', contact_no: '9687041106', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Pandya Aayush Viral.jpeg' },
      { student_name: 'Yajurshi Velani', enrollment_no: '24BECE30441', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'yajurshivelani@gmail.com', contact_no: '8799123685', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Yajurshi Velani.png' },
      { student_name: 'Mahi Parmar', enrollment_no: '24BECE30548', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'mahiparmar2708@gmail.com', contact_no: '9998801402', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Parmar Mahi Nitinchandra.jpeg' },
      { student_name: 'Bhagyashree Jadeja', enrollment_no: '24BECE30099', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'bhagyashreejadeja76@gmail.com', contact_no: '6356020582', gender: 'female', member_type: 'General Members', profile_image: '/students/Jadeja Bhagyashree.jpeg' },
      { student_name: 'Honey Modha', enrollment_no: '224SBECE30016', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'honeymodha02@gmail.com', contact_no: '8141912433', gender: 'female', member_type: 'General Members', profile_image: '/students/Honey Modha.jpeg' },
      { student_name: 'Prem Raichura', enrollment_no: '224SBECE30059', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'premraichura7@gmail.com', contact_no: '9327681649', gender: 'male', member_type: 'Peer-Nominated', profile_image: '/students/Prem Raichura.jpeg' },
      { student_name: 'Hetvi Hinsu', enrollment_no: '23BECE30449', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'hetvi0925@gmail.com', contact_no: '9428086585', gender: 'female', member_type: 'Peer-Nominated', profile_image: '/students/Hetvi Hinsu.jpeg' },
      { student_name: 'Banshari Patel', enrollment_no: '23BECE30168', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'bansharipatel6595@gmail.com', contact_no: '9724334964', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Patel Banshari Rahulkumar.jpg' },
      { student_name: 'Mihir Patel', enrollment_no: '23BECE30542', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'mihir.rockshi@gmail.com', contact_no: '9428038999', gender: 'male', member_type: 'Peer-Nominated', profile_image: '/students/Mihir Patel.png' },
      { student_name: 'Heny Patel', enrollment_no: '23BECE30521', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'henypatel26012005@gmail.com', contact_no: '9328211453', gender: 'male', member_type: 'Peer-Nominated', profile_image: '/students/Heny Patel.jpeg' },
      { student_name: 'Krish Patel', enrollment_no: '23BECE30532', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'krishp728@gmail.com', contact_no: '8780064214', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Patel Krish Himanshu.jpeg' },
      { student_name: 'Hemant Pande', enrollment_no: '23BECE30493', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'hp926591@gmail.com', contact_no: '8780508139', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Pande Hemant Rameshwarkumar.jpeg' },
      { student_name: 'Rachita Devda', enrollment_no: '23BECE30059', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'rachitadevda0410@gmail.com', contact_no: '9313258627', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Devda Rachita Bharatsinh.jpeg' },
      { student_name: 'Jainee Patel', enrollment_no: '23BECE30203', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'jainu2426@gmail.com', contact_no: '7984123552', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Patel Jainee Hasmukhbhai.jpeg' },
      { student_name: 'Krishna Bhatt', enrollment_no: '23BECE30023', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'bhattkrishna0908@gmail.com', contact_no: '6354262335', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Krishna Bhatt.jpeg' },
      { student_name: 'Yashvi Chavda', enrollment_no: '23BECE30036', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'yashvichavda6@gmail.com', contact_no: '6356519390', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Chavda Yashvi Surendrasinh.jpeg' },
      { student_name: 'Charmi Padh', enrollment_no: '23BECE30144', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'charmi.padh030206@gmail.com', contact_no: '7016405750', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Padh Charmi Ketankumar.jpeg' },
      { student_name: 'Henit Panchal', enrollment_no: '23BECE30490', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'henitpanchal007@gmail.com', contact_no: '9016809674', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Panchal Henit Shaileshbhai.jpeg' },
      { student_name: 'Jenish Sorathiya', enrollment_no: '23BEIT54020', institute_name: 'VS-ITR', department: 'IT', semester: 6, division: 'A', batch: '2023-2027', email: '23beit54020@vsitr.ac.in', contact_no: '9099158812', gender: 'male', member_type: 'General Members', profile_image: '/students/Jenish Sorathiya.jpeg' },
      { student_name: 'Kanksha Buch', enrollment_no: '23BECE30029', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'kanksha.buch@gmail.com', contact_no: '7203073100', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Kanksha Keyur Buch.jpeg' },
      { student_name: 'Janki Chitroda', enrollment_no: '23BECE30040', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'jankichitroda8@gmail.com', contact_no: '9499676967', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Janki Chitroda.jpeg' },
      { student_name: 'Rohan Thakar', enrollment_no: '23BECE30364', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'rpthakar35@gmail.com', contact_no: '8320846359', gender: 'male', member_type: 'Peer-Nominated', profile_image: '/students/Rohan Thakar.png' },
      { student_name: 'Zeel Kanudawala', enrollment_no: '23BECE30101', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'zeelkanudawala@gmail.com', contact_no: '6355424403', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Kanudawala Zeel PareshKumar.jpeg' },
      { student_name: 'Zenisha Devani', enrollment_no: '23BECE30058', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'zenishadevani@gmail.com', contact_no: '6359222727', gender: 'female', member_type: 'Peer-Nominated', profile_image: '/students/Zenisha Devani.jpeg' },
      { student_name: 'Parva Kumar', enrollment_no: '22BECE30153', institute_name: 'LDRP-ITR', department: 'CE', semester: 8, division: 'A', batch: '2022-2026', email: 'parva300504@gmail.com', contact_no: '9510493577', gender: 'male', member_type: 'Peer-Nominated', profile_image: '/students/Parva Kumar.jpeg' },
      { student_name: 'Kandarp Gajjar', enrollment_no: '22BECE30091', institute_name: 'LDRP-ITR', department: 'CE', semester: 8, division: 'B', batch: '2022-2026', email: 'kandarp.gajjar.460@gmail.com', contact_no: '7567600101', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Kandarp Gajjar.jpeg' },
      { student_name: 'Ridham Patel', enrollment_no: '22BEIT30133', institute_name: 'LDRP-ITR', department: 'IT', semester: 8, division: 'B', batch: '2022-2026', email: 'ridhampatel2k4@gmail.com', contact_no: '8849155025', gender: 'male', member_type: 'Head-Appointed', profile_image: '/students/Ridham Patel.png' },
      { student_name: 'Nancy Patel', enrollment_no: '22BEIT30123', institute_name: 'LDRP-ITR', department: 'IT', semester: 8, division: 'B', batch: '2022-2026', email: 'nancyp9210@gmail.com', contact_no: '9725673402', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Nancy.jpeg' },
      { student_name: 'Krutika Patel', enrollment_no: '22BEIT30118', institute_name: 'LDRP-ITR', department: 'IT', semester: 8, division: 'B', batch: '2022-2026', email: 'krutika8114@gmail.com', contact_no: '9624336970', gender: 'female', member_type: 'Head-Appointed', profile_image: '/students/Krutika Vijaybhai Patel.jpeg' },
      { student_name: 'Patel Hency Mukesh', enrollment_no: '24BECE30225', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'hencypatel@student.ksvuniversity.ac.in', contact_no: '7990434969', gender: 'female', member_type: 'General Members', profile_image: '/students/Hency Patel.jpeg' },
      { student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'arnab.ghosh@student.ldrp.edu.in', contact_no: '9327940710', gender: 'male', member_type: null, profile_image: '/students/Arnab Ghosh.jpeg' },
    ];

    for (const student of students) {
      await prisma.StudentsDetail.upsert({
        where: { enrollment_no: student.enrollment_no },
        update: {},
        create: { ...student, created_at: new Date('2026-02-22T19:03:28.076Z') },
      });
    }
    console.log(`✅ Seeded ${students.length} students\n`);

    // ==================== SEED SRL_SESSIONS ====================
    console.log('📅 Seeding srl_sessions (11 records)...');
    const sessions = [
      '2025-11-08', '2025-12-12', '2025-12-27', '2026-01-03', '2026-01-17',
      '2026-01-24', '2026-02-07', '2026-02-12', '2026-02-14', '2026-02-21', '2026-02-25',
    ];

    for (const date of sessions) {
      await prisma.SrlSession.upsert({
        where: { session_date: new Date(date) },
        update: {},
        create: { session_date: new Date(date) },
      });
    }
    console.log(`✅ Seeded ${sessions.length} sessions\n`);

    // ==================== SEED LEADERBOARD_STATS ====================
    console.log('📊 Seeding 190 leaderboard records...');
    // Using Prisma createMany for speed
    const leaderboardData = [
      { id: 1, serial_no: 1, student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', period: 'Dec 2025', attendance: 16, hours: 41.0000, debate_score: 87, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 2, serial_no: 1, student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', period: 'Jan 2026', attendance: 11, hours: 25.5000, debate_score: 25, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 3, serial_no: 1, student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', period: 'Feb 2026', attendance: 15, hours: 39.0000, debate_score: 59, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 4, serial_no: 1, student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', period: 'Mar 2026', attendance: 9, hours: 19.5000, debate_score: -1, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 5, serial_no: 1, student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', period: 'All Time', attendance: 51, hours: 125.0000, debate_score: 170, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 6, serial_no: 2, student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', period: 'Dec 2025', attendance: 0, hours: 0.0000, debate_score: 0, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 7, serial_no: 2, student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', period: 'Jan 2026', attendance: 0, hours: 0.0000, debate_score: 0, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 8, serial_no: 2, student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', period: 'Feb 2026', attendance: 0, hours: 0.0000, debate_score: 0, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 9, serial_no: 2, student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', period: 'Mar 2026', attendance: 4, hours: 2.0000, debate_score: 0, created_at: new Date('2026-04-07T20:38:13.328Z') },
      { id: 10, serial_no: 2, student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', period: 'All Time', attendance: 4, hours: 2.0000, debate_score: 0, created_at: new Date('2026-04-07T20:38:13.328Z') }
    ];
    await prisma.leaderboardStat.createMany({
      data: leaderboardData,
      skipDuplicates: true,
    });
    console.log(`✅ Seeded 10 leaderboard records (sample - add remaining 180 via direct SQL if needed)\n`);

    // ==================== SEED JOIN_US ====================
    console.log('👥 Seeding join_us...');
    await prisma.JoinUs.upsert({
      where: { enrollment: '24BECE30094' },
      update: {},
      create: {
        enrollment: '24BECE30094',
        name: 'Rudr Halvadiya',
        created_at: new Date('2026-02-22T19:03:28.076Z'),
      },
    });
    console.log('✅ Seeded 1 join_us record\n');

    console.log('═══════════════════════════════════════════════');
    console.log('✅ CORE SEED COMPLETED!\n');
    console.log('📊 Summary:');
    console.log('   ✓ 37 students_details');
    console.log('   ✓ 11 srl_sessions');
    console.log('   ✓ 10 leaderboard_stats (sample)');
    console.log('   ✓ 1 join_us');
    console.log('\n💡 TODO: Add remaining research papers, projects, activities, achievements');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
