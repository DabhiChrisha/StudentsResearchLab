const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting comprehensive database seed with ALL 296 records...\n');

    // ==================== SEED students_details (37 records) ====================
    console.log('📚 Seeding students_details (37 records)...');
    const studentsDetailsData = [
      { id: 1, student_name: 'Ghetiya Poojan Rahulbhai', enrollment_no: '25MECE30003', institute_name: 'LDRP-ITR', department: 'ME', semester: 2, division: 'A', batch: '2025-2027', email: 'ghetiyapoojan@gmail.com', contact_no: '8530088085', gender: 'male', member_type: 'General Members', cv_url: null, login_password: null, profile_image: '/students/Ghetiya Poojan Rahulbhai.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 2, student_name: 'Dev Kansara', enrollment_no: '24BECE30114', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'kansaradev95@gmail.com', contact_no: '9925669832', gender: 'male', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Kansara Dev Dharmeshkumar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 3, student_name: 'Antra Gajjar', enrollment_no: '24BECE30081', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'gajjarantra03@gmail.com', contact_no: '7990912121', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Gajjar Antra Ashvinkumar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 4, student_name: 'Yash Kumavat', enrollment_no: '24BECE30122', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'yashnkumavat2005@gmail.com', contact_no: '8128575707', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Yash Kumavat.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 5, student_name: 'Chrisha Manish Dabhi', enrollment_no: '24BECE30489', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'G', batch: '2024-2028', email: 'chrishaadabhii0704@gmail.com', contact_no: '9870094446', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Dabhi Chrisha Manish.png', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 6, student_name: 'Rudr Halvadiya', enrollment_no: '24BECE30094', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'rudrhalvadiya2000@gmail.com', contact_no: '9427375784', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Halvdadiya Rudr.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 7, student_name: 'Pragati Varu', enrollment_no: '24BECE30436', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'pragativaru23@gmail.com', contact_no: '9875122785', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Pragati Varu.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 8, student_name: 'Aayush Viral Pandya', enrollment_no: '24BECE30541', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'pandyaaayush2006@gmail.com', contact_no: '9687041106', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Pandya Aayush Viral.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 9, student_name: 'Yajurshi Velani', enrollment_no: '24BECE30441', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'yajurshivelani@gmail.com', contact_no: '8799123685', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Yajurshi Velani.png', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 10, student_name: 'Mahi Parmar', enrollment_no: '24BECE30548', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'mahiparmar2708@gmail.com', contact_no: '9998801402', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Parmar Mahi Nitinchandra.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 11, student_name: 'Bhagyashree Jadeja', enrollment_no: '24BECE30099', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'A', batch: '2024-2028', email: 'bhagyashreejadeja76@gmail.com', contact_no: '6356020582', gender: 'female', member_type: 'General Members', cv_url: null, login_password: null, profile_image: '/students/Jadeja Bhagyashree.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 12, student_name: 'Honey Modha', enrollment_no: '224SBECE30016', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'honeymodha02@gmail.com', contact_no: '8141912433', gender: 'female', member_type: 'General Members', cv_url: null, login_password: null, profile_image: '/students/Honey Modha.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 13, student_name: 'Prem Raichura', enrollment_no: '224SBECE30059', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'premraichura7@gmail.com', contact_no: '9327681649', gender: 'male', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Prem Raichura.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 14, student_name: 'Hetvi Hinsu', enrollment_no: '23BECE30449', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'hetvi0925@gmail.com', contact_no: '9428086585', gender: 'female', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Hetvi Hinsu.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 15, student_name: 'Banshari Patel', enrollment_no: '23BECE30168', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'bansharipatel6595@gmail.com', contact_no: '9724334964', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Patel Banshari Rahulkumar.jpg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 16, student_name: 'Mihir Patel', enrollment_no: '23BECE30542', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'mihir.rockshi@gmail.com', contact_no: '9428038999', gender: 'male', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Mihir Patel.png', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 17, student_name: 'Heny Patel', enrollment_no: '23BECE30521', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'henypatel26012005@gmail.com', contact_no: '9328211453', gender: 'male', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Heny Patel.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 18, student_name: 'Krish Patel', enrollment_no: '23BECE30532', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'krishp728@gmail.com', contact_no: '8780064214', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Patel Krish Himanshu.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 19, student_name: 'Hemant Pande', enrollment_no: '23BECE30493', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'hp926591@gmail.com', contact_no: '8780508139', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Pande Hemant Rameshwarkumar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 20, student_name: 'Rachita Devda', enrollment_no: '23BECE30059', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'rachitadevda0410@gmail.com', contact_no: '9313258627', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Devda Rachita Bharatsinh.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 21, student_name: 'Jainee Patel', enrollment_no: '23BECE30203', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'jainu2426@gmail.com', contact_no: '7984123552', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Patel Jainee Hasmukhbhai.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 22, student_name: 'Krishna Bhatt', enrollment_no: '23BECE30023', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'bhattkrishna0908@gmail.com', contact_no: '6354262335', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Krishna Bhatt.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 23, student_name: 'Yashvi Chavda', enrollment_no: '23BECE30036', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'yashvichavda6@gmail.com', contact_no: '6356519390', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Chavda Yashvi Surendrasinh.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 24, student_name: 'Charmi Padh', enrollment_no: '23BECE30144', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'charmi.padh030206@gmail.com', contact_no: '7016405750', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Padh Charmi Ketankumar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 25, student_name: 'Henit Panchal', enrollment_no: '23BECE30490', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'henitpanchal007@gmail.com', contact_no: '9016809674', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Panchal Henit Shaileshbhai.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 26, student_name: 'Jenish Sorathiya', enrollment_no: '23BEIT54020', institute_name: 'VS-ITR', department: 'IT', semester: 6, division: 'A', batch: '2023-2027', email: '23beit54020@vsitr.ac.in', contact_no: '9099158812', gender: 'male', member_type: 'General Members', cv_url: null, login_password: null, profile_image: '/students/Jenish Sorathiya.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 27, student_name: 'Kanksha Buch', enrollment_no: '23BECE30029', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'kanksha.buch@gmail.com', contact_no: '7203073100', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Kanksha Keyur Buch.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 28, student_name: 'Janki Chitroda', enrollment_no: '23BECE30040', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'jankichitroda8@gmail.com', contact_no: '9499676967', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Janki Chitroda.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 29, student_name: 'Rohan Thakar', enrollment_no: '23BECE30364', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'rpthakar35@gmail.com', contact_no: '8320846359', gender: 'male', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Rohan Thakar.png', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 30, student_name: 'Zeel Kanudawala', enrollment_no: '23BECE30101', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'B', batch: '2023-2027', email: 'zeelkanudawala@gmail.com', contact_no: '6355424403', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Kanudawala Zeel PareshKumar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 31, student_name: 'Zenisha Devani', enrollment_no: '23BECE30058', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'zenishadevani@gmail.com', contact_no: '6359222727', gender: 'female', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Zenisha Devani.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 32, student_name: 'Parva Kumar', enrollment_no: '22BECE30153', institute_name: 'LDRP-ITR', department: 'CE', semester: 8, division: 'A', batch: '2022-2026', email: 'parva300504@gmail.com', contact_no: '9510493577', gender: 'male', member_type: 'Peer-Nominated', cv_url: null, login_password: null, profile_image: '/students/Parva Kumar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 33, student_name: 'Kandarp Gajjar', enrollment_no: '22BECE30091', institute_name: 'LDRP-ITR', department: 'CE', semester: 8, division: 'B', batch: '2022-2026', email: 'kandarp.gajjar.460@gmail.com', contact_no: '7567600101', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Kandarp Gajjar.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 34, student_name: 'Ridham Patel', enrollment_no: '22BEIT30133', institute_name: 'LDRP-ITR', department: 'IT', semester: 8, division: 'B', batch: '2022-2026', email: 'ridhampatel2k4@gmail.com', contact_no: '8849155025', gender: 'male', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Ridham Patel.png', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 35, student_name: 'Nancy Patel', enrollment_no: '22BEIT30123', institute_name: 'LDRP-ITR', department: 'IT', semester: 8, division: 'B', batch: '2022-2026', email: 'nancyp9210@gmail.com', contact_no: '9725673402', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Nancy.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 36, student_name: 'Krutika Patel', enrollment_no: '22BEIT30118', institute_name: 'LDRP-ITR', department: 'IT', semester: 8, division: 'B', batch: '2022-2026', email: 'krutika8114@gmail.com', contact_no: '9624336970', gender: 'female', member_type: 'Head-Appointed', cv_url: null, login_password: null, profile_image: '/students/Krutika Vijaybhai Patel.jpeg', created_at: new Date('2026-02-22T19:03:28.076Z') },
      { id: 40, student_name: 'Patel Hency Mukesh', enrollment_no: '24BECE30225', institute_name: 'LDRP-ITR', department: 'CE', semester: 4, division: 'B', batch: '2024-2028', email: 'hencypatel@student.ksvuniversity.ac.in', contact_no: '7990434969', gender: 'female', member_type: 'General Members', cv_url: null, login_password: null, profile_image: '/students/Hency Patel.jpeg', created_at: new Date('2026-04-07T21:36:46.705Z') },
      { id: 77, student_name: 'Arnab Ghosh', enrollment_no: '23BECE54003', institute_name: 'LDRP-ITR', department: 'CE', semester: 6, division: 'A', batch: '2023-2027', email: 'arnab.ghosh@student.ldrp.edu.in', contact_no: '9327940710', gender: 'male', member_type: null, cv_url: null, login_password: null, profile_image: '/students/Arnab Ghosh.jpeg', created_at: new Date('2026-04-08T10:47:02.733Z') },
      { id: 100, student_name: 'admin', enrollment_no: 'Admin@SRL', institute_name: 'admin', department: 'null', semester: 0, division: null, batch: '2022', email: 'adminsrl@gmail.com', contact_no: null, gender: null, member_type: null, cv_url: null, login_password: null, profile_image: null, created_at: new Date('2026-04-09T02:02:05.040Z') },
    ];

    for (const student of studentsDetailsData) {
      try {
        await prisma.StudentsDetail.upsert({
          where: { enrollment_no: student.enrollment_no },
          update: {},
          create: student,
        });
      } catch (e) {
        console.log(`  ⚠️  Error seeding ${student.enrollment_no}: ${e.message}`);
      }
    }
    console.log(`✅ Seeded ${studentsDetailsData.length} students_details records\n`);

    // ==================== SEED srl_sessions (11 records) ====================
    console.log('📅 Seeding srl_sessions (11 records)...');
    const sessionDates = [
      '2025-11-08',
      '2025-12-12',
      '2025-12-27',
      '2026-01-03',
      '2026-01-17',
      '2026-01-24',
      '2026-02-07',
      '2026-02-12',
      '2026-02-14',
      '2026-02-21',
      '2026-02-25',
    ];

    for (let i = 0; i < sessionDates.length; i++) {
      try {
        await prisma.SrlSession.upsert({
          where: { session_date: new Date(sessionDates[i]) },
          update: {},
          create: { session_date: new Date(sessionDates[i]) },
        });
      } catch (e) {
        console.log(`  ⚠️  Error seeding session ${sessionDates[i]}: ${e.message}`);
      }
    }
    console.log(`✅ Seeded ${sessionDates.length} srl_sessions records\n`);

    // ==================== NOTES ====================
    console.log('═════════════════════════════════════════════════════');
    console.log('⚠️  NOTE: This file shows PARTIAL data structure.\n');
    console.log('To complete the seed with ALL 296 records:');
    console.log('  - Leaderboard Stats: 190 records (PENDING)');
    console.log('  - Research Papers: 29 records (PENDING)');
    console.log('  - Research Projects: 4 records (PENDING)');
    console.log('  - Activities: 8 records (PENDING)');
    console.log('  - Achievement Content: 16 records (PENDING)');
    console.log('  - Join Us: 1 record (PENDING)');
    console.log('\nReplace this file with the complete version.');
    console.log('═════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
