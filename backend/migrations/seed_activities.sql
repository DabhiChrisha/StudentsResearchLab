-- Insert 2 new activities from CSV (sequences 5 and 6)
INSERT INTO activities (title, description, link, brief, date, "Photo", sequence)
VALUES
(
  'SRL Students Researchers Team at the IndiaAI Impact Summit 2026',
  'Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, proudly highlights the distinguished participation of its KSV Students at the IndiaAI Impact Summit 2026 — an international-level AI summit organized under the Digital India initiative by the Ministry of Electronics and Information Technology (MeitY), Government of India, through INDIAai, held from 16th to 20th February 2026 at Bharat Mandapam, Sushma Swaraj Bhawan & Ambedkar Bhawan, New Delhi.

KSV Students Researchers Team Selected for Casebook on AI and Gender Empowerment
• Janki Chitroda, CE, LDRP-ITR, KSV
• Yashvi Chavda, CE, LDRP-ITR, KSV
• Krishna Bhatt, CE, LDRP-ITR, KSV
Guided By: Dr. Himani Trivedi Ma''am, Head, M. M. Patel Students Research Project Cell, KSV

In parallel with the summit, the KSV Students Researchers Team has been selected for the Casebook on AI and Gender Empowerment initiative, led by the Ministry of Electronics and Information Technology (MeitY), Government of India, in collaboration with UN Women India, for scalable, gender-responsive AI solutions across the Global South. Our selected KSV students will have the valuable opportunity to present their research work to the global audience of policymakers and innovators, marking national recognition of KSV''s impactful research.',
  'https://www.linkedin.com/feed/update/urn:li:activity:7429342935848067073',
  'KSV students represented at the IndiaAI Impact Summit 2026 and were selected for the international Casebook on AI and Gender Empowerment.',
  '16th - 20th February 2026',
  NULL,
  5
),
(
  'Bridging Theory & Practice – A Research Talk',
  'The session "Bridging Theory & Practice – A Research Talk" was conducted on 24th February 2026 at the Students Research Lab, KSV, organized by MMPSRPC in collaboration with IEEE KSV SB.

The session was delivered by Dr. Mukti Advani, Senior Principal Scientist at CSIR–CRRI, who shared insights on translating research into real-world impact, particularly in road engineering, infrastructure, and safety. She highlighted the role of AI/ML in road safety through initiatives like iRASTE, enabling real-time monitoring, risk prediction, and data-driven decision-making.

The event concluded with an interactive discussion where participants proposed practical, research-oriented solutions.',
  'https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7433045243920314368-VrM2',
  'A research talk by Dr. Mukti Advani (CSIR–CRRI) on translating research into real-world impact in road safety and AI/ML applications.',
  '24th February 2026',
  NULL,
  6
)
ON CONFLICT (sequence) DO NOTHING;
