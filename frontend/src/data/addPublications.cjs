const fs = require('fs');
const path = require('path');

const publicationsData = {
  "AAYUSH VIRAL PANDYA": [],
  "ARNAB GHOSH": [],
  "CHAVADA YASHVI SURENDRASINH": [
    {
      "title": "Thermalytix: Privacy-Preserving AI for Breast Cancer Screening",
      "venue": "India AI Impact Summit-2026",
      "type": "Conference",
      "category": "Case Study Publication",
      "date": "17-Feb-26",
      "conferenceGrant": true,
      "studentPresenter": "Chitroda Janki"
    }
  ],
  "DABHI CHRISHA MANISH": [
    {
      "title": "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
      "venue": "International Journal of Intelligent Transportation Systems Research",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "11/03/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Ensemble Intelligence for Model Classification in Next-Generation Smart Agriculture: Crop and Soil-Based Recommendation System",
      "venue": "Pertanika Journal of Science and Technology",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "08/03/2026 - Submitted for reviewal",
      "conferenceGrant": false
    },
    {
      "title": "Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    }
  ],
  "DEVDA RACHITA BHARATSINH": [],
  "GAJJAR ANTRA ASHVINKUMAR": [],
  "GHETIYA POOJAN RAHULBHAI": [],
  "HENY PATEL": [
    {
      "title": "Intelligent Bending Parameter Optimizer",
      "venue": "National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "06-Feb-26",
      "conferenceGrant": false
    },
    {
      "title": "Generative AI as a Catalyst in Indian Education Ecosystems",
      "venue": "Advancing AI and ML Across Disciplines, Gwailor, India",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "23-Dec-25",
      "conferenceGrant": false,
      "studentPresenter": "Henit Panchal"
    }
  ],
  "HETVI HINSU": [
    {
      "title": "Intelligent Bending Parameter Optimizer",
      "venue": "National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "06-Feb-26",
      "conferenceGrant": false
    },
    {
      "title": "Generative AI as a Catalyst in Indian Education Ecosystems",
      "venue": "Advancing AI and ML Across Disciplines, Gwailor, India",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "23-Dec-25",
      "conferenceGrant": false,
      "studentPresenter": "Henit Panchal"
    }
  ],
  "HONEY MODHA": [
    {
      "title": "Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations",
      "venue": "National Scientific Conference on Emerging Trends in Multidisciplinary Research - 2025",
      "type": "Conference",
      "category": "Non-Scopus Paper Publication",
      "date": "10-Dec-25",
      "conferenceGrant": true,
      "studentPresenter": "Hemant Pande"
    }
  ],
  "JADEJA BHAGYASHREE VANRAJSINH": [],
  "JANKI CHITRODA": [
    {
      "title": "Thermalytix: Privacy-Preserving AI for Breast Cancer Screening",
      "venue": "India AI Impact Summit-2026",
      "type": "Conference",
      "category": "Case Study Publication",
      "date": "17-Feb-26",
      "conferenceGrant": true,
      "studentPresenter": "Chitroda Janki"
    }
  ],
  "JENISH SORATHIYA": [
    {
      "title": "SHAP-Enhanced Outbreak Forecasting: Interpretable Multi- Modal Learning for Waterborne Disease Prediction",
      "venue": "National Scientific Conference on Emerging Trends in Multidisciplinary Research - 2025",
      "type": "Conference",
      "category": "Non-Scopus Paper Publication",
      "date": "10-Dec-25",
      "conferenceGrant": true,
      "studentPresenter": "Krish Patel"
    }
  ],
  "KANDARP DIPAKKUMAR GAJJAR": [
    {
      "title": "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
      "venue": "International Journal of Intelligent Transportation Systems Research",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "11/03/2026 - Submitted",
      "conferenceGrant": false
    }
  ],
  "KANKSHA KEYUR BUCH": [],
  "KANSARA DEV DHARMESHKUMAR": [],
  "KANUDAWALA ZEEL PARESH": [
    {
      "title": "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
      "venue": "Multimedia Tools and Applications",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "20/02/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds",
      "venue": "International Conference on Converging Intelligence (CICON 2026)",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "nan",
      "conferenceGrant": "-"
    },
    {
      "title": "Quantum Simulation Tools: A Comprehensive Survey",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-10-2025",
      "conferenceGrant": false
    }
  ],
  "KRISHNA BHATT": [
    {
      "title": "Thermalytix: Privacy-Preserving AI for Breast Cancer Screening",
      "venue": "India AI Impact Summit-2026",
      "type": "Conference",
      "category": "Case Study Publication",
      "date": "17-Feb-26",
      "conferenceGrant": true,
      "studentPresenter": "Chitroda Janki"
    }
  ],
  "KRUTIKA VIJAYBHAI PATEL": [
    {
      "title": "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
      "venue": "International Journal of Intelligent Transportation Systems Research",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "11/03/2026 - Submitted",
      "conferenceGrant": false
    }
  ],
  "KUMAVAT YASH NENARAM": [],
  "MAHI NITINCHANDRA PARMAR": [
    {
      "title": "Ensemble Intelligence for Model Classification in Next-Generation Smart Agriculture: Crop and Soil-Based Recommendation System",
      "venue": "Pertanika Journal of Science and Technology",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "08/03/2026 - Submitted for reviewal",
      "conferenceGrant": false
    },
    {
      "title": "Tracking Air Pollution using INSAT Satellite and Ground Data Fusion",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    }
  ],
  "MIHIR PATEL": [
      {
        "title": "Intelligent Bending Parameter Optimizer",
        "venue": "National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)",
        "type": "Poster Presentation",
        "category": "Poster Presentation",
        "date": "06-Feb-26",
        "conferenceGrant": false
      }
  ],
  "NANCY RAJESH PATEL": [
    {
      "title": "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
      "venue": "International Journal of Intelligent Transportation Systems Research",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "11/03/2026 - Submitted",
      "conferenceGrant": false
    }
  ],
  "PADH CHARMI KETANKUMAR": [
    {
      "title": "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
      "venue": "Multimedia Tools and Applications",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "20/02/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Quantum Simulation Tools: A Comprehensive Survey",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-10-2025",
      "conferenceGrant": false
    },
    {
      "title": "TrafficEye: Intelligent Traffic Optimization using Deep Learning Approach",
      "venue": "2nd IEEE International Conference on Artificial Intelligence and Machine Vision",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "21/10/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Charmi Padh"
    }
  ],
  "PANCHAL HENIT SHAILESHBHAI": [
      {
        "title": "Intelligent Bending Parameter Optimizer",
        "venue": "National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)",
        "type": "Poster Presentation",
        "category": "Poster Presentation",
        "date": "06-Feb-26",
        "conferenceGrant": false
      },
      {
        "title": "Generative AI as a Catalyst in Indian Education Ecosystems",
        "venue": "Advancing AI and ML Across Disciplines, Gwailor, India",
        "type": "Conference",
        "category": "Scopus Paper Publication",
        "date": "23-Dec-25",
        "conferenceGrant": false,
        "studentPresenter": "Henit Panchal"
      }
  ],
  "PANDE HEMANT RAMESHWARKUMAR": [
    {
      "title": "Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations",
      "venue": "National Scientific Conference on Emerging Trends in Multidisciplinary Research - 2025",
      "type": "Conference",
      "category": "Non-Scopus Paper Publication",
      "date": "10-Dec-25",
      "conferenceGrant": true,
      "studentPresenter": "Hemant Pande"
    },
    {
      "title": "Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals",
      "venue": "International Conference on Converging Intelligence",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "20/03/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "21st - 22nd August 2025",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    },
    {
      "title": "Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    },
    {
      "title": "Introduction to Internet of Things",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-Oct-25",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS)",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "17/11/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    }
  ],
  "PARVA KUMAR": [
    {
      "title": "Explainable Edge Intelligence for WiFi Anomaly Detection in IoT Environments using TinyML",
      "venue": "2026 International Conference on NextGen Data Science and Analytics (ICNDSA)",
      "type": "Conference",
      "category": "Scopus Paper Acceptance",
      "date": "10-Mar-26",
      "conferenceGrant": false
    }
  ],
  "PATEL BANSHARI RAHULKUMAR": [
    {
      "title": "Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals",
      "venue": "International Conference on Converging Intelligence",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "20/03/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "21st - 22nd August 2025",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    },
    {
      "title": "Tracking Air Pollution using INSAT Satellite and Ground Data Fusion",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    },
    {
      "title": "Introduction to Internet of Things",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-Oct-25",
      "conferenceGrant": false
    },
    {
      "title": "Personalized Mood Detection Using LLMs",
      "venue": "Second International Conference On Artificial Intelligence, Computation, Communication And Network Security (AICCoNS), University of Wollongong in Dubai, UAE",
      "type": "Conference",
      "category": "Scopus Paper Acceptance",
      "date": "3rd January 2026",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS)",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "17/11/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    }
  ],
  "PATEL HENCY MUKESH": [
      {
        "title": "Intelligent Bending Parameter Optimizer",
        "venue": "National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)",
        "type": "Poster Presentation",
        "category": "Poster Presentation",
        "date": "06-Feb-26",
        "conferenceGrant": false
      },
      {
        "title": "Generative AI as a Catalyst in Indian Education Ecosystems",
        "venue": "Advancing AI and ML Across Disciplines, Gwailor, India",
        "type": "Conference",
        "category": "Scopus Paper Publication",
        "date": "23-Dec-25",
        "conferenceGrant": false,
        "studentPresenter": "Henit Panchal"
      }
  ],
  "PATEL JAINEE HASMUKHBHAI": [
    {
      "title": "Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals",
      "venue": "International Conference on Converging Intelligence",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "20/03/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "21st - 22nd August 2025",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    },
    {
      "title": "Tracking Air Pollution using INSAT Satellite and Ground Data Fusion",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    },
    {
      "title": "Introduction to Internet of Things",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-Oct-25",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS)",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "17/11/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    },
    {
      "title": "Misinformation Detection using Large Language Models with Explainability",
      "venue": "8th International Conference on Algorithms, Computing and Artificial Intelligence (ACAI 2025), Nanjing, China",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "02/03/2026 - Published",
      "conferenceGrant": false
    }
  ],
  "PATEL KRISH HIMANSHU": [
    {
      "title": "Effect of Class Imbalance and Resample on CNN Performance for Prostate Cancer Detection",
      "venue": "World Conference on Computational Science and Intelligence",
      "type": "Conference",
      "category": "Non-Scopus Paper Accepted",
      "date": "19-Nov-25",
      "conferenceGrant": true,
      "studentPresenter": "Krish Patel"
    },
    {
      "title": "SHAP-Enhanced Outbreak Forecasting: Interpretable Multi- Modal Learning for Waterborne Disease Prediction",
      "venue": "National Scientific Conference on Emerging Trends in Multidisciplinary Research - 2025",
      "type": "Conference",
      "category": "Non-Scopus Paper Publication",
      "date": "10-Dec-25",
      "conferenceGrant": true,
      "studentPresenter": "Krish Patel"
    },
    {
      "title": "Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals",
      "venue": "International Conference on Converging Intelligence",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "20/03/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "21st - 22nd August 2025",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    },
    {
      "title": "Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    },
    {
      "title": "Introduction to Internet of Things",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-Oct-25",
      "conferenceGrant": false
    },
    {
      "title": "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
      "venue": "2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS)",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "17/11/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Banshari Patel"
    }
  ],
  "PRAGATI VARU": [],
  "PREM RAICHURA": [
    {
      "title": "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
      "venue": "Multimedia Tools and Applications",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "20/02/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "TrafficEye: Intelligent Traffic Optimization using Deep Learning Approach",
      "venue": "2nd IEEE International Conference on Artificial Intelligence and Machine Vision",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "21/10/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Charmi Padh"
    }
  ],
  "RIDHAM PATEL": [
    {
      "title": "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
      "venue": "International Journal of Intelligent Transportation Systems Research",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "11/03/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning",
      "venue": "National Poster Competition on AI-Powered Research and Innovation",
      "type": "Poster Presentation",
      "category": "Poster Presentation",
      "date": "19th - 20th September",
      "conferenceGrant": false
    }
  ],
  "ROHAN THAKAR": [
    {
      "title": "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
      "venue": "Multimedia Tools and Applications",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "20/02/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds",
      "venue": "International Conference on Converging Intelligence (CICON 2026)",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "nan",
      "conferenceGrant": "-"
    },
    {
      "title": "Quantum Simulation Tools: A Comprehensive Survey",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-10-2025",
      "conferenceGrant": false
    },
    {
      "title": "TrafficEye: Intelligent Traffic Optimization using Deep Learning Approach",
      "venue": "2nd IEEE International Conference on Artificial Intelligence and Machine Vision",
      "type": "Conference",
      "category": "Scopus Paper Publication",
      "date": "21/10/2025 - Published",
      "conferenceGrant": true,
      "studentPresenter": "Charmi Padh"
    }
  ],
  "RUDR JAYESHKUMAR HALVADIYA": [],
  "YAJURSHI VELANI": [],
  "ZENISHA DEVANI": [
    {
      "title": "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
      "venue": "Multimedia Tools and Applications",
      "type": "Journal",
      "category": "Paper under Review",
      "date": "20/02/2026 - Submitted",
      "conferenceGrant": false
    },
    {
      "title": "ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds",
      "venue": "International Conference on Converging Intelligence (CICON 2026)",
      "type": "Conference",
      "category": "Paper under Review",
      "date": "nan",
      "conferenceGrant": "-"
    },
    {
      "title": "Quantum Simulation Tools: A Comprehensive Survey",
      "venue": "Contemporary Research in Mathematics from India",
      "type": "Book",
      "category": "Scopus Book Chapter Accepted",
      "date": "28-10-2025",
      "conferenceGrant": false
    }
  ]
};

const studentsFilePath = path.join(__dirname, 'srlStudents.json');
const studentsData = JSON.parse(fs.readFileSync(studentsFilePath, 'utf8'));

const nameOverrides = {
    "Yashvi Chavda": "CHAVADA YASHVI SURENDRASINH"
};

let updatedCount = 0;
const updatedStudents = studentsData.map(student => {
  let name = student.student_name;
  if (nameOverrides[name]) {
      name = nameOverrides[name];
  }
  name = name.toUpperCase();
  
  // Improved matching logic:
  // 1. Exact match (case insensitive)
  // 2. Both first and last name match (case insensitive)
  let matchName = Object.keys(publicationsData).find(key => {
      const k = key.toUpperCase();
      const n = name.toUpperCase();
      if (k === n) return true;
      
      const kParts = k.split(' ').filter(p => p.length > 2); // ignore short parts like initials
      const nParts = n.split(' ').filter(p => p.length > 2);
      
      // Check if the most important parts (usually first and last) match
      // For example, "RUDR JAYESHKUMAR HALVADIYA" and "RUDR HALVADIYA"
      // "RUDR" and "HALVADIYA" are in both.
      // Lenient matching: check if any 2 significant words match
      const common = kParts.filter(p => {
          // Check for exact match or very similar (e.g. CHAVADA and CHAVDA)
          return nParts.some(np => np.includes(p) || p.includes(np));
      });
      if (common.length >= 2) return true;

      return false;
  });

  if (matchName) {
    const newPubs = publicationsData[matchName];
    if (newPubs && newPubs.length > 0) {
        // Merge publications based on title to avoid duplicates
        const existingPubs = student.srlPublications || [];
        const mergedMap = new Map();
        
        existingPubs.forEach(p => mergedMap.set(`${p.title.trim().toLowerCase()}-${(p.venue || p.event || "").trim().toLowerCase()}`, p));
        newPubs.forEach(p => mergedMap.set(`${p.title.trim().toLowerCase()}-${(p.venue || p.event || p['Event/Journal'] || "").trim().toLowerCase()}`, p));
        
        student.srlPublications = Array.from(mergedMap.values());
        updatedCount++;
        console.log(`Updated publications for: ${student.student_name} (Merged ${newPubs.length} new entries)`);
    }
  } else {
    console.log(`MISSING: No publications matched for: ${student.student_name}`);
  }
  return student;
});

fs.writeFileSync(studentsFilePath, JSON.stringify(updatedStudents, null, 4));
console.log(`Successfully updated ${updatedCount} students.`);
