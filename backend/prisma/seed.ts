import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed students_details
    console.log('📚 Seeding students_details...');
    await prisma.studentDetail.upsert({
      where: { id: 100 },
      update: {},
      create: {
        id: 100,
        student_name: 'admin',
        enrollment_no: 'Admin@SRL',
        institute_name: 'admin',
        department: 'null',
        semester: 0,
        division: null,
        batch: '2022',
        email: 'adminsrl@gmail.com',
        contact_no: null,
        gender: null,
        member_type: null,
        cv_url: null,
        profile_image: null,
        login_password: null,
      },
    });

    // Seed leaderboard_stats with real data
    console.log('📊 Seeding leaderboard_stats...');
    const leaderboardData = [
      {
        id: 1,
        serial_no: 1,
        student_name: 'Aayush Viral Pandya',
        enrollment_no: '24BECE30541',
        period: 'Dec 2025',
        attendance: 16,
        hours: '41.0000',
        debate_score: 87,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 2,
        serial_no: 1,
        student_name: 'Aayush Viral Pandya',
        enrollment_no: '24BECE30541',
        period: 'Jan 2026',
        attendance: 11,
        hours: '25.5000',
        debate_score: 25,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 3,
        serial_no: 1,
        student_name: 'Aayush Viral Pandya',
        enrollment_no: '24BECE30541',
        period: 'Feb 2026',
        attendance: 15,
        hours: '39.0000',
        debate_score: 59,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 4,
        serial_no: 1,
        student_name: 'Aayush Viral Pandya',
        enrollment_no: '24BECE30541',
        period: 'Mar 2026',
        attendance: 9,
        hours: '19.5000',
        debate_score: -1,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 5,
        serial_no: 1,
        student_name: 'Aayush Viral Pandya',
        enrollment_no: '24BECE30541',
        period: 'All Time',
        attendance: 51,
        hours: '125.0000',
        debate_score: 170,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 6,
        serial_no: 2,
        student_name: 'Arnab Ghosh',
        enrollment_no: '23BECE54003',
        period: 'Dec 2025',
        attendance: 0,
        hours: '0.0000',
        debate_score: 0,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 7,
        serial_no: 2,
        student_name: 'Arnab Ghosh',
        enrollment_no: '23BECE54003',
        period: 'Jan 2026',
        attendance: 0,
        hours: '0.0000',
        debate_score: 0,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 8,
        serial_no: 2,
        student_name: 'Arnab Ghosh',
        enrollment_no: '23BECE54003',
        period: 'Feb 2026',
        attendance: 0,
        hours: '0.0000',
        debate_score: 0,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 9,
        serial_no: 2,
        student_name: 'Arnab Ghosh',
        enrollment_no: '23BECE54003',
        period: 'Mar 2026',
        attendance: 4,
        hours: '2.0000',
        debate_score: 0,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
      {
        id: 10,
        serial_no: 2,
        student_name: 'Arnab Ghosh',
        enrollment_no: '23BECE54003',
        period: 'All Time',
        attendance: 4,
        hours: '2.0000',
        debate_score: 0,
        created_at: new Date('2026-04-07T20:38:13.328Z'),
      },
    ];

    for (const data of leaderboardData) {
      await prisma.leaderboardStat.upsert({
        where: { id: data.id },
        update: {},
        create: data,
      });
    }

    // Seed authorization table
    console.log('🔐 Seeding authorization...');
    const authData = [
      { user_ID: 'adminsrl@gmail.com', password: 'Admin@SRL' },
      { user_ID: '24BECE30114@ksvuniversity.edu', password: 'Dev@123' },
      { user_ID: '24BECE30081@ksvuniversity.edu', password: 'Antra@123' },
      { user_ID: '24BECE30122@ksvuniversity.edu', password: 'Yash@123' },
    ];

    for (const auth of authData) {
      await prisma.authorization.upsert({
        where: { user_ID: auth.user_ID },
        update: {},
        create: auth,
      });
    }

    // Seed research_papers
    console.log('📜 Seeding research_papers...');
    const researchPapers = [
      {
        id: 1,
        sr_no: 1,
        department: 'CE, LDRP-ITR',
        title: 'Misinformation Detection using Large Language Models with Explainability',
        type_of_event: 'Conference Proceedings',
        publishing_year: 2026,
        link_to_paper: 'IEEE Xplore: Misinformation Detection Using Large Language Models with Explainability',
        link_to_pdf: 'Published Paper: Misinformation Detection Using Large Language Models with Explainability',
        created_at: new Date('2026-03-19T08:25:35.175Z'),
      },
      {
        id: 2,
        sr_no: 2,
        department: 'CE, LDRP-ITR',
        title: 'Exploring AI\'s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI',
        type_of_event: 'Conference Proceedings',
        publishing_year: 2025,
        link_to_paper: 'IEEE Xplore: Exploring AI\'s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI',
        link_to_pdf: 'Published Paper: Exploring AI\'s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI',
        created_at: new Date('2026-03-19T08:25:35.175Z'),
      },
      {
        id: 3,
        sr_no: 3,
        department: 'CE, LDRP-ITR',
        title: 'TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach',
        type_of_event: 'Conference Proceedings',
        publishing_year: 2025,
        link_to_paper: 'IEEE Xplore: TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach',
        link_to_pdf: 'Published Paper: Exploring AI\'s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI',
        created_at: new Date('2026-03-19T08:25:35.175Z'),
      },
    ];

    for (const paper of researchPapers) {
      await prisma.researchPaper.upsert({
        where: { id: paper.id },
        update: {},
        create: paper,
      });
    }

    // Seed research_projects
    console.log('🔬 Seeding research_projects...');
    const researchProjects = [
      {
        id: 1,
        title: 'AI for Gender Empowerment: Designing Inclusive and Bias-Aware Intelligent Systems',
        description:
          'This research explores how Artificial Intelligence can serve as a catalyst for gender empowerment by identifying, analyzing, and addressing structural inequalities that persist within digital ecosystems.',
        team_image_url: 'https://student-research-lab.vercel.app/assets/research1-De7lOjCv.png',
        social_link: 'https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429466085311098880-XDnV/',
        guide_name: 'Dr. Himani Trivedi',
        created_at: new Date('2026-02-23T02:18:53.197Z'),
      },
      {
        id: 2,
        title: 'AI and Data-Driven Approaches for Predictive Healthcare and Risk Pattern Analysis',
        description:
          'Paper 1: SHAP-Enhanced Outbreak Forecasting: Interpretable Multi-Modal Learning for Waterborne Disease Prediction',
        team_image_url: 'https://student-research-lab.vercel.app/assets/research2-zu_DkMrD.png',
        social_link: 'https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7407377566589759488-qigD/',
        guide_name: 'Dr. Himani Trivedi',
        created_at: new Date('2026-02-23T02:25:37.932Z'),
      },
    ];

    for (const project of researchProjects) {
      await prisma.researchProject.upsert({
        where: { id: project.id },
        update: {},
        create: project,
      });
    }

    // Seed srl_sessions
    console.log('📅 Seeding srl_sessions...');
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
      await prisma.sRLSession.upsert({
        where: { id: i + 1 },
        update: {},
        create: {
          session_date: new Date(sessionDates[i]),
        },
      });
    }

    // Seed join_us
    console.log('👥 Seeding join_us...');
    await prisma.joinUs.upsert({
      where: { id: 13 },
      update: {},
      create: {
        id: 13,
        name: 'Rudr Halvadiya',
        enrollment: '24bece30094',
        semester: '4',
        division: 'B',
        branch: 'CE',
        college: 'L.D.R.P - I.T.R',
        contact: '9427375784',
        email: 'rudrhalvadiya2000@gmail.com',
        batch: '2024-2028',
        source: 'Faculty',
        created_at: new Date('2026-03-19T06:35:38.756Z'),
        cpi: null,
        ieee_member_2026: null,
        ieee_membership: null,
        resume_link: null,
        research_expertise: null,
        research_publication: null,
        research_ongoing: null,
      },
    });

    // Seed activities (minimal sample)
    console.log('🎯 Seeding activities...');
    await prisma.activity.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: 'MMPSRPC Students Research Lab',
        description: 'A Space for Meaningful Work - The M. M. Patel Students Research Project Cell, KSV (MMPSRPC) Students Research Lab...',
        link: 'https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7403658696884412416-BWwn',
        brief: 'MMPSRPC Students Research Lab: A Space for Meaningful Work',
        date: '7-December-2025',
        Photo: 'https://npdtneznlzganiolvhmw.supabase.co/storage/v1/object/public/Activity_images/MMPSRPC%20Students%20Research%20Lab%20Where%20Ideas%20Turn%20into%20Meaningful%20Research.png',
        sequence: 4,
      },
    });

    // Seed achievement_content (minimal sample)
    console.log('🏆 Seeding achievement_content...');
    await prisma.achievementContent.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        serial_no: 16,
        date_raw: '22nd March 2026',
        achievement_date: new Date('2026-03-22'),
        title: 'Team Qubits – Runner-Up at Odoo × Gujarat Vidyapith Hackathon 2026',
        description:
          'Proud to share that Team Qubits, a team from Students Research Lab (SRL), M. M. Patel Students Research Project Cell, KSV secured the Runner-Up position at the national-level Odoo × Gujarat Vidyapith Hackathon 2026...',
        category: 'Competition',
        type: 'image',
        linkedin_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7443333145090854912',
        image_url: null,
        media_urls: ['/Achievements/Achievement-Odoo-Vidyapith-2026/img-1.png'],
        created_at: new Date('2026-04-07T20:21:39.148Z'),
      },
    });

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
