const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...\n');

    // Read exported data
    const dataPath = path.join(__dirname, 'exported_data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await prisma.research_project_members.deleteMany({});
    await prisma.researchProjects.deleteMany({});
    await prisma.paperAuthor.deleteMany({});
    await prisma.publication.deleteMany({});
    await prisma.researchPaper.deleteMany({});
    await prisma.activity.deleteMany({});
    await prisma.debateScore.deleteMany({});
    await prisma.leaderboardStat.deleteMany({});
    await prisma.achievementContent.deleteMany({});
    await prisma.sessionContent.deleteMany({});
    await prisma.srlSession.deleteMany({});
    await prisma.memberCvProfile.deleteMany({});
    await prisma.joinUs.deleteMany({});
    await prisma.studentsDetail.deleteMany({});
    await prisma.timeline_entries.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Seed StudentsDetail with admin flag
    console.log('Seeding StudentsDetail...');
    for (const student of data.studentsDetails) {
      await prisma.studentsDetail.create({
        data: {
          id: student.id,
          student_name: student.student_name,
          enrollment_no: student.enrollment_no,
          institute_name: student.institute_name,
          department: student.department === 'null' ? null : student.department,
          semester: student.semester,
          division: student.division,
          batch: student.batch,
          email: student.email,
          contact_no: student.contact_no,
          gender: student.gender,
          member_type: student.member_type,
          cv_url: student.cv_url,
          created_at: student.created_at ? new Date(student.created_at) : new Date(),
          login_password: student.login_password,
          profile_image: student.profile_image,
          is_admin: student.email === 'adminsrl@gmail.com', // Set admin flag for admin user
        },
      });
    }
    console.log(`✓ Seeded ${data.studentsDetails.length} students\n`);

    // Seed timeline_entries
    console.log('Seeding timeline_entries...');
    for (const entry of data.timelineEntries) {
      await prisma.timeline_entries.create({
        data: {
          id: BigInt(entry.id),
          step: entry.step,
          title: entry.title,
          description: entry.description,
          icon_svg: entry.icon_svg,
          display_order: entry.display_order,
          is_active: entry.is_active,
          created_at: new Date(entry.created_at),
          updated_at: new Date(entry.updated_at),
        },
      });
    }
    console.log(`✓ Seeded ${data.timelineEntries.length} timeline entries\n`);

    // Seed SrlSession
    console.log('Seeding SrlSession...');
    for (const session of data.srlSessions) {
      try {
        await prisma.srlSession.create({
          data: {
            session_date: new Date(session.session_date),
          },
        });
      } catch (e) {
        // Skip duplicates
      }
    }
    console.log(`✓ Seeded SRL sessions\n`);

    // Seed SessionContent
    console.log('Seeding SessionContent...');
    for (const content of data.sessionContents) {
      await prisma.sessionContent.create({
        data: {
          id: content.id,
          serial_no: content.serial_no,
          date_raw: content.date_raw,
          session_date: content.session_date ? new Date(content.session_date) : null,
          title: content.title,
          description: content.description,
          category: content.category,
          type: content.type,
          linkedin_url: content.linkedin_url,
          image_url: content.image_url,
          media_urls: content.media_urls || [],
          created_at: content.created_at ? new Date(content.created_at) : new Date(),
        },
      });
    }
    console.log(`✓ Seeded ${data.sessionContents.length} session contents\n`);

    // Seed AchievementContent
    console.log('Seeding AchievementContent...');
    for (const achievement of data.achievementContents) {
      await prisma.achievementContent.create({
        data: {
          id: achievement.id,
          serial_no: achievement.serial_no,
          date_raw: achievement.date_raw,
          achievement_date: achievement.achievement_date ? new Date(achievement.achievement_date) : null,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          type: achievement.type,
          linkedin_url: achievement.linkedin_url,
          image_url: achievement.image_url,
          media_urls: achievement.media_urls || [],
          created_at: achievement.created_at ? new Date(achievement.created_at) : new Date(),
        },
      });
    }
    console.log(`✓ Seeded ${data.achievementContents.length} achievement contents\n`);

    // Seed LeaderboardStat
    console.log('Seeding LeaderboardStat...');
    for (const stat of data.leaderboardStats) {
      await prisma.leaderboardStat.create({
        data: {
          id: stat.id,
          serial_no: stat.serial_no,
          student_name: stat.student_name,
          enrollment_no: stat.enrollment_no,
          period: stat.period,
          attendance: stat.attendance,
          hours: stat.hours ? parseFloat(stat.hours) : 0,
          debate_score: stat.debate_score,
          created_at: stat.created_at ? new Date(stat.created_at) : new Date(),
        },
      });
    }
    console.log(`✓ Seeded ${data.leaderboardStats.length} leaderboard stats\n`);

    // Seed DebateScore
    console.log('Seeding DebateScore...');
    for (const score of data.debateScores) {
      await prisma.debateScore.create({
        data: {
          id: score.id,
          enrollment_no: score.enrollment_no,
          month: score.month,
          year: score.year,
          points: score.points,
        },
      });
    }
    console.log(`✓ Seeded ${data.debateScores.length} debate scores\n`);

    // Seed Activity
    console.log('Seeding Activity...');
    for (const activity of data.activities) {
      await prisma.activity.create({
        data: {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          link: activity.link,
          brief: activity.brief,
          date: activity.date,
          Photo: activity.Photo,
          sequence: activity.sequence,
        },
      });
    }
    console.log(`✓ Seeded ${data.activities.length} activities\n`);

    // Seed MemberCvProfile
    console.log('Seeding MemberCvProfile...');
    for (const profile of data.memberCvProfiles) {
      await prisma.memberCvProfile.create({
        data: {
          id: BigInt(profile.id),
          enrollment_no: profile.enrollment_no,
          student_name: profile.student_name,
          research_work_summary: profile.research_work_summary,
          research_area: profile.research_area,
          hackathons: profile.hackathons,
          research_papers: profile.research_papers,
          patents: profile.patents,
          projects: profile.projects,
          updated_by: profile.updated_by,
          created_at: new Date(profile.created_at),
          updated_at: new Date(profile.updated_at),
        },
      });
    }
    console.log(`✓ Seeded ${data.memberCvProfiles.length} member CV profiles\n`);

    // Seed JoinUs
    console.log('Seeding JoinUs...');
    for (const join of data.joinUses) {
      await prisma.joinUs.create({
        data: {
          id: BigInt(join.id),
          name: join.name,
          enrollment: join.enrollment,
          semester: join.semester,
          division: join.division,
          branch: join.branch,
          college: join.college,
          contact: join.contact,
          email: join.email,
          batch: join.batch,
          source: join.source,
          created_at: join.created_at ? new Date(join.created_at) : new Date(),
          cpi: join.cpi,
          ieee_member_2026: join.ieee_member_2026,
          ieee_membership: join.ieee_membership,
          resume_link: join.resume_link,
          research_expertise: join.research_expertise || [],
          research_publication: join.research_publication,
          research_ongoing: join.research_ongoing,
        },
      });
    }
    console.log(`✓ Seeded ${data.joinUses.length} join requests\n`);

    // Seed ResearchProject
    console.log('Seeding ResearchProject...');
    for (const project of data.researchProjects) {
      await prisma.researchProjects.create({
        data: {
          id: project.id,
          title: project.title,
          description: project.description,
          team_image_url: project.team_image_url,
          social_link: project.social_link,
          guide_name: project.guide_name,
          created_at: project.created_at ? new Date(project.created_at) : new Date(),
        },
      });
    }
    console.log(`✓ Seeded ${data.researchProjects.length} research projects\n`);

    // Seed ResearchProjectMembers
    console.log('Seeding ResearchProjectMembers...');
    for (const member of data.researchProjectMembers) {
      await prisma.research_project_members.create({
        data: {
          project_id: member.project_id,
          enrollment_no: member.enrollment_no,
          student_image_url: member.student_image_url,
        },
      });
    }
    console.log(`✓ Seeded ${data.researchProjectMembers.length} research project members\n`);

    // Seed ResearchPaper
    console.log('Seeding ResearchPaper...');
    for (const paper of data.researchPapers) {
      await prisma.researchPaper.create({
        data: {
          id: paper.id,
          sr_no: paper.sr_no,
          department: paper.department,
          title: paper.title,
          type_of_event: paper.type_of_event,
          publishing_year: paper.publishing_year,
          link_to_paper: paper.link_to_paper,
          link_to_pdf: paper.link_to_pdf,
          created_at: paper.created_at ? new Date(paper.created_at) : new Date(),
        },
      });
    }
    console.log(`✓ Seeded ${data.researchPapers.length} research papers\n`);

    // Seed PaperAuthor
    console.log('Seeding PaperAuthor...');
    for (const author of data.paperAuthors) {
      await prisma.paperAuthor.create({
        data: {
          id: author.id,
          paper_id: author.paper_id,
          author_name: author.author_name,
          is_srl_member: author.is_srl_member,
          created_at: author.created_at ? new Date(author.created_at) : new Date(),
        },
      });
    }
    console.log(`✓ Seeded ${data.paperAuthors.length} paper authors\n`);

    // Seed Publication
    console.log('Seeding Publication...');
    for (const pub of data.publications) {
      await prisma.publication.create({
        data: {
          id: pub.id,
          serial_no: pub.serial_no,
          student_authors: pub.student_authors,
          department: pub.department,
          institute: pub.institute,
          title: pub.title,
          event_type: pub.event_type,
          is_srl_member: pub.is_srl_member,
          paper_url: pub.paper_url,
          pdf_url: pub.pdf_url,
          created_at: pub.created_at ? new Date(pub.created_at) : new Date(),
          updated_at: pub.updated_at ? new Date(pub.updated_at) : new Date(),
          venue: pub.venue,
          date: pub.date,
          description: pub.description,
          tags: pub.tags || [],
          category: pub.category,
          enrollment_nos: pub.enrollment_nos,
          year: pub.year,
        },
      });
    }
    console.log(`✓ Seeded ${data.publications.length} publications\n`);

    console.log('✓ Database seed completed successfully!\n');
    console.log('Summary:');
    console.log(`- Students: ${data.studentsDetails.length}`);
    console.log(`- Timeline Entries: ${data.timelineEntries.length}`);
    console.log(`- Session Contents: ${data.sessionContents.length}`);
    console.log(`- Achievement Contents: ${data.achievementContents.length}`);
    console.log(`- Leaderboard Stats: ${data.leaderboardStats.length}`);
    console.log(`- Activities: ${data.activities.length}`);
    console.log(`- Member CV Profiles: ${data.memberCvProfiles.length}`);
    console.log(`- Join Requests: ${data.joinUses.length}`);
    console.log(`- Research Projects: ${data.researchProjects.length}`);
    console.log(`- Research Papers: ${data.researchPapers.length}`);
    console.log(`- Publications: ${data.publications.length}`);

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
