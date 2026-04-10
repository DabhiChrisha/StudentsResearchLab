-- ============================================================
-- Publications Data Seeding Migration
-- Populates the publications table with research papers, conferences,
-- journals, and posters from the Students Research Lab
-- 
-- Duplicate Handling: Uses ON CONFLICT to skip existing entries
-- identified by title and venue combination
-- ============================================================

-- Step 1: Create publications table if it doesn't exist
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_no INT4,
  student_authors TEXT,
  department TEXT,
  institute TEXT DEFAULT 'LDRP-ITR',
  title TEXT NOT NULL,
  event_type TEXT,
  is_srl_member BOOLEAN DEFAULT TRUE,
  paper_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  venue TEXT,
  date TEXT,
  description TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  enrollment_nos TEXT,
  year INT4
);

-- Step 2: Make serial_no nullable if it has a NOT NULL constraint
ALTER TABLE publications ALTER COLUMN serial_no DROP NOT NULL;

-- Step 3: Add unique constraint for duplicate detection (if it doesn't exist)
-- This constraint allows ON CONFLICT to work properly
DO $$
BEGIN
  ALTER TABLE publications 
  ADD CONSTRAINT publications_title_venue_unique UNIQUE (title, venue);
EXCEPTION WHEN duplicate_object THEN
  NULL;  -- Constraint already exists, skip
END $$;

-- Step 4: Create index on title for faster lookups
CREATE INDEX IF NOT EXISTS idx_publications_title ON publications(title);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(category);

-- Step 5: Insert publications data
-- Using ON CONFLICT DO NOTHING to skip duplicates
INSERT INTO publications (
  student_authors,
  department,
  institute,
  title,
  event_type,
  is_srl_member,
  paper_url,
  venue,
  date,
  description,
  tags,
  category,
  year
) VALUES
  ('Janki Chitroda, Yashvi Chavda, Krishna Bhatt', NULL, 'LDRP-ITR', 'Casebook on AI and Gender Empowerment', 'Book Chapter', TRUE, 'https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429466085311098880-XDnV', 'IndiaAI Impact Summit in collaboration with UN Women India', 'Feb 2026', 'Featured among the prestigious 23 global research works published in the Casebook on AI and Gender Empowerment. The research focuses on inclusive AI innovation and empowerment.', ARRAY['AI', 'Gender Empowerment', 'UN Women'], 'Book Chapter', 2026),
  
  ('Ayushi Joddha, Manasvi Shah, Swayam Kalburgi', NULL, 'LDRP-ITR', 'EfficientNetB3 Adapted Hybrid UNet with Attention Guided Decoding for Urban Scene Segmentation', 'Conference', TRUE, 'https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7413814908217344000-JmvS', '13th IEEE International Conference on Intelligent Systems and Embedded Design (ISED 2025)', 'Dec 2025', 'This paper proposes a novel adapted hybrid UNet using EfficientNetB3 to perform robust urban scene segmentation by selectively attending to salient spatial features.', ARRAY['Computer Vision', 'Segmentation', 'IEEE Xplore'], 'Conference', 2025),
  
  ('Students Research Lab', NULL, 'LDRP-ITR', 'Improving Urban Road Safety: Enhancing Pedestrian Safety Through Automated Traffic Signal Control and Law Enforcement', 'Book Chapter', TRUE, 'https://www.linkedin.com/posts/mmpsrpc_springer-researchpublication-datascience-activity-7368163507625746434-vjXc', 'International Conference on Data Science, Computation and Security 2024 (Springer LNNS)', 'Nov 2024', 'Proposed automated mechanisms using edge computing architectures integrated with urban traffic signal networks to improve pedestrian safety conditions and automate crosswalk law enforcement.', ARRAY['Smart City', 'Edge Computing', 'Springer'], 'Book Chapter', 2024),
  
  ('Nancy Patel, Kandarp Gajjar, Patel Ridham, Patel Krutika', NULL, 'LDRP-ITR', 'Filed for Complete Patent', 'Patents', TRUE, '#', 'Status: Ongoing', 'Mar 2026', '', ARRAY[]::TEXT[], 'Patents', 2026),
  
  ('Jainee Patel, Dr. Chintan M. Bhatt, Dr. Himani Trivedi, Dr. Thanh Thi Nguyen', NULL, 'LDRP-ITR', 'Misinformation Detection using Large Language Models with Explainability', 'Conference', TRUE, 'https://ieeexplore.ieee.org/document/11406235', '8th International Conference on Algorithms, Computing and Artificial Intelligence (ACAI 2025), Nanjing, China', 'Mar 2026', 'Proposes a novel approach for detecting misinformation using Large Language Models with explainability techniques. The research integrates advanced NLP and XAI methods to enhance the transparency and reliability of misinformation detection systems.', ARRAY['LLM', 'Misinformation Detection', 'XAI', 'Scopus'], 'Conference', 2026),
  
  ('Banshari Patel, Jainee Patel, Krish Patel, Hemant Pande, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Exploring AI''s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI', 'Conference', TRUE, 'https://ieeexplore.ieee.org/document/11232740', '2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS 2025)', 'Nov 2025', 'An empirical study evaluating how Explainable AI interfaces shape human decision-making processes, cognitive dependency, and productivity in complex task environments.', ARRAY['XAI', 'Cognitive Computing', 'Human-AI Interaction', 'Scopus'], 'Conference', 2025),
  
  ('Charmi Padh, Prem Raichura, Rohan Thakar, Zenisha Devani, Swayam Kalburgi, Zeel Kanudawala, Dr. Chintan M. Bhatt, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models', 'Journal', TRUE, 'https://ieeexplore.ieee.org/document/11203522', 'Multimedia Tools and Applications', 'Feb 2026', 'A comprehensive survey and case-based analysis of deepfake detection models, focusing on face-swapping techniques. The paper provides theoretical foundations and practical implementations for detecting fraudulent video content.', ARRAY['Deepfake Detection', 'Face Swapping', 'Computer Vision', 'Under Review'], 'Journal', 2026),
  
  ('Hemant Pande, Jainee Patel, Banshari Patel, Krish Patel, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals', 'Conference', TRUE, 'https://drive.google.com/file/d/1mt1ZA1hYJpLCNmESQ2U5h7xN9GXRoVAD/view', 'International Conference on Converging Intelligence (CICON 2026)', 'Mar 2026', 'Develops an advanced deep learning approach using dilated temporal convolutional networks to enable early diagnosis of epileptic seizures from scalp EEG signals. The model shows significant improvements in sensitivity and specificity.', ARRAY['Healthcare', 'EEG Analysis', 'Deep Learning', 'Under Review'], 'Conference', 2026),
  
  ('Jainee Patel, Banshari Patel, Mahi Parmar', NULL, 'LDRP-ITR', 'Tracking Air Pollution using INSAT Satellite and Ground Data Fusion', 'Poster Presentation', TRUE, 'https://drive.google.com/file/d/1Y4EJwUSobWPPwendmO7oJZY80-hAV86t/view', 'National Poster Competition on AI-Powered Research and Innovation', 'Sep 2025', 'An innovative approach to track and monitor air pollution levels by fusing satellite data from INSAT with ground-based sensors. The system provides real-time air quality assessment and predictive modeling.', ARRAY['Environmental Monitoring', 'Satellite Data', 'Data Fusion', 'Poster'], 'Poster Presentation', 2025),
  
  ('Banshari Patel, Jainee Patel, Krish Patel, Hemant Pande, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Exploring AI''s Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI - Poster Presentation', 'Poster Presentation', TRUE, 'https://drive.google.com/file/d/1YMtYf9HSIDIvpjz3GuK5YU6dlKatYAta/view', 'IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025', 'Aug 2025', 'Poster presentation showcasing empirical findings on how AI interfaces influence human cognitive processes, learning outcomes, and professional productivity in diverse work environments.', ARRAY['XAI', 'Cognitive Skills', 'Human-AI Interaction', 'IEEE', 'Poster'], 'Poster Presentation', 2025),
  
  ('Kandarp Gajjar, Nancy Patel, Ridham Patel, Krutika Patel, Chrisha Dabhi, Himani Trivedi, Mahesh Goyani, Chintan Bhatt', NULL, 'LDRP-ITR', 'Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders', 'Journal', TRUE, 'https://ieeexplore.ieee.org/document/11203360', 'International Journal of Intelligent Transportation Systems Research', 'Mar 2026', 'Proposes a federated learning-based framework for decentralized helmet detection and surveillance. The approach prioritizes privacy while maintaining accuracy in detecting traffic safety compliance.', ARRAY['Federated Learning', 'Computer Vision', 'IoT', 'Safe Driving', 'Under Review'], 'Journal', 2026),
  
  ('Hemant Pande, Ridham Patel, Krish Patel, Chrisha Dabhi, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning', 'Poster Presentation', TRUE, 'https://ieeexplore.ieee.org/document/11203360', 'National Poster Competition on AI-Powered Research and Innovation', 'Sep 2025', 'Applies advanced machine learning algorithms to analyze and predict student dropout patterns. The research integrates demographic, academic, and socioeconomic data for comprehensive intervention strategies.', ARRAY['Education Analytics', 'Machine Learning', 'Student Success', 'Poster'], 'Poster Presentation', 2025),
  
  ('Students Research Lab', NULL, 'LDRP-ITR', 'Fusing Retrieval Techniques for Enhanced Personalized Community Question Answering', 'Conference', TRUE, 'https://ceur-ws.org/Vol-4054/T5-2.pdf', 'CEUR Workshop Series', '2026', 'Develops an intelligent system that fuses multiple retrieval techniques to provide personalized, context-aware answers in community question answering platforms. The approach enhances user experience through semantic understanding.', ARRAY['NLP', 'Information Retrieval', 'QA Systems', 'Machine Learning'], 'Conference', 2026),
  
  ('Zenisha Devani, Rohan Thakar, Zeel Kanudawala, Charmi Padh, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Quantum Simulation Tools: A Comprehensive Survey', 'Book Chapter', TRUE, 'https://ieeexplore.ieee.org/document/10543438', 'Contemporary Research in Mathematics from India', 'Oct 2025', 'A comprehensive survey of quantum simulation tools and frameworks, covering theoretical foundations and practical applications. The chapter explores advanced computational techniques for quantum system modeling.', ARRAY['Quantum Computing', 'Simulation Tools', 'Mathematics', 'Scopus'], 'Book Chapter', 2025),
  
  ('Zalak Vachhani, Charmi Padh, Prem Raichura, Rohan Thakar, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach', 'Conference', TRUE, 'https://link.springer.com/chapter/10.1007/978-3-032-10756-5_12', '2nd IEEE International Conference on Artificial Intelligence and Machine Vision (AIMV 2025)', 'Oct 2025', 'A deep learning framework to optimize traffic flow operations dynamically. The system detects congestion points and intelligently redirects vehicle flows to minimize latency and reduce environmental impact.', ARRAY['Deep Learning', 'Smart City', 'IoT', 'Scopus'], 'Conference', 2025),
  
  ('Chitroda Janki, Chavada Yashvikuvarba, Bhatt Krishna', NULL, 'LDRP-ITR', 'Thermalytix: Privacy-Preserving AI for Breast Cancer Screening', 'Conference', TRUE, 'https://ieeexplore.ieee.org/document/10425861', 'India AI Impact Summit-2026', 'Feb 2026', 'An innovative privacy-preserving AI system for breast cancer screening that leverages federated learning and differential privacy. The approach maintains patient confidentiality while enabling accurate diagnosis.', ARRAY['Healthcare', 'Breast Cancer', 'Privacy', 'AI', 'Case Study'], 'Conference', 2026),
  
  ('Henit Panchal, Hetvi Hinsu, Heny Patel, Dr. Shivani Trivedi, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Generative AI as a Catalyst in Indian Education Ecosystems', 'Conference', TRUE, 'https://link.springer.com/chapter/10.1007/978-981-96-4880-1_29', 'Advancing AI and ML Across Disciplines (AAMLAD 2025), Gwailor, India', 'Dec 2025', 'An analysis of how generative AI paradigms can be adopted to personalize learning paths, scale assessment models, and bridge educational disparities in India.', ARRAY['Generative AI', 'EdTech', 'India', 'Education', 'Scopus'], 'Conference', 2025),
  
  ('Dr. Himani Trivedi, Hetal Chauhan, Suresh Patel, Mahendra N Patel, Pradip Patel, Mahi Parmar, Chrisha Dabhi', NULL, 'LDRP-ITR', 'Ensemble Intelligence for Model Classification in Next-Generation Smart Agriculture: Crop and Soil-Based Recommendation System', 'Journal', TRUE, 'https://link.springer.com/chapter/10.1007/978-3-032-10670-4_17', 'Pertanika Journal of Science and Technology', 'Mar 2026', 'Develops an ensemble learning system for intelligent crop and soil classification in precision agriculture. The model integrates multiple AI techniques to provide actionable recommendations for farmers.', ARRAY['Precision Agriculture', 'Machine Learning', 'Ensemble Methods', 'IoT', 'Under Review'], 'Journal', 2026),
  
  ('Rohan Thakar, Zenisha Devani, Zeel Kanudawala, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds', 'Conference', TRUE, 'https://ieeexplore.ieee.org/abstract/document/11405024', 'International Conference on Converging Intelligence (CICON 2026)', '2026', 'Proposes a zero-trust security architecture specifically designed for multi-tenant cloud environments. The framework ensures continuous verification and minimizes security risks in shared cloud infrastructure.', ARRAY['Cybersecurity', 'Cloud Computing', 'Zero Trust', 'Architecture', 'Under Review'], 'Conference', 2026),
  
  ('Krish Patel, Jenish Sorathiya, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'SHAP-Enhanced Outbreak Forecasting: Interpretable Multi-Modal Learning for Waterborne Disease Prediction', 'Conference', TRUE, 'https://ieeexplore.ieee.org/document/11203360', 'National Scientific Conference on Emerging Trends in Multidisciplinary Research (NASCENT MR 2025)', 'Dec 2025', 'Utilizes interpretable multi-modal learning approaches enhanced with SHAP values for explaining and predicting waterborne disease outbreak probabilities with high precision.', ARRAY['Healthcare', 'XAI', 'Disease Forecasting', 'Multi-Modal Learning'], 'Conference', 2025),
  
  ('Hemant Pande, Honey Modha, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations', 'Conference', TRUE, 'https://www.inderscienceonline.com/doi/abs/10.1504/IJCVR.2025.147513', 'National Scientific Conference on Emerging Trends in Multidisciplinary Research (NASCENT MR 2025)', 'Dec 2025', 'Focuses on advanced data mining strategies to uncover hidden health risk variables from unstructured clinical datasets representing underserved demographics.', ARRAY['Data Mining', 'Healthcare', 'Analytics', 'Health Equity'], 'Conference', 2025),
  
  ('Hemant Pande, Jainee Patel, Banshari Patel, Krish Patel, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Introduction to Internet of Things', 'Book Chapter', TRUE, 'https://link.springer.com/chapter/10.1007/978-3-032-10940-8_29', 'Contemporary Research in Mathematics from India', 'Oct 2025', 'A comprehensive introduction to Internet of Things architectures, protocols, and applications. The chapter covers fundamental concepts and practical implementations in modern IoT systems.', ARRAY['IoT', 'Networking', 'Smart Systems', 'Scopus'], 'Book Chapter', 2025),
  
  ('Henit Panchal, Hetvi Hinsu, Mihir Patel, Heny Patel, Dr. Himani Trivedi, Prof. Parth Patel', NULL, 'LDRP-ITR', 'Intelligent Bending Parameter Optimizer', 'Poster Presentation', TRUE, 'https://ieeexplore.ieee.org/document/11212073', 'National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)', 'Feb 2026', 'An advanced optimization system for manufacturing processes that intelligently adjusts bending parameters. The system uses ML to improve precision and reduce material waste in industrial production.', ARRAY['Manufacturing', 'Optimization', 'Machine Learning', 'Poster'], 'Poster Presentation', 2026),
  
  ('Krish Patel, Dr. Amit Thakkar, Dr. Himani Trivedi', NULL, 'LDRP-ITR', 'Effect of Class Imbalance and Resample on CNN Performance for Prostate Cancer Detection', 'Conference', TRUE, 'https://expo.74ipc.com/posters', 'World Conference on Computational Science and Intelligence', 'Nov 2025', 'Analyzes the impact of class imbalance in medical imaging datasets and evaluates resampling techniques for improving CNN performance in prostate cancer detection.', ARRAY['Healthcare', 'Deep Learning', 'Medical Imaging', 'Class Imbalance'], 'Conference', 2025),
  
  ('Banshari Patel, Chintan Bhatt, Himani Trivedi, Alessandro Bruno, Pier Luigi Mazzeo', NULL, 'LDRP-ITR', 'Personalized Mood Detection Using LLMs', 'Conference', TRUE, 'https://journals.lww.com/jcor/fulltext/2025/07000/association_of_socioeconomic_factors_and_body_mass.13.aspx', 'Second International Conference On Artificial Intelligence, Computation, Communication And Network Security (AICCoNS), University of Wollongong in Dubai, UAE', 'Jan 2026', 'Develops an intelligent system using Large Language Models to detect and analyze human emotions from textual communication. The approach enables personalized mental health monitoring and support.', ARRAY['LLM', 'Emotion Detection', 'Psychology', 'AI', 'Scopus'], 'Conference', 2026),
  
  ('Parva Kumar, Krenil Radadiya, Trupesh Patel, Radhika Wala', NULL, 'LDRP-ITR', 'Explainable Edge Intelligence for WiFi Anomaly Detection in IoT Environments using TinyML', 'Conference', TRUE, 'https://ieeexplore.ieee.org/document/11438568', '2026 International Conference on NextGen Data Science and Analytics (ICNDSA)', 'Mar 2026', 'An innovative approach combining edge computing, lightweight machine learning, and explainability techniques for detecting WiFi anomalies in IoT networks. The system operates efficiently on resource-constrained devices.', ARRAY['IoT', 'Edge Computing', 'TinyML', 'Anomaly Detection', 'XAI', 'Scopus'], 'Conference', 2026)
ON CONFLICT (title, venue) DO NOTHING;

-- Step 6: Log the result
DO $$
BEGIN
  RAISE NOTICE 'Publications seed migration completed successfully. Duplicates (same title & venue) were skipped.';
END $$;
