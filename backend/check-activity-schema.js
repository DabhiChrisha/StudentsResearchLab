const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkActivityTable() {
  try {
    console.log("Checking Activity table...\n");
    
    // Get table info from database
    const tableInfo = await prisma.$queryRaw`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM 
        information_schema.columns
      WHERE 
        table_name = 'activities'
      ORDER BY 
        ordinal_position;
    `;
    
    console.log("Activity Table Structure:");
    console.log(JSON.stringify(tableInfo, null, 2));
    
    // Try to create an activity
    console.log("\n\nAttempting to create an activity...");
    const activity = await prisma.activity.create({
      data: {
        title: "Test Activity",
        description: "Test description",
        date: new Date().toISOString(),
        link: "https://example.com",
        brief: "Brief",
        Photo: "https://example.com/photo.jpg"
      }
    });
    
    console.log("Success! Activity created:");
    console.log(JSON.stringify(activity, null, 2));
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.code) console.error("Error Code:", error.code);
    if (error.meta) console.error("Error Meta:", error.meta);
  } finally {
    await prisma.$disconnect();
  }
}

checkActivityTable();
