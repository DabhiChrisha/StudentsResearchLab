const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Delete any existing admin record
    await prisma.$executeRaw`
      DELETE FROM "students_details"
      WHERE email = 'adminsrl@gmail.com'
         OR enrollment_no = 'Adminsrl';
    `;
    console.log("✓ Deleted any existing admin records");

    // Insert admin user with raw SQL
    await prisma.$executeRaw`
      INSERT INTO "students_details" (
        student_name, enrollment_no, email, member_type, login_password,
        institute_name, department, semester, division, batch, gender, contact_no, is_admin
      )
      VALUES (
        'SRL Admin', 'Adminsrl', 'adminsrl@gmail.com', 'admin', 'Admin@SRL',
        'N/A', 'N/A', 0, 'N/A', 'N/A', 'other', 'N/A', true
      );
    `;

    console.log("✓ Admin user created successfully");
    console.log("  Email: adminsrl@gmail.com");
    console.log("  Password: Admin@SRL");
    console.log("  Enrollment: Adminsrl");
  } catch (error) {
    console.error("✗ Error setting up admin:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
