const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function resetSequencesAndSetupAdmin() {
  try {
    console.log("🔄 Starting sequence reset and admin setup...\n");

    // List of tables with auto-increment IDs
    const tables = [
      "students_details",
      "debate_scores",
      "session_content",
      "leaderboard_stats",
      "achievement_content",
      "research_projects",
      "research_papers",
      "activity",
      "publication",
      "paper_authors",
      "join_us",
    ];

    // Reset sequences for each table
    for (const table of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(
          `SELECT MAX(id) as max_id FROM "${table}";`
        );
        const maxId = result[0]?.max_id || 0;
        const nextId = maxId + 1;

        // Set the sequence to the next value
        await prisma.$executeRawUnsafe(
          `ALTER SEQUENCE "${table}_id_seq" RESTART WITH ${nextId};`
        );

        console.log(`✓ ${table}: max_id=${maxId}, next_id=${nextId}`);
      } catch (error) {
        // Sequence might not exist or table doesn't have id column
        console.log(`⚠ ${table}: Skipped (${error.message.split("\n")[0]})`);
      }
    }

    console.log("\n🔐 Setting up admin user...");

    // Delete any existing admin record
    await prisma.$executeRawUnsafe(`
      DELETE FROM "students_details"
      WHERE email = 'adminsrl@gmail.com'
         OR enrollment_no = 'Adminsrl';
    `);
    console.log("✓ Cleaned up existing admin records");

    // Insert admin user
    await prisma.$executeRawUnsafe(`
      INSERT INTO "students_details" (
        student_name, enrollment_no, email, member_type, login_password,
        institute_name, department, semester, division, batch, gender, contact_no, is_admin
      )
      VALUES (
        'SRL Admin', 'Adminsrl', 'adminsrl@gmail.com', 'admin', 'Admin@SRL',
        'N/A', 'N/A', 0, 'N/A', 'N/A', 'other', 'N/A', true
      );
    `);

    console.log("✓ Admin user created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("   Email   : adminsrl@gmail.com");
    console.log("   Password: Admin@SRL");

    console.log("\n✅ All setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequencesAndSetupAdmin();
