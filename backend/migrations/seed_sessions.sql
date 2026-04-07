-- Create session_content table (separate from srl_sessions attendance table)
CREATE TABLE IF NOT EXISTS session_content (
  id           SERIAL PRIMARY KEY,
  serial_no    INTEGER UNIQUE NOT NULL,
  date_raw     TEXT,
  session_date DATE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT CHECK (category IN ('success', 'learning')),
  type         TEXT DEFAULT 'video' CHECK (type IN ('video', 'photo')),
  linkedin_url TEXT,
  image_url    TEXT,
  media_urls   TEXT[],
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 6 sessions from CSV (ordered by serial_no = chronological order)
INSERT INTO session_content (serial_no, date_raw, session_date, title, description, category, type, linkedin_url, media_urls)
VALUES
(
  1,
  '8th Nov 2025',
  '2025-11-08',
  'Alumni Success Story - Dhruvkumar Patel',
  '🎓 Alumni Connect Session at LDRP-ITR, KSV! Mr. Dhruvkumar Patel shared valuable insights on research-driven career growth and technical excellence.',
  'success',
  'photo',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7393559476517273600-F8s-',
  ARRAY[
    '/Sessions/Alumni-Success-Dhruvkumar/img-1.jpg',
    '/Sessions/Alumni-Success-Dhruvkumar/img-2.jpg',
    '/Sessions/Alumni-Success-Dhruvkumar/img-3.jpg',
    '/Sessions/Alumni-Success-Dhruvkumar/img-4.jpg',
    '/Sessions/Alumni-Success-Dhruvkumar/img-5.jpg'
  ]
),
(
  2,
  '12th Dec 2025',
  '2025-12-12',
  'Students Research Lab Presents: Debate on Plots and Maps',
  'The MMPSRPC Students Research Lab at KSV nurtures a progressive learning culture where students go beyond routine academics through weekly discussions and spontaneous exercises. This environment enhances analytical thinking, communication, and collaboration, helping students develop a strong research mindset and a more structured academic approach.',
  'learning',
  'video',
  'https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-studentsresearchlab-activity-7405172370459668481-6zQI',
  ARRAY['/Sessions/Learning-Cullture-of-MMPSRPC-SRL/video-6.mp4']
),
(
  3,
  '27th Dec 2025',
  '2025-12-27',
  'Alumni Success Story - Manan Darji (Google), Dhwani Jakhaniya (AMD)',
  'Alumni of the CE Department, LDRP ITR, KSV conducted an insightful interaction session highlighting focused effort, mentorship, and adaptability for professional growth.',
  'success',
  'video',
  'https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-mmpsrc-activity-7413813644284682240-u9XF',
  ARRAY['/Sessions/Alumni-Success-Manan-Dhwani/video-1.mp4']
),
(
  4,
  '3rd Jan 2026',
  '2026-01-03',
  'Alumni Success Story - Shubham Kumar Chandravanshi (Deloitte), Dhruvkumar Patel (Myntra), Jay Patel (QloudX)',
  'The Alumni Connect Session at the Student Research Lab, M. M. Patel Students Research Project Cell, KSV, brought together students and alumni for an insightful interaction focused on industry exposure, career journeys, and key professional learnings.',
  'success',
  'video',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7417800043421843456-rV2a',
  ARRAY['/Sessions/Alumni-Success-Shubham-Dhruvkumar-Jay/video-2.mp4']
),
(
  5,
  '12th Feb 2026',
  '2026-02-12',
  'Written and Verbal Articulation of Algorithmic Concepts',
  'At the Students Research Lab under the M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya, Gandhinagar, an academic session focused on efficient analysis of recursive problems using structured and optimized approaches.',
  'learning',
  'video',
  'https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7412364021376413696-DFUn',
  ARRAY['/Sessions/Articulation-of-Algorithmic-Concepts/video-3.mp4']
),
(
  6,
  '25th Feb 2026',
  '2026-02-25',
  'Algorithm Optimization Through Recurrence Analysis',
  'At the Students Research Lab under the M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya, Gandhinagar, students participated in an interactive session focused on algorithm optimization.',
  'learning',
  'video',
  'https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-ksv-svkm-activity-7411274469664759809-rDsK',
  ARRAY['/Sessions/Algorithm-Optimization/video-1.mp4']
)
ON CONFLICT (serial_no) DO NOTHING;

-- Also seed session dates into srl_sessions attendance table
INSERT INTO srl_sessions (session_date)
VALUES
  ('2025-11-08'),
  ('2025-12-12'),
  ('2025-12-27'),
  ('2026-01-03'),
  ('2026-02-12'),
  ('2026-02-25')
ON CONFLICT (session_date) DO NOTHING;
