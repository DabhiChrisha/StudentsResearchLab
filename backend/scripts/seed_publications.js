/**
 * seed_publications.js
 *
 * Upserts all SRL publications into the `publications` table.
 * Run AFTER the SQL migration has been applied in Supabase:
 *
 *   node scripts/seed_publications.js
 *
 * Uses UPSERT (onConflict: title) so it is safe to re-run.
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

// Uses same env var names as src/supabase.js
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Normalise enrollment_nos: trim each value, uppercase, join with comma (no spaces)
function normalizeEnrollments(raw) {
  if (!raw) return null;
  return raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .join(",");
}

// Extract the most reliable 4-digit year from a messy date string
function extractYear(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/\b(20\d{2})\b/);
  if (m) return parseInt(m[1]);
  // Handle short year formats like "25", "26"
  const shortM = dateStr.match(/\b(\d{2})\b/);
  if (shortM) {
    const n = parseInt(shortM[1]);
    if (n >= 20 && n <= 30) return 2000 + n;
  }
  return null;
}

const PUBLICATIONS = [
  {
    title: "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
    authors_full: "Charmi Padh, Prem Raichura, Rohan Thakar, Zenisha Devani, Swayam Kalburgi, Zeel Kanudawala, Dr. Chintan M. Bhatt, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30144,224SBECE30059,23BECE30364,23BECE30058,23BECE30101",
    date_raw: "20/02/2026 - Submitted",
    venue: "Multimedia Tools and Applications",
    event_type: "Journal",
    publication_category: "Paper under Review",
    author_count_students: 6,
    author_count_srl: 5,
    institute: "LDRP-ITR",
  },
  {
    title: "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
    authors_full: "Kandarp Gajjar, Nancy Patel, Ridham Patel, Krutika Patel, Chrisha Dabhi, Himani Trivedi, Mahesh Goyani, Chintan Bhatt",
    enrollment_nos: "22BECE30091,22BEIT30123,22BEIT30133,22BEIT30118,24BECE30489",
    date_raw: "11/03/2026 - Submitted",
    venue: "International Journal of Intelligent Transportation Systems Research",
    event_type: "Journal",
    publication_category: "Paper under Review",
    author_count_students: 5,
    author_count_srl: 5,
    institute: "LDRP-ITR",
  },
  {
    title: "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
    authors_full: "Banshari Patel, Jainee Patel, Krish Patel, Hemant Pande, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30168,23BECE30203,23BECE30532,23BECE30493",
    date_raw: "17/11/2025 - Published",
    venue: "2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS)",
    event_type: "Conference",
    publication_category: "Scopus Paper Publication",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI (Poster)",
    authors_full: "Banshari Patel, Jainee Patel, Krish Patel, Hemant Pande, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30168,23BECE30203,23BECE30532,23BECE30493",
    date_raw: "21st - 22nd August 2025",
    venue: "IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025",
    event_type: "Poster Presentation",
    publication_category: "Poster Presentation",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals",
    authors_full: "Hemant Pande, Jainee Patel, Banshari Patel, Krish Patel, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30493,23BECE30203,23BECE30168,23BECE30532",
    date_raw: "20/03/2026 - Submitted",
    venue: "International Conference on Converging Intelligence",
    event_type: "Conference",
    publication_category: "Paper under Review",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "Introduction to Internet of Things",
    authors_full: "Hemant Pande, Jainee Patel, Banshari Patel, Krish Patel, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30493,23BECE30203,23BECE30168,23BECE30532",
    date_raw: "28-Oct-25",
    venue: "Contemporary Research in Mathematics from India",
    event_type: "Book",
    publication_category: "Scopus Book Chapter Accepted",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "Intelligent Bending Parameter Optimizer",
    authors_full: "Henit Panchal, Hetvi Hinsu, Mihir Patel, Heny Patel, Dr. Himani Trivedi, Prof. Parth Patel",
    enrollment_nos: "23BECE30490,23BECE30449,23BECE30542,23BECE30521",
    date_raw: "06-Feb-26",
    venue: "National-level 3rd Project Advisor Group (PAG) Meeting of the DST-Technology Enabling Centre (DST-TEC)",
    event_type: "Poster Presentation",
    publication_category: "Poster Presentation",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning",
    authors_full: "Hemant Pande, Ridham Patel, Krish Patel, Chrisha Dabhi, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30493,22BEIT30133,23BECE30532,24BECE30489",
    date_raw: "19th - 20th September 2025",
    venue: "National Poster Competition on AI-Powered Research and Innovation",
    event_type: "Poster Presentation",
    publication_category: "Poster Presentation",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "Quantum Simulation Tools: A Comprehensive Survey",
    authors_full: "Zenisha Devani, Rohan Thakar, Zeel Kanudawala, Charmi Padh, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30058,23BECE30364,23BECE30101,23BECE30144",
    date_raw: "28-10-2025",
    venue: "Contemporary Research in Mathematics from India",
    event_type: "Book",
    publication_category: "Scopus Book Chapter Accepted",
    author_count_students: 4,
    author_count_srl: 4,
    institute: "LDRP-ITR",
  },
  {
    title: "TrafficEye: Intelligent Traffic Optimization using Deep Learning Approach",
    authors_full: "Zalak Vachhani, Charmi Padh, Prem Raichura, Rohan Thakar, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30144,224SBECE30059,23BECE30364",
    date_raw: "21/10/2025 - Published",
    venue: "2nd IEEE International Conference on Artificial Intelligence and Machine Vision",
    event_type: "Conference",
    publication_category: "Scopus Paper Publication",
    author_count_students: 4,
    author_count_srl: 3,
    institute: "LDRP-ITR",
  },
  {
    title: "Thermalytix: Privacy-Preserving AI for Breast Cancer Screening",
    authors_full: "Chitroda Janki, Chavada Yashvikuvarba, Bhatt Krishna",
    enrollment_nos: "23BECE30040,23BECE30036,23BECE30023",
    date_raw: "17-Feb-26",
    venue: "India AI Impact Summit-2026",
    event_type: "Conference",
    publication_category: "Case Study Publication",
    author_count_students: 3,
    author_count_srl: 3,
    institute: "LDRP-ITR",
  },
  {
    title: "Generative AI as a Catalyst in Indian Education Ecosystems",
    authors_full: "Henit Panchal, Hetvi Hinsu, Heny Patel, Dr. Shivani Trivedi, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30490,23BECE30449,23BECE30521",
    date_raw: "23-Dec-25",
    venue: "Advancing AI and ML Across Disciplines, Gwailor, India",
    event_type: "Conference",
    publication_category: "Scopus Paper Publication",
    author_count_students: 3,
    author_count_srl: 3,
    institute: "LDRP-ITR, SKPIMCS",
  },
  {
    title: "Tracking Air Pollution using INSAT Satellite and Ground Data Fusion",
    authors_full: "Jainee Patel, Banshari Patel, Mahi Parmar",
    enrollment_nos: "23BECE30203,23BECE30168,24BECE30548",
    date_raw: "19th - 20th September 2025",
    venue: "National Poster Competition on AI-Powered Research and Innovation",
    event_type: "Poster Presentation",
    publication_category: "Poster Presentation",
    author_count_students: 3,
    author_count_srl: 3,
    institute: "LDRP-ITR",
  },
  {
    title: "ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds",
    authors_full: "Rohan Thakar, Zenisha Devani, Zeel Kanudawala, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30364,23BECE30058,23BECE30101",
    date_raw: null,
    venue: "International Conference on Converging Intelligence (CICON 2026)",
    event_type: "Conference",
    publication_category: "Paper under Review",
    author_count_students: 3,
    author_count_srl: 3,
    institute: "LDRP-ITR",
  },
  {
    title: "SHAP-Enhanced Outbreak Forecasting: Interpretable Multi-Modal Learning for Waterborne Disease Prediction",
    authors_full: "Krish Patel, Jenish Sorathiya, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30532,23BEIT54020",
    date_raw: "10-Dec-25",
    venue: "National Scientific Conference on Emerging Trends in Multidisciplinary Research - 2025",
    event_type: "Conference",
    publication_category: "Non-Scopus Paper Publication",
    author_count_students: 2,
    author_count_srl: 2,
    institute: "LDRP-ITR, VS-ITR",
  },
  {
    title: "Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations",
    authors_full: "Hemant Pande, Honey Modha, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30493,224SBECE30016",
    date_raw: "10-Dec-25",
    venue: "National Scientific Conference on Emerging Trends in Multidisciplinary Research - 2025",
    event_type: "Conference",
    publication_category: "Non-Scopus Paper Publication",
    author_count_students: 2,
    author_count_srl: 2,
    institute: "LDRP-ITR",
  },
  {
    title: "Ensemble Intelligence for Model Classification in Next-Generation Smart Agriculture: Crop and Soil-Based Recommendation System",
    authors_full: "Dr. Himani Trivedi, Hetal Chauhan, Suresh Patel, Mahendra N Patel, Pradip Patel, Mahi Parmar, Chrisha Dabhi",
    enrollment_nos: "24BECE30548,24BECE30489",
    date_raw: "08/03/2026 - Submitted for reviewal",
    venue: "Pertanika Journal of Science and Technology",
    event_type: "Journal",
    publication_category: "Paper under Review",
    author_count_students: 2,
    author_count_srl: 2,
    institute: "LDRP-ITR",
  },
  {
    title: "Effect of Class Imbalance and Resample on CNN Performance for Prostate Cancer Detection",
    authors_full: "Krish Patel, Dr. Amit Thakkar, Dr. Himani Trivedi",
    enrollment_nos: "23BECE30532",
    date_raw: "19-Nov-25",
    venue: "World Conference on Computational Science and Intelligence",
    event_type: "Conference",
    publication_category: "Non-Scopus Paper Accepted",
    author_count_students: 1,
    author_count_srl: 1,
    institute: "LDRP-ITR",
  },
  {
    title: "Misinformation Detection using Large Language Models with Explainability",
    authors_full: "Jainee Patel, Dr. Chintan M. Bhatt, Dr. Himani Trivedi, Dr. Thanh Thi Nguyen",
    enrollment_nos: "23BECE30203",
    date_raw: "02/03/2026 - Published",
    venue: "8th International Conference on Algorithms, Computing and Artificial Intelligence (ACAI 2025), Nanjing, China",
    event_type: "Conference",
    publication_category: "Scopus Paper Publication",
    author_count_students: 1,
    author_count_srl: 1,
    institute: "LDRP-ITR",
  },
  {
    title: "Personalized Mood Detection Using LLMs",
    authors_full: "Banshari Patel, Chintan Bhatt, Himani Trivedi, Alessandro Bruno, Pier Luigi Mazzeo",
    enrollment_nos: "23BECE30168",
    date_raw: "3rd January 2026",
    venue: "Second International Conference On Artificial Intelligence, Computation, Communication And Network Security (AICCoNS), University of Wollongong in Dubai, UAE",
    event_type: "Conference",
    publication_category: "Scopus Index Paper Accepted",
    author_count_students: 1,
    author_count_srl: 1,
    institute: "LDRP-ITR",
  },
  {
    title: "Explainable Edge Intelligence for WiFi Anomaly Detection in IoT Environments using TinyML",
    authors_full: "Parva Kumar, Krenil Radadiya, Trupesh Patel, Radhika Wala",
    enrollment_nos: "22BECE30153",
    date_raw: "10-Mar-26",
    venue: "2026 International Conference on NextGen Data Science and Analytics (ICNDSA)",
    event_type: "Conference",
    publication_category: "Scopus Paper Acceptance",
    author_count_students: 2,
    author_count_srl: 1,
    institute: "LDRP-ITR",
  },
];

async function seed() {
  console.log(`Seeding ${PUBLICATIONS.length} publications...`);

  const rows = PUBLICATIONS.map((p) => ({
    ...p,
    enrollment_nos: normalizeEnrollments(p.enrollment_nos),
    year: extractYear(p.date_raw),
  }));

  // Upsert in batches of 10 to stay within Supabase limits
  for (let i = 0; i < rows.length; i += 10) {
    const batch = rows.slice(i, i + 10);
    const { error } = await supabase
      .from("publications")
      .upsert(batch, { onConflict: "title", ignoreDuplicates: false });

    if (error) {
      console.error(`Batch ${i / 10 + 1} failed:`, error.message);
      process.exit(1);
    }
    console.log(`  Inserted rows ${i + 1}–${Math.min(i + 10, rows.length)}`);
  }

  console.log("Done! All publications seeded.");
}

seed().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
