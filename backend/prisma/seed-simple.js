const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Use direct connection URL instead of pooler to avoid prepared statement issues
const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  try {
    console.log('Starting database seed...\n');

    // Read exported data
    const dataPath = path.join(__dirname, 'exported_data.json');
    console.log('Reading data from:', dataPath);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);
    console.log('Data loaded successfully\n');

    // Seed StudentsDetail with admin flag
    console.log('Seeding StudentsDetail...');
    let adminSeeded = false;
    for (const student of data.studentsDetails) {
      // Use first non-admin student as template for admin
      if (!adminSeeded && student.email === 'adminsrl@gmail.com') {
        const templateStudent = data.studentsDetails.find(s => s.email !== 'adminsrl@gmail.com');
        
        // Only create admin if not already seeded
        const existingAdmin = await prisma.studentsDetail.findUnique({
          where: { email: student.email }
        }).catch(() => null);
        
        if (!existingAdmin) {
          await prisma.studentsDetail.create({
            data: {
              student_name: "Admin",
              enrollment_no: "Admin@SRL",
              institute_name: templateStudent?.institute_name || "MMPSRPC",
              department: templateStudent?.department || "CS",
              semester: templateStudent?.semester || 4,
              division: templateStudent?.division || "A",
              batch: templateStudent?.batch || "2024-2028",
              email: student.email,
              contact_no: templateStudent?.contact_no || "9999999999",
              gender: templateStudent?.gender || "other",
              member_type: "Admin",
              cv_url: null,
              created_at: student.created_at ? new Date(student.created_at) : new Date(),
              login_password: student.login_password,
              profile_image: null,
              is_admin: true,
            },
          });
        } else {
          // Update existing admin to set is_admin flag
          await prisma.studentsDetail.update({
            where: { email: student.email },
            data: { is_admin: true }
          });
        }
        adminSeeded = true;
        continue;
      }
      
      if (student.email !== 'adminsrl@gmail.com') {
        await prisma.studentsDetail.create({
          data: {
            student_name: student.student_name,
            enrollment_no: student.enrollment_no,
            institute_name: student.institute_name,
            department: student.department === 'null' ? 'CS' : student.department,
            semester: student.semester,
            division: student.division || 'A',
            batch: student.batch,
            email: student.email,
            contact_no: student.contact_no || '9999999999',
            gender: student.gender || 'other',
            member_type: student.member_type,
            cv_url: student.cv_url,
            created_at: student.created_at ? new Date(student.created_at) : new Date(),
            login_password: student.login_password,
            profile_image: student.profile_image,
            is_admin: false,
          },
        });
      }
    }
    console.log(`✓ Seeded ${data.studentsDetails.length} students\n`);

    console.log('✓ Database seed completed successfully!\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
