const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function resetSequences() {
  try {
    console.log("Getting current max IDs from all tables...\n");

    const tables = [
      { name: "activities", sequence: "activities_id_seq" },
      { name: "students_details", sequence: "students_details_id_seq" },
      { name: "debate_scores", sequence: "debate_scores_id_seq" },
      { name: "session_content", sequence: "session_content_id_seq" },
      { name: "leaderboard_stats", sequence: "leaderboard_stats_id_seq" },
      { name: "achievement_content", sequence: "achievement_content_id_seq" },
      { name: "research_projects", sequence: "research_projects_id_seq" },
      { name: "research_papers", sequence: "research_papers_id_seq" },
      { name: "paper_authors", sequence: "paper_authors_id_seq" },
    ];

    for (const table of tables) {
      try {
        const maxIdResult = await prisma.$queryRawUnsafe(
          `SELECT COALESCE(MAX(id), 0) as max_id FROM "${table.name}"`
        );
        const maxId = maxIdResult[0]?.max_id || 0;
        const nextId = maxId + 1;

        // Reset sequence
        await prisma.$queryRawUnsafe(
          `ALTER SEQUENCE ${table.sequence} RESTART WITH ${nextId};`
        );

        console.log(
          `✓ ${table.name}: max_id=${maxId}, sequence set to ${nextId}`
        );
      } catch (error) {
        console.log(`✗ ${table.name}: ${error.message}`);
      }
    }

    console.log("\n✓ All sequences reset successfully!");
    console.log("\nTrying to create an activity now...");

    const activity = await prisma.activity.create({
      data: {
        title: "Test Activity After Sequence Reset",
        description: "Test description",
        date: new Date().toISOString(),
        link: "https://example.com",
        brief: "Brief",
        Photo: "https://example.com/photo.jpg",
      },
    });

    console.log("✓ Activity created successfully:");
    console.log(JSON.stringify(activity, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences();
