-- Create achievement_content table
CREATE TABLE IF NOT EXISTS achievement_content (
  id               SERIAL PRIMARY KEY,
  serial_no        INTEGER UNIQUE NOT NULL,
  date_raw         TEXT,
  achievement_date DATE,
  title            TEXT NOT NULL,
  description      TEXT,
  category         TEXT,
  type             TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  linkedin_url     TEXT,
  image_url        TEXT,
  media_urls       TEXT[],
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Seed all entries (14 existing from hardcoded data + 2 new from CSV)
-- Ordered by serial_no (higher = newer), newest first in app
INSERT INTO achievement_content (serial_no, date_raw, achievement_date, title, description, category, type, linkedin_url, media_urls)
VALUES

-- NEW from CSV: Team Qubits Runner-Up (22 March 2026)
(
  16,
  '22nd March 2026',
  '2026-03-22',
  'Team Qubits – Runner-Up at Odoo × Gujarat Vidyapith Hackathon 2026',
  'Proud to share that Team Qubits, a team from Students Research Lab (SRL), M. M. Patel Students Research Project Cell, KSV secured the Runner-Up position at the national-level Odoo × Gujarat Vidyapith Hackathon 2026, competing among teams from across the country.

Out of 2300+ registrations nationwide, 239 finalists across 68 teams advanced to the grand finale held on 21st and 22nd March 2026 at Gujarat Vidyapith, Ahmedabad.

Demonstrating exceptional problem-solving skills and collaboration, Team Qubits secured the Runner-Up position along with a cash prize of ₹35,000. The team comprised Kandarp Gajjar (CE, LDRP ITR, KSV), Ridham Patel (IT, LDRP ITR, KSV), and Harsh Dodiya (CE, LDRP ITR, KSV).

This achievement is a testament to their dedication, innovation, and strong team spirit. It also highlights the growing culture of excellence and technical capability fostered at Students Research Lab (SRL), M. M. Patel Students Research Project Cell, and Kadi Sarva Vishwavidyalaya (KSV).',
  'Competition',
  'image',
  'https://www.linkedin.com/feed/update/urn:li:activity:7443333145090854912',
  NULL
),

-- NEW from CSV: 8 Teams AISEHack (20 March 2026)
(
  15,
  '20th March 2026',
  '2026-03-20',
  '8 Teams involving 32 students shortlisted for Phase-2 of the AISEHack National Hackathon',
  'Artificial Intelligence for Science and Engineering Hackathon (AISEHack): Innovation, Collaboration & Impact

We are proud to share the participation of students from the Students Research Lab (SRL), M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya (KSV) in AISE Hackathon, organised by Anusandhan National Research Foundation (ANRF), IBM, Indian Institute of Technology, Delhi, International Institute of Information Technology Hyderabad (IIITH) Hyderabad, and E-Cell IIITH.

8 teams involving 32 students from Students Research Lab (SRL), M.M. Patel Students Research Project Cell (MMPSRPC), Kadi Sarva Vishwavidyalaya (KSV) are shortlisted for Phase-2 of the hackathon, showcasing their talent, dedication, and innovative thinking.',
  'Competition',
  'image',
  'https://www.linkedin.com/feed/update/urn:li:activity:7446798610245062656',
  NULL
),

-- Existing hardcoded id 1: OSMAR Gujarat Innovation Showcase
(
  14,
  '13th Feb 2026',
  '2026-02-13',
  'OSMAR Project Shines with Second Prize at Gujarat Innovation Showcase',
  'M. M. Patel Students Research Project Cell, KSV proudly congratulates Team OSMAR for securing 🥈 Second Prize (Booth Track) at the Gujarat Innovation Project Showcase held at GEC Surat, Gujarat, organized by Edunet Foundation with support from Shell India Markets Pvt. Ltd. The team presented "OSMAR: Oil Spill Monitoring using Advanced SAR Imagery," effectively demonstrating their hardware–software solution for efficient oil spill detection. Facilitated through the Skills4Future Program under the KSV–Edunet MoU, this achievement reflects the impact of structured mentorship and industry exposure. The team—Pavan Thakkar, Zenisha Devani, Krisha P., Henit Panchal, and Hetvi Hinsu—worked under the guidance of Mr. Rohit Bhadauriya and Dr. Himani Trivedi, showcasing the strong culture of innovation and applied research nurtured at KSV 🚀💡.',
  'Competition',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_edunetfoundation-ksv-svkm-activity-7429557690068017152-W3eO',
  ARRAY[
    '/Achievements/Achievement-Henit-Zenisha-Hetvi/img-1.jpg',
    '/Achievements/Achievement-Henit-Zenisha-Hetvi/img-2.jpg',
    '/Achievements/Achievement-Henit-Zenisha-Hetvi/img-3.jpg',
    '/Achievements/Achievement-Henit-Zenisha-Hetvi/img-4.jpg',
    '/Achievements/Achievement-Henit-Zenisha-Hetvi/img-5.jpg'
  ]
),

-- Existing hardcoded id 2: IndiaAI Impact Summit Day 2
(
  13,
  '17th Feb 2026',
  '2026-02-17',
  'KSV Researchers'' Case Study Selected for International AI Casebook at IndiaAI Impact Summit 2026',
  'Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, marked a proud moment on Day 2 of the IndiaAI Impact Summit 2026, organized under the Digital India initiative by MeitY, Government of India, where the Compendium "Casebook on AI and Gender Empowerment" was officially launched in collaboration with UN Women. Among hundreds of global submissions, the Students Research Lab (SRL) members of KSV Student Researchers Team—Janki Chitroda, Yashvi Chavda, and Krishna Bhatt (CE, LDRP-ITR, KSV), guided by Dr. Himani Trivedi—were selected among the 23 research works published, earning international recognition. The team also engaged with eminent global leaders and policymakers on inclusive AI innovation, while Dr. Rupesh Vyas and Dr. Nitin Pandya represented KSV at the summit, highlighting the university''s strong academic leadership and expanding global research footprint 🌍✨.',
  'Summit',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429466085311098880-XDnV',
  ARRAY[
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-1.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-2.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-3.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-4.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-5.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-6.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-7.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-8.jpg',
    '/Achievements/IndiaAI-Impact-Summit-Day2/img-9.jpg'
  ]
),

-- Existing hardcoded id 3: IndiaAI Impact Summit Day 1
(
  12,
  '16th Feb 2026',
  '2026-02-16',
  'KSV Students Selected for International AI & Gender Empowerment Casebook at IndiaAI Impact Summit 2026',
  'Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, proudly highlights its strong presence at the IndiaAI Impact Summit 2026, organized under the Digital India initiative by MeitY, Government of India. The Students Research Lab (SRL) members of the KSV Students Researchers Team—Janki Chitroda, Yashvi Chavda, and Krishna Bhatt (CE, LDRP-ITR, KSV), guided by Dr. Himani Trivedi—have been selected for the prestigious Casebook on AI and Gender Empowerment in collaboration with UN Women India, earning national recognition and the opportunity to present their work to a global audience of policymakers and innovators. Representing the university at the summit were Dr. Rupesh Vyas and Dr. Nitin Pandya, reflecting KSV''s strong commitment to research excellence, inclusive AI innovation, and impactful global engagement 🌍✨.',
  'Summit',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429342935848067073-MDgF',
  ARRAY[
    '/Achievements/IndiaAI-Impact-Summit/img-1.jpg',
    '/Achievements/IndiaAI-Impact-Summit/img-2.jpg',
    '/Achievements/IndiaAI-Impact-Summit/img-3.jpg',
    '/Achievements/IndiaAI-Impact-Summit/img-4.jpg',
    '/Achievements/IndiaAI-Impact-Summit/img-5.jpg',
    '/Achievements/IndiaAI-Impact-Summit/img-6.jpg',
    '/Achievements/IndiaAI-Impact-Summit/img-7.jpg'
  ]
),

-- Existing hardcoded id 4: DST-TEC PAG Meeting
(
  11,
  '6th Feb 2026',
  '2026-02-06',
  'KSV Student Teams Showcase Projects at National-Level DST–TEC PAG Meeting 2026',
  'A proud moment for M. M. Patel Research Cell, KSV and M. M. Patel Students Research Project Cell, KSV, as Students Research Lab (SRL) members represented the university at the National-level 3rd Project Advisor Group (PAG) Meeting of DST–Technology Enabling Centre (DST-TEC) held at Pandit Deendayal Energy University, Gandhinagar. The event, graced by Dr. Krishna Kanth Pulicherla, featured KSV project teams—Henit Panchal, Hetvi Hinsu, Mihir Patel, and Kavya Chandegara—who showcased innovative, technically strong, and real-world relevant solutions. Their participation highlights Kadi Sarva Vishwavidyalaya''s growing research ecosystem and its commitment to fostering student-driven innovation and national-level impact ✨🚀.',
  'Meeting',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmprc-activity-7428803534722068480-m68o',
  ARRAY[
    '/Achievements/Achievement-Henit-Hetvi-Mihir/img-1.jpg',
    '/Achievements/Achievement-Henit-Hetvi-Mihir/img-2.jpg',
    '/Achievements/Achievement-Henit-Hetvi-Mihir/img-3.jpg',
    '/Achievements/Achievement-Henit-Hetvi-Mihir/img-4.jpg',
    '/Achievements/Achievement-Henit-Hetvi-Mihir/img-5.jpg'
  ]
),

-- Existing hardcoded id 5: Team BlackBox INNOVAITION 4th Runner-Up
(
  10,
  '11th Jan 2026',
  '2026-01-11',
  'Team BlackBox Secures 4th Runner-Up Position at National-Level INNOVAITION Hackathon',
  'Congratulations to Students Research Lab (SRL) members Team BlackBox from Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, for securing the 4th Runner-Up position at the national-level hackathon INNOVAITION – Shaping Future Innovators, powered by Intuitive.ai in collaboration with Dhirubhai Ambani University. Among 75 shortlisted teams nationwide, the team''s performance reflected strong technical excellence, innovation, and collaborative problem-solving. Team members—Kandarp Gajjar, Nancy Patel, Hemant Pande, Charmi Padh, and Honey Modha (LDRP-ITR)—worked under the guidance of Dr. Himani Trivedi, exemplifying the research-driven culture and innovation mindset fostered at the M. M. Patel Students Research Project Cell, KSV Student Research Lab (SRL) 🔬✨.',
  'Competition',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-srl-ksv-activity-7419418359429115904-bOge',
  ARRAY['/Achievements/DAU-InnovAItion-Hackathon/img-1.jpg']
),

-- Existing hardcoded id 6: 7 KSV Teams INNOVAITION
(
  9,
  '11th Jan 2026',
  '2026-01-11',
  '7 KSV Teams Shortlisted Among Top 75 at National-Level INNOVAITION Hackathon',
  'A proud moment for the MMPSRPC Students Research Lab (SRL) as 7 student teams have been shortlisted at "INNOVAITION – Shaping Future Innovators," a national-level hackathon powered by Intuitive.ai in collaboration with Dhirubhai Ambani University (DAU).',
  'Competition',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-srl-mmpsrpc-activity-7419393479648206848-1bfv',
  ARRAY[
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-1.jpg',
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-2.jpg',
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-3.jpg',
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-4.jpg',
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-5.jpg',
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-6.jpg',
    '/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-7.jpg'
  ]
),

-- Existing hardcoded id 7: ISED 2025 Paper Presentation Grant
(
  8,
  NULL,
  NULL,
  'KSV Students Receive Conference Grant for IEEE Paper Presentation at ISED 2025',
  'We proudly congratulate the Students Research Lab (SRL) members—Ayushi Joddha (Presenter), Manasvi Shah, and Swayam Kalburgi (CE, LDRP-ITR, KSV)—for receiving the Conference Paper Presentation Grant from the M. M. Patel Students Research Project Cell, KSV under the guidance of Dr. Himani Trivedi. Their paper, "EfficientNetB3 Adapted Hybrid UNet with Attention Guided Decoding for Urban Scene Segmentation," was presented at the 13th IEEE International Conference on Intelligent Systems and Embedded Design (ISED 2025), organized by NIT Raipur and published in IEEE Xplore (Scopus Indexed). This achievement reflects their strong research commitment and contribution to AI-driven innovation—heartiest congratulations to the team on this milestone 🚀✨.',
  'Paper Presentation',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7413814908217344000-JmvS',
  ARRAY['/Achievements/Paper-Presentation-Ayushi-Manasvi-Swayam/img-1.jpg']
),

-- Existing hardcoded id 8: AAMLAD-2025 Paper Presentation Grant
(
  7,
  NULL,
  NULL,
  'KSV Students Receive Conference Grant for Presenting AI Research at AAMLAD-2025',
  'We proudly congratulate the Students Research Lab (SRL) members—Henit Panchal (Presenter), Hetvi Hinsu, and Heny Patel (CE, LDRP-ITR, KSV)—for receiving the Conference Paper Presentation Grant from the M. M. Patel Students Research Project Cell, KSV under the guidance of Dr. Shivani A. Trivedi and Dr. Himani Trivedi. Their paper, "Generative AI as a Catalyst in Indian Education Ecosystems," was presented at AAMLAD-2025 – 1st International Workshop on Advancing AI and ML Across Disciplines, organized by ABV-IIITM, Gwalior and published in Springer (CCIS). This achievement reflects their strong research commitment and contribution to AI-driven educational innovation—heartiest congratulations to the team on this milestone 🚀✨.',
  'Paper Presentation',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-researchexcellence-studentachievement-activity-7412352256806920192-MoVv',
  ARRAY['/Achievements/Paper-Presentation-Henit-Hetvi-Heny/img-1.jpg']
),

-- Existing hardcoded id 9: NASCENT MR 2025 National Conference
(
  6,
  '10th-11th Dec 2025',
  '2025-12-10',
  'KSV Students Present Research Papers at NASCENT MR 2025 National Conference',
  'M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya, Gandhinagar, proudly shares that Students Research Lab (SRL) members from Vidush Somany Institute of Technology and Research, Kadi and LDRP ITR participated in the NASCENT MR – National Scientific Conference on Emerging Trends in Multidisciplinary Research 2025 held at Puducherry and organized by Vinayaka Mission''s Research Foundation. The students successfully presented their accepted papers.',
  'Conference',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7407377566589759488-qigD',
  ARRAY[
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-1.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-2.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-3.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-4.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-5.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-6.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-7.jpg',
    '/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-8.jpg'
  ]
),

-- Existing hardcoded id 10: AISTS 2025 IEEE Xplore Publication
(
  5,
  '18th November 2025',
  '2025-11-18',
  'KSV Students Publish AI Research in IEEE Xplore at AISTS 2025 International Conference',
  'A proud research milestone for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers successfully published their paper at the International Conference on Artificial Intelligence and Smart Technologies for Sustainability (AISTS) 2025, organized by Marwadi University, Rajkot. The research paper titled "Exploring AI''s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI" has been published in the IEEE Xplore Digital Library, reflecting the students'' dedication to meaningful research and innovation.',
  'Research Paper Publish',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7398590758359912448-l4bb',
  ARRAY['/Achievements/Research-Paper-Publication-18-11-25/img-1.jpg']
),

-- Existing hardcoded id 11: TrafficEye IEEE Xplore at AIMV-2025
(
  4,
  '21st October 2025',
  '2025-10-21',
  'KSV Students Publish ''TrafficEye'' Research in IEEE Xplore at AIMV-2025',
  'A proud research achievement for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers successfully published their paper titled "TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach" in the IEEE Xplore Digital Library through the 2nd IEEE International Conference on Artificial Intelligence and Machine Vision (AIMV-2025). Guided by Dr. Himani Trivedi, the research explores the application of deep learning techniques to improve traffic management and optimization, contributing to smarter and more efficient urban mobility solutions.',
  'Research Paper Publish',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-mmpsrpc-researchexcellence-activity-7389603335164743680-rS1B',
  ARRAY['/Achievements/Research-Paper-Publication-21-10-25/img-1.jpg']
),

-- Existing hardcoded id 12: 9th NYC Green School Conference 2025
(
  3,
  NULL,
  NULL,
  'KSV Researchers Present Sustainability and AI Research at 9th NYC Green School Conference 2025',
  'A proud moment for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as faculty and student researchers showcased their work at the 9th NYC Green School Conference 2025, organized by Green Mentors at the ILR School, Cornell University, New York. Representing LDRP Institute of Technology & Research, the researchers presented innovative work focused on sustainable construction, ethical AI in education, and AI-driven sustainability diagnostics for smart institutions. Their participation reflects the growing research culture and commitment to addressing global challenges through innovation and interdisciplinary thinking.',
  'Global Recognition',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7380831837272756224-XA7Q',
  ARRAY[
    '/Achievements/Global-Recognition-9th-NYC/img-1.jpg',
    '/Achievements/Global-Recognition-9th-NYC/img-2.jpg',
    '/Achievements/Global-Recognition-9th-NYC/img-3.jpg',
    '/Achievements/Global-Recognition-9th-NYC/img-4.jpg',
    '/Achievements/Global-Recognition-9th-NYC/img-5.jpg',
    '/Achievements/Global-Recognition-9th-NYC/img-6.jpg'
  ]
),

-- Existing hardcoded id 13: GTU National AI Poster Competition
(
  2,
  '19th & 20th September 2025',
  '2025-09-19',
  'KSV Student Teams Selected for Finale of National AI Poster Competition by GTU',
  'A proud moment for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers have been selected for the finale of the National Poster Competition on AI Powered Research and Innovation, organized by Gujarat Technological University (GTU), Ahmedabad. The selected teams will present their innovative research posters at the national-level finale scheduled for 19–20 September 2025, showcasing their work on AI-driven student dropout analysis using machine learning and air pollution tracking through satellite and ground data fusion. Guided by Dr. Himani Trivedi, this achievement reflects the growing research culture, innovation mindset, and collaborative learning environment fostered within the Students Research Lab.',
  'Research Poster',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_gtu-airesearch-studentinnovation-activity-7376116498777616385-VT7i',
  ARRAY[
    '/Achievements/Research-Posters-19&20-9-25/img-1.jpg',
    '/Achievements/Research-Posters-19&20-9-25/img-2.jpg',
    '/Achievements/Research-Posters-19&20-9-25/img-3.jpg',
    '/Achievements/Research-Posters-19&20-9-25/img-4.jpg'
  ]
),

-- Existing hardcoded id 14: Springer LNNS Publication
(
  1,
  '8th & 9th November 2024',
  '2024-11-08',
  'KSV Students Publish Research in Springer LNNS Series at International Conference on Data Science and Security',
  'A significant research milestone for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers successfully published their paper titled "Improving Urban Road Safety: Enhancing Pedestrian Safety Through Automated Traffic Signal Control and Law Enforcement" in the Springer Lecture Notes in Networks and Systems (LNNS) book series – Data Science and Security. The research was presented at the International Conference on Data Science, Computation and Security 2024, highlighting innovative approaches to improving urban road safety through intelligent traffic signal control and enforcement mechanisms. Guided by Dr. Himani Trivedi, this achievement reflects the strong research culture, innovation, and application-driven learning nurtured within the Students Research Lab.',
  'Research Paper Publish',
  'image',
  'https://www.linkedin.com/posts/mmpsrpc_springer-researchpublication-datascience-activity-7368163507625746434-vjXc',
  ARRAY['/Achievements/Research-Posters-8&9-11-24/img-1.jpg']
)

ON CONFLICT (serial_no) DO NOTHING;
