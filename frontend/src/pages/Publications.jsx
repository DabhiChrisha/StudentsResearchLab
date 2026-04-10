<<<<<<< Updated upstream
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ExternalLink, Download, Search, Users, ShieldCheck, FileText, Bookmark, PlusCircle, X, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
=======
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Download,
  Search,
  Users,
  ShieldCheck,
  FileText,
  Bookmark,
  PlusCircle,
  X,
  Code,
  Layers,
  Award,
  ArrowRight,
  TrendingUp,
  Cpu,
  Globe,
  Database
} from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import studentsData from "../data/srlStudents.json";
>>>>>>> Stashed changes

/* ================= DATA ================= */
const publicationsData = [
  {
    id: 1,
    title: "Casebook on AI and Gender Empowerment",
    authors: ["Janki Chitroda", "Yashvi Chavda", "Krishna Bhatt"],
    venue: "IndiaAI Impact Summit in collaboration with UN Women India",
    date: "Feb 2026",
    category: "Book Chapter",
    description: "Featured among the prestigious 23 global research works published in the Casebook on AI and Gender Empowerment. The research focuses on inclusive AI innovation and empowerment.",
    link: "https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429466085311098880-XDnV",
    tags: ["AI", "Gender Empowerment", "UN Women"],
    publishers: [{name: "UN Women", logo: "/UN%20Women.png"}, {name: "MeitY", logo: "/MeitY.png"}],
  },
  {
    id: 2,
    title: "EfficientNetB3 Adapted Hybrid UNet with Attention Guided Decoding for Urban Scene Segmentation",
    authors: ["Ayushi Joddha", "Manasvi Shah", "Swayam Kalburgi"],
    venue: "13th IEEE International Conference on Intelligent Systems and Embedded Design (ISED 2025)",
    date: "Dec 2025",
    category: "Conference",
    description: "This paper proposes a novel adapted hybrid UNet using EfficientNetB3 to perform robust urban scene segmentation by selectively attending to salient spatial features.",
    link: "https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7413814908217344000-JmvS",
    tags: ["Computer Vision", "Segmentation", "IEEE Xplore"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    useContainBackground: true,
  },
  {
    id: 3,
    title: "Improving Urban Road Safety: Enhancing Pedestrian Safety Through Automated Traffic Signal Control and Law Enforcement",
    authors: ["Students Research Lab"],
    venue: "International Conference on Data Science, Computation and Security 2024 (Springer LNNS)",
    date: "Nov 2024",
    category: "Book Chapter",
    description: "Proposed automated mechanisms using edge computing architectures integrated with urban traffic signal networks to improve pedestrian safety conditions and automate crosswalk law enforcement.",
    link: "https://www.linkedin.com/posts/mmpsrpc_springer-researchpublication-datascience-activity-7368163507625746434-vjXc",
    tags: ["Smart City", "Edge Computing", "Springer"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
    useContainBackground: true,
  },
  {
    id: 4,
    title: "Filed for Complete Patent",
    authors: ["Nancy Patel", "Kandarp Gajjar", "Patel Ridham", "Patel Krutika"],
    venue: "Status: Ongoing",
    date: "Mar 2026",
    category: "Patents",
    description: "",
    link: "#",
    tags: [],
    status: "Ongoing",
    inventors: ["Nancy Patel", "Kandarp Gajjar", "Patel Ridham", "Patel Krutika"],
    logoInfo: "/ksv.png",
    supportedBy: [{name: "KSV", logo: "/ksv.png"}, {name: "MMPSRPC", logo: "/mm.png"}],
    ipo: {name: "IPO", logo: "/IPO.jpeg"},
    backgroundImage: "/patent.jpeg",
    useContainBackground: true
  },
  {
    id: 5,
    title: "Misinformation Detection using Large Language Models with Explainability",
    authors: ["Jainee Patel", "Dr. Chintan M. Bhatt", "Dr. Himani Trivedi", "Dr. Thanh Thi Nguyen"],
    venue: "8th International Conference on Algorithms, Computing and Artificial Intelligence (ACAI 2025), Nanjing, China",
    date: "Mar 2026",
    category: "Conference",
    description: "Proposes a novel approach for detecting misinformation using Large Language Models with explainability techniques. The research integrates advanced NLP and XAI methods to enhance the transparency and reliability of misinformation detection systems.",
    link: "https://ieeexplore.ieee.org/document/11406235",
    tags: ["LLM", "Misinformation Detection", "XAI", "Scopus"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
  },
  {
    id: 6,
    title: "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI",
    authors: ["Banshari Patel", "Jainee Patel", "Krish Patel", "Hemant Pande", "Dr. Himani Trivedi"],
    venue: "2025 Artificial Intelligence and Smart Technologies for Sustainability Conference (AISTS 2025)",
    date: "Nov 2025",
    category: "Conference",
    description: "An empirical study evaluating how Explainable AI interfaces shape human decision-making processes, cognitive dependency, and productivity in complex task environments.",
    link: "https://ieeexplore.ieee.org/document/11232740",
    tags: ["XAI", "Cognitive Computing", "Human-AI Interaction", "Scopus"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    backgroundImage: "/poster.png",
    useContainBackground: true,
  },
  {
    id: 7,
    title: "From Theory to Practice a Survey and Case Based Analysis of Face Swapping Deepfake Detection Models",
    authors: ["Charmi Padh", "Prem Raichura", "Rohan Thakar", "Zenisha Devani", "Swayam Kalburgi", "Zeel Kanudawala", "Dr. Chintan M. Bhatt", "Dr. Himani Trivedi"],
    venue: "Multimedia Tools and Applications",
    date: "Feb 2026",
    category: "Journal",
    description: "A comprehensive survey and case-based analysis of deepfake detection models, focusing on face-swapping techniques. The paper provides theoretical foundations and practical implementations for detecting fraudulent video content.",
    link: "https://ieeexplore.ieee.org/document/11203522",
    tags: ["Deepfake Detection", "Face Swapping", "Computer Vision", "Under Review"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    status: "Paper under Review",
  },
  {
    id: 8,
    title: "Early Epileptic Seizure Diagnosis Through Dilated Temporal Convolutional Networks on CHB-MIT Scalp EEG Signals",
    authors: ["Hemant Pande", "Jainee Patel", "Banshari Patel", "Krish Patel", "Dr. Himani Trivedi"],
    venue: "International Conference on Converging Intelligence (CICON 2026)",
    date: "Mar 2026",
    category: "Conference",
    description: "Develops an advanced deep learning approach using dilated temporal convolutional networks to enable early diagnosis of epileptic seizures from scalp EEG signals. The model shows significant improvements in sensitivity and specificity.",
    link: "https://drive.google.com/file/d/1mt1ZA1hYJpLCNmESQ2U5h7xN9GXRoVAD/view",
    tags: ["Healthcare", "EEG Analysis", "Deep Learning", "Under Review"],
    publishers: [{name: "NASCENT MR", logo: "/Vmrfsalem.png"}],
    status: "Paper under Review",
    backgroundImage: "/book.png",
    useContainBackground: true,
  },
  {
    id: 9,
    title: "Tracking Air Pollution using INSAT Satellite and Ground Data Fusion",
    authors: ["Jainee Patel", "Banshari Patel", "Mahi Parmar"],
    venue: "National Poster Competition on AI-Powered Research and Innovation",
    date: "Sep 2025",
    category: "Poster Presentation",
    description: "An innovative approach to track and monitor air pollution levels by fusing satellite data from INSAT with ground-based sensors. The system provides real-time air quality assessment and predictive modeling.",
    link: "https://drive.google.com/file/d/1Y4EJwUSobWPPwendmO7oJZY80-hAV86t/view",
    tags: ["Environmental Monitoring", "Satellite Data", "Data Fusion", "Poster"],
    publishers: [{name: "National Poster Competition", logo: "/poster.png"}],
  },
  {
    id: 10,
    title: "Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI - Poster Presentation",
    authors: ["Banshari Patel", "Jainee Patel", "Krish Patel", "Hemant Pande", "Dr. Himani Trivedi"],
    venue: "IGNITE 2.0 flagship event of IEEE SPS GS organized during AISTS 2025",
    date: "Aug 2025",
    category: "Poster Presentation",
    description: "Poster presentation showcasing empirical findings on how AI interfaces influence human cognitive processes, learning outcomes, and professional productivity in diverse work environments.",
    link: "https://drive.google.com/file/d/1YMtYf9HSIDIvpjz3GuK5YU6dlKatYAta/view",
    tags: ["XAI", "Cognitive Skills", "Human-AI Interaction", "IEEE", "Poster"],
    publishers: [{name: "IEEE SPS", logo: "/IEEE.png"}],
  },
  {
    id: 11,
    title: "Fed-DETR: A Privacy-Preserving Framework for K-Means Driven Decentralised Helmet Surveillance of Two-Wheeler Riders",
    authors: ["Kandarp Gajjar", "Nancy Patel", "Ridham Patel", "Krutika Patel", "Chrisha Dabhi", "Himani Trivedi", "Mahesh Goyani", "Chintan Bhatt"],
    venue: "International Journal of Intelligent Transportation Systems Research",
    date: "Mar 2026",
    category: "Journal",
    description: "Proposes a federated learning-based framework for decentralized helmet detection and surveillance. The approach prioritizes privacy while maintaining accuracy in detecting traffic safety compliance.",
    link: "https://ieeexplore.ieee.org/document/11203360",
    tags: ["Federated Learning", "Computer Vision", "IoT", "Safe Driving", "Under Review"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    status: "Paper under Review",
  },
  {
    id: 12,
    title: "Bridging the Disconnect: Holistic Student Dropout Analysis in Schools through Data-Driven Machine Learning",
    authors: ["Hemant Pande", "Ridham Patel", "Krish Patel", "Chrisha Dabhi", "Dr. Himani Trivedi"],
    venue: "National Poster Competition on AI-Powered Research and Innovation",
    date: "Sep 2025",
    category: "Poster Presentation",
    description: "Applies advanced machine learning algorithms to analyze and predict student dropout patterns. The research integrates demographic, academic, and socioeconomic data for comprehensive intervention strategies.",
    link: "https://ieeexplore.ieee.org/document/11203360",
    tags: ["Education Analytics", "Machine Learning", "Student Success", "Poster"],
    publishers: [{name: "NASCENT MR", logo: "/Vmrfsalem.png"}],
  },
  {
    id: 13,
    title: "Fusing Retrieval Techniques for Enhanced Personalized Community Question Answering",
    authors: ["Students Research Lab"],
    venue: "CEUR Workshop Series",
    date: "2026",
    category: "Conference",
    description: "Develops an intelligent system that fuses multiple retrieval techniques to provide personalized, context-aware answers in community question answering platforms. The approach enhances user experience through semantic understanding.",
    link: "https://ceur-ws.org/Vol-4054/T5-2.pdf",
    tags: ["NLP", "Information Retrieval", "QA Systems", "Machine Learning"],
    publishers: [{name: "CEUR WS", logo: "/ceur.png"}],
    backgroundImage: "/papers.png",
    useContainBackground: true,
  },  
  {
    id: 14,
    title: "Quantum Simulation Tools: A Comprehensive Survey",
    authors: ["Zenisha Devani", "Rohan Thakar", "Zeel Kanudawala", "Charmi Padh", "Dr. Himani Trivedi"],
    venue: "Contemporary Research in Mathematics from India",
    date: "Oct 2025",
    category: "Book Chapter",
    description: "A comprehensive survey of quantum simulation tools and frameworks, covering theoretical foundations and practical applications. The chapter explores advanced computational techniques for quantum system modeling.",
    link: "https://ieeexplore.ieee.org/document/10543438",
    tags: ["Quantum Computing", "Simulation Tools", "Mathematics", "Scopus"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
    status: "Scopus Book Chapter Accepted",
  },
  {
    id: 15,
    title: "TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach",
    authors: ["Zalak Vachhani", "Charmi Padh", "Prem Raichura", "Rohan Thakar", "Dr. Himani Trivedi"],
    venue: "2nd IEEE International Conference on Artificial Intelligence and Machine Vision (AIMV 2025)",
    date: "Oct 2025",
    category: "Conference",
    description: "A deep learning framework to optimize traffic flow operations dynamically. The system detects congestion points and intelligently redirects vehicle flows to minimize latency and reduce environmental impact.",
    link: "https://link.springer.com/chapter/10.1007/978-3-032-10756-5_12",
    tags: ["Deep Learning", "Smart City", "IoT", "Scopus"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    status: "Scopus Paper Publication",
    useContainBackground: true,
  },
  {
    id: 16,
    title: "Thermalytix: Privacy-Preserving AI for Breast Cancer Screening",
    authors: ["Chitroda Janki", "Chavada Yashvikuvarba", "Bhatt Krishna"],
    venue: "India AI Impact Summit-2026",
    date: "Feb 2026",
    category: "Conference",
    description: "An innovative privacy-preserving AI system for breast cancer screening that leverages federated learning and differential privacy. The approach maintains patient confidentiality while enabling accurate diagnosis.",
    link: "https://ieeexplore.ieee.org/document/10425861",
    tags: ["Healthcare", "Breast Cancer", "Privacy", "AI", "Case Study"],
    publishers: [{name: "India AI Impact Summit", logo: "/aiimpact.png"}],
    status: "Case Study Publication",
  },
  {
    id: 17,
    title: "Generative AI as a Catalyst in Indian Education Ecosystems",
    authors: ["Henit Panchal", "Hetvi Hinsu", "Heny Patel", "Dr. Shivani Trivedi", "Dr. Himani Trivedi"],
    venue: "Advancing AI and ML Across Disciplines (AAMLAD 2025), Gwailor, India",
    date: "Dec 2025",
    category: "Conference",
    description: "An analysis of how generative AI paradigms can be adopted to personalize learning paths, scale assessment models, and bridge educational disparities in India.",
    link: "https://link.springer.com/chapter/10.1007/978-981-96-4880-1_29#:~:text=A%20dynamic%20signal%20control%20system,augmenting%20road%20safety%20and%20compliance.",
    tags: ["Generative AI", "EdTech", "India", "Education", "Scopus"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
    status: "Scopus Paper Publication",
    useContainBackground: true,
  },
  {
    id: 18,
    title: "Ensemble Intelligence for Model Classification in Next-Generation Smart Agriculture: Crop and Soil-Based Recommendation System",
    authors: ["Dr. Himani Trivedi", "Hetal Chauhan", "Suresh Patel", "Mahendra N Patel", "Pradip Patel", "Mahi Parmar", "Chrisha Dabhi"],
    venue: "Pertanika Journal of Science and Technology",
    date: "Mar 2026",
    category: "Journal",
    description: "Develops an ensemble learning system for intelligent crop and soil classification in precision agriculture. The model integrates multiple AI techniques to provide actionable recommendations for farmers.",
    link: "https://link.springer.com/chapter/10.1007/978-3-032-10670-4_17",
    tags: ["Precision Agriculture", "Machine Learning", "Ensemble Methods", "IoT", "Under Review"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
    status: "Paper under Review",
    useContainBackground: true,
  },
  {
    id: 19,
    title: "ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds",
    authors: ["Rohan Thakar", "Zenisha Devani", "Zeel Kanudawala", "Dr. Himani Trivedi"],
    venue: "International Conference on Converging Intelligence (CICON 2026)",
    date: "2026",
    category: "Conference",
    description: "Proposes a zero-trust security architecture specifically designed for multi-tenant cloud environments. The framework ensures continuous verification and minimizes security risks in shared cloud infrastructure.",
    link: "https://ieeexplore.ieee.org/abstract/document/11405024",
    tags: ["Cybersecurity", "Cloud Computing", "Zero Trust", "Architecture", "Under Review"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    status: "Paper under Review",
  },
  {
    id: 20,
    title: "SHAP-Enhanced Outbreak Forecasting: Interpretable Multi-Modal Learning for Waterborne Disease Prediction",
    authors: ["Krish Patel", "Jenish Sorathiya", "Dr. Himani Trivedi"],
    venue: "National Scientific Conference on Emerging Trends in Multidisciplinary Research (NASCENT MR 2025)",
    date: "Dec 2025",
    category: "Conference",
    description: "Utilizes interpretable multi-modal learning approaches enhanced with SHAP values for explaining and predicting waterborne disease outbreak probabilities with high precision.",
    link: "https://ieeexplore.ieee.org/document/11203360",
    tags: ["Healthcare", "XAI", "Disease Forecasting", "Multi-Modal Learning"],
    publishers: [{name: "NASCENT MR", logo: "/Vmrfsalem.png"}],
    status: "Non-Scopus Paper Publication",
  },
  {
    id: 21,
    title: "Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations",
    authors: ["Hemant Pande", "Honey Modha", "Dr. Himani Trivedi"],
    venue: "National Scientific Conference on Emerging Trends in Multidisciplinary Research (NASCENT MR 2025)",
    date: "Dec 2025",
    category: "Conference",
    description: "Focuses on advanced data mining strategies to uncover hidden health risk variables from unstructured clinical datasets representing underserved demographics.",
    link: "https://www.inderscienceonline.com/doi/abs/10.1504/IJCVR.2025.147513",
    tags: ["Data Mining", "Healthcare", "Analytics", "Health Equity"],
    publishers: [{name: "NASCENT MR", logo: "/Vmrfsalem.png"}],
    status: "Non-Scopus Paper Publication",
  },
  {
    id: 22,
    title: "Introduction to Internet of Things",
    authors: ["Hemant Pande", "Jainee Patel", "Banshari Patel", "Krish Patel", "Dr. Himani Trivedi"],
    venue: "Contemporary Research in Mathematics from India",
    date: "Oct 2025",
    category: "Book Chapter",
    description: "A comprehensive introduction to Internet of Things architectures, protocols, and applications. The chapter covers fundamental concepts and practical implementations in modern IoT systems.",
    link: "https://link.springer.com/chapter/10.1007/978-3-032-10940-8_29",
    tags: ["IoT", "Networking", "Smart Systems", "Scopus"],
    publishers: [{name: "Springer", logo: "/springer.png"}],
    status: "Scopus Book Chapter Accepted",
  },
  {
    id: 23,
    title: "Intelligent Bending Parameter Optimizer",
    authors: ["Henit Panchal", "Hetvi Hinsu", "Mihir Patel", "Heny Patel", "Dr. Himani Trivedi", "Prof. Parth Patel"],
    venue: "National-level 3rd Project Advisor Group (PAG) Meeting of the DST–Technology Enabling Centre (DST-TEC)",
    date: "Feb 2026",
    category: "Poster Presentation",
    description: "An advanced optimization system for manufacturing processes that intelligently adjusts bending parameters. The system uses ML to improve precision and reduce material waste in industrial production.",
    link: "https://ieeexplore.ieee.org/document/11212073",
    tags: ["Manufacturing", "Optimization", "Machine Learning", "Poster"],
    publishers: [{name: "DST-TEC", logo: "/dst.png"}],
    status: "Poster Presentation",
  },
  {
    id: 24,
    title: "Effect of Class Imbalance and Resample on CNN Performance for Prostate Cancer Detection",
    authors: ["Krish Patel", "Dr. Amit Thakkar", "Dr. Himani Trivedi"],
    venue: "World Conference on Computational Science and Intelligence",
    date: "Nov 2025",
    category: "Conference",
    description: "Analyzes the impact of class imbalance in medical imaging datasets and evaluates resampling techniques for improving CNN performance in prostate cancer detection.",
    link: "https://expo.74ipc.com/posters",
    tags: ["Healthcare", "Deep Learning", "Medical Imaging", "Class Imbalance"],
    publishers: [{name: "World Conference on CS", logo: "/wcci.png"}],
    status: "Non-Scopus Paper Accepted",
    backgroundImage: "/poster.png",
    useContainBackground: true,
  },
  {
    id: 25,
    title: "Personalized Mood Detection Using LLMs",
    authors: ["Banshari Patel", "Chintan Bhatt", "Himani Trivedi", "Alessandro Bruno", "Pier Luigi Mazzeo"],
    venue: "Second International Conference On Artificial Intelligence, Computation, Communication And Network Security (AICCoNS), University of Wollongong in Dubai, UAE",
    date: "Jan 2026",
    category: "Conference",
    description: "Develops an intelligent system using Large Language Models to detect and analyze human emotions from textual communication. The approach enables personalized mental health monitoring and support.",
    link: "https://journals.lww.com/jcor/fulltext/2025/07000/association_of_socioeconomic_factors_and_body_mass.13.aspx",
    tags: ["LLM", "Emotion Detection", "Psychology", "AI", "Scopus"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    status: "Scopus Index Paper Accepted",
  },
  {
    id: 26,
    title: "Explainable Edge Intelligence for WiFi Anomaly Detection in IoT Environments using TinyML",
    authors: ["Parva Kumar", "Krenil Radadiya", "Trupesh Patel", "Radhika Wala"],
    venue: "2026 International Conference on NextGen Data Science and Analytics (ICNDSA)",
    date: "Mar 2026",
    category: "Conference",
    description: "An innovative approach combining edge computing, lightweight machine learning, and explainability techniques for detecting WiFi anomalies in IoT networks. The system operates efficiently on resource-constrained devices.",
    link: "https://ieeexplore.ieee.org/document/11438568",
    tags: ["IoT", "Edge Computing", "TinyML", "Anomaly Detection", "XAI", "Scopus"],
    publishers: [{name: "IEEE Xplore", logo: "/Xplore.png"}],
    status: "Scopus Paper Acceptance",
  },
];

<<<<<<< Updated upstream
const categories = ["All", "Conference", "Journal", "Book Chapter", "Poster Presentation", "Patents"];

=======
const CATEGORIES = ["All", "Conference", "Journal", "Book Chapter", "Poster Presentation"];

const EVENT_TYPE_LABEL = {
  Conference: "Conference",
  Journal: "Journal",
  Book: "Book Chapter",
  "Poster Presentation": "Poster",
};
>>>>>>> Stashed changes

/* ================= COMPONENTS ================= */

const PublicationCard = ({ pub, index, exportToExcel }) => {
  const [linkedinImage, setLinkedinImage] = useState(null);

<<<<<<< Updated upstream
  // Premium green theme gradients
  const backgrounds = [
    "from-teal-500 to-teal-600",
    "from-green-500 to-green-600",
    "from-emerald-500 to-emerald-600",
    "from-cyan-500 to-teal-500",
    "from-teal-400 to-green-500",
    "from-green-600 to-emerald-700",
    "from-teal-600 to-cyan-600",
    "from-emerald-400 to-teal-500",
  ];

  const bgClass = backgrounds[index % backgrounds.length];

  // Dark border colors matching theme
  const borderColors = [
    "border-teal-800",
    "border-green-800",
    "border-emerald-800",
    "border-cyan-800",
    "border-teal-800",
    "border-green-900",
    "border-teal-900",
    "border-emerald-900",
  ];

  const borderColor = borderColors[index % borderColors.length];

  // Varying card heights for visual interest - tall and thin
  const cardHeights = [
    "min-h-[260px]",
    "min-h-[240px]",
    "min-h-[230px]",
    "min-h-[270px]",
    "min-h-[250px]",
    "min-h-[235px]",
    "min-h-[260px]",
    "min-h-[245px]",
    "min-h-[240px]",
    "min-h-[250px]",
    "min-h-[235px]",
    "min-h-[260px]",
  ];

  const cardHeight = cardHeights[index % cardHeights.length];

  // Map background class to explicit gradient colors for fallback
  const gradientColorMap = {
    "from-teal-500 to-teal-600": "linear-gradient(to bottom right, #14b8a6, #0d9488)",
    "from-green-500 to-green-600": "linear-gradient(to bottom right, #22c55e, #16a34a)",
    "from-emerald-500 to-emerald-600": "linear-gradient(to bottom right, #10b981, #059669)",
    "from-cyan-500 to-teal-500": "linear-gradient(to bottom right, #06b6d4, #14b8a6)",
    "from-teal-400 to-green-500": "linear-gradient(to bottom right, #2dd4bf, #22c55e)",
    "from-green-600 to-emerald-700": "linear-gradient(to bottom right, #16a34a, #047857)",
    "from-teal-600 to-cyan-600": "linear-gradient(to bottom right, #0d9488, #0891b2)",
    "from-emerald-400 to-teal-500": "linear-gradient(to bottom right, #4ade80, #14b8a6)",
  };

  const fallbackGradient = gradientColorMap[bgClass] || "linear-gradient(to bottom right, #14b8a6, #0d9488)";

  // Fetch preview image from link with enhanced parameters and multiple sources
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchImage = async () => {
      // Check if publication has custom background image - use it with highest priority
      if (pub.backgroundImage) {
        setLinkedinImage(pub.backgroundImage);
        return;
      }

      if (!pub.link || !pub.link.startsWith("http")) return;

      // Primary attempts with microlink API
      const primaryAttempts = [
        `https://api.microlink.io?url=${encodeURIComponent(pub.link)}&screenshot=true&fullpage=false&viewport.width=1200&viewport.height=630`,
        `https://api.microlink.io?url=${encodeURIComponent(pub.link)}&screenshot=true&page=1`,
        `https://api.microlink.io?url=${encodeURIComponent(pub.link)}`,
      ];

      // Try primary attempts
      for (const microlinkUrl of primaryAttempts) {
        try {
          const response = await fetch(microlinkUrl, { 
            signal: abortController.signal,
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Try multiple image sources in order
            if (data.data?.image?.url && data.data.image.url.length > 0) {
              setLinkedinImage(data.data.image.url);
              return;
            } else if (data.data?.screenshot?.url && data.data.screenshot.url.length > 0) {
              setLinkedinImage(data.data.screenshot.url);
              return;
            } else if (data.data?.logo?.url && data.data.logo.url.length > 0) {
              setLinkedinImage(data.data.logo.url);
              return;
            }
          }
        } catch (err) {
          // Continue to next attempt
          continue;
        }
      }

      // Secondary fallback: try URL2PNG service
      try {
        const screenshotUrl = `https://v1.screenshot.11ty.dev/${encodeURIComponent(pub.link)}/opengraph/`;
        const response = await fetch(screenshotUrl, { 
          signal: abortController.signal,
        });
        
        if (response.ok) {
          setLinkedinImage(screenshotUrl);
          return;
        }
      } catch (err) {
        // Continue
      }

      // Tertiary fallback: try thum.io
      try {
        const thumbUrl = `https://image.thum.io/get/width/1200/height/630/crop/smart/${encodeURIComponent(pub.link)}`;
        const headResponse = await fetch(thumbUrl, { 
          method: 'HEAD',
          signal: abortController.signal,
        });
        
        if (headResponse.ok) {
          setLinkedinImage(thumbUrl);
          return;
        }
      } catch (err) {
        // Continue
      }

      // Final fallback: try open graph meta tags
      try {
        const ogResponse = await fetch(pub.link, { 
          signal: abortController.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (ogResponse.ok) {
          const html = await ogResponse.text();
          // Try multiple OG tag formats
          const ogMatches = [
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/),
            html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/),
            html.match(/<meta\s+property=["']twitter:image["']\s+content=["']([^"']+)["']/),
          ];
          
          for (const match of ogMatches) {
            if (match && match[1] && match[1].length > 0) {
              setLinkedinImage(match[1]);
              return;
            }
          }
        }
      } catch (err) {
        // Fallback to gradient - will be shown automatically
      }

      // If all attempts fail, the fallbackGradient will be visible
    };

    // Set a timeout to ensure we don't wait forever
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 8000);

    fetchImage().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [pub.link]);

  // Get the clickable link for the card header
  const getHeaderLink = () => {
    const link = pub.link || "";
    if (link.startsWith("http")) {
      return link;
    }
    return "#";
  };

  const headerLink = getHeaderLink();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${cardHeight} hover:rotate-0 hover:translate-y-0 transition-all duration-500`}
    >
      {/* OUTER CARD WITH THICK BORDER - BIG CARD */}
      <div className={`h-full relative rounded-2xl sm:rounded-3xl overflow-visible shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border-5 sm:border-6 md:border-8 ${borderColor}`}
        style={{
          background: fallbackGradient,
        }}
      >

        {/* TOP GRADIENT SECTION WITH BACKGROUND IMAGE - CLICKABLE */}
        <a 
          href={headerLink}
          target={headerLink !== "#" ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`relative p-4 sm:p-5 md:p-6 flex-none min-h-32 sm:min-h-40 md:min-h-44 flex flex-col justify-between rounded-t-lg overflow-hidden ${headerLink !== "#" ? 'cursor-pointer hover:opacity-90' : 'cursor-default'} transition-opacity duration-300`}
          style={{
            // Green/teal gradient as background
            background: fallbackGradient,
            // Show image on top
            ...(linkedinImage && {
              backgroundImage: `url('${linkedinImage}')`,
              backgroundSize: pub.useContainBackground ? "contain" : (pub.link && pub.link.includes('ieeexplore') ? "cover" : "75%"),
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }),
          }}
        >
          {/* Green gradient shows behind and around the image */}

          {/* Badges - positioned absolutely to appear above image */}
          <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 z-20">
            <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-700 text-xs sm:text-sm font-bold shadow-md backdrop-blur-sm">
              {pub.category}
            </div>
          </div>

          <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 right-4 sm:right-5 md:right-6 z-20">
            <div className="px-3 py-1.5 rounded-full bg-white/95 text-slate-700 text-xs sm:text-sm font-medium shadow-md flex items-center gap-1.5 backdrop-blur-sm">
              <Calendar size={14} />
              {pub.date}
            </div>
          </div>
        </a>

        {/* SMALL INNER CARD - White content card with SIMPLIFIED design */}
        <div className="flex-1 p-1.5 sm:p-2 md:p-3 flex items-center justify-center">
          <div className="w-full h-full bg-white/95 rounded-lg sm:rounded-xl border-2 sm:border-3 border-slate-200 shadow-md p-2.5 sm:p-3 md:p-4 flex flex-col overflow-y-auto">
            {/* Inner Card Content */}
            <>
              {/* Title */}
              <h3 className="text-sm sm:text-base md:text-base font-bold font-serif text-slate-900 mb-1.5 line-clamp-2 leading-tight">
                {pub.title}
              </h3>

              {/* Authors section */}
              <div className="mb-1.5 text-xs sm:text-sm font-bold text-white bg-teal-600 px-2 py-0.5 rounded leading-snug">
                <span>Authors: {pub.authors.join(", ")}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 mb-1.5 line-clamp-2 leading-relaxed">
                {pub.description}
              </p>

              {/* Published in - italicized */}
              <div className="mb-1.5 text-xs sm:text-sm text-slate-600 leading-snug italic font-normal">
                Published in: {pub.venue}
              </div>

              {/* Tags */}
              <div className="mb-1.5 flex flex-wrap gap-1">
                {pub.tags.map((tag, i) => (
                  <span key={i} className="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </>

            {/* Footer with Action Buttons and Publisher */}
            <div className="mt-auto pt-1.5 sm:pt-2 border-t border-slate-200 flex flex-col gap-1.5">
              {/* Action Button - Link to Paper or By: for Patents */}
              <div className="flex justify-between items-center">
                {pub.category === "Patents" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">By:</span>
                    {pub.ipo && (
                      <img 
                        src={pub.ipo.logo} 
                        alt={pub.ipo.name}
                        className="h-8 object-contain"
                        title={pub.ipo.name}
                      />
                    )}
                  </div>
                ) : pub.link && pub.link.startsWith("http") ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <FileDown size={14} />
                    Paper
                  </a>
                ) : pub.link ? (
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <FileDown size={14} />
                    Paper
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400">
                    <FileDown size={14} />
                    Not Available
                  </span>
                )}
              </div>

              {/* Publisher Section - Not shown for Poster Presentations */}
              {pub.category !== "Poster Presentation" && pub.publishers && pub.publishers.length > 0 && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">Publisher:</span>
                  <div className="flex gap-1.5 items-center">
                    {pub.publishers.map((publisherItem, idx) => (
                      <img 
                        key={idx} 
                        src={publisherItem.logo} 
                        alt={publisherItem.name} 
                        className={`object-contain ${publisherItem.name === "Springer" ? "h-6" : publisherItem.name === "NASCENT MR" ? "h-14" : "h-6"}`}
                        title={publisherItem.name} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SOLID BAR */}
        <div className={`h-5 sm:h-6 md:h-7 bg-gradient-to-r ${bgClass} shadow-sm rounded-b-lg`}></div>
=======
function formatDate(raw) {
  if (!raw) return null;
  const m = raw.match(/\b(20\d{2})\b/);
  if (m) return m[1];
  return raw;
}

/* ================= COMPONENTS ================= */

const TabButton = ({ active, label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-8 py-4 flex items-center gap-3 transition-all duration-500 overflow-hidden ${
      active ? "text-white" : "text-slate-500 hover:text-slate-800"
    }`}
  >
    {active && (
      <motion.div
        layoutId="tab-bg"
        className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 shadow-xl shadow-teal-600/20 z-0"
      />
    )}
    <Icon size={18} className={`relative z-10 transition-transform duration-500 ${active ? "scale-110" : ""}`} />
    <span className="relative z-10 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
      {label}
    </span>
  </button>
);

const PublicationCard = ({ pub, index }) => {
  const isScoped = (pub.category || "").toLowerCase().includes("scopus");
  const isReview = (pub.category || "").toLowerCase().includes("review");
  const authors = formatAuthors(pub.student_authors);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative h-full bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-500 overflow-hidden">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
            isScoped ? "bg-teal-50 text-teal-600 border border-teal-100" : 
            isReview ? "bg-amber-50 text-amber-600 border border-amber-100" :
            "bg-slate-50 text-slate-500 border border-slate-100"
          }`}>
            {pub.event_type || "Publication"}
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={14} />
            <span className="text-[10px] font-black tracking-widest uppercase">{pub.year || "2025"}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-serif text-slate-800 mb-4 line-clamp-3 leading-tight group-hover:text-teal-600 transition-colors duration-500">
          {pub.title}
        </h3>

        {/* Authors */}
        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              <Users size={14} className="text-slate-400" />
            </div>
            <div className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-wide">
              {authors.slice(0, 3).join(", ")}
              {authors.length > 3 && <span className="text-teal-500"> +{authors.length - 3} others</span>}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              <ShieldCheck size={14} className="text-teal-500" />
            </div>
            <div className="text-[11px] font-medium text-slate-500 italic font-serif leading-relaxed line-clamp-2 pr-2">
              {pub.venue}
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{pub.institute || "SRL"}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
             <ArrowRight size={14} />
          </div>
        </div>
>>>>>>> Stashed changes
      </div>
    </motion.div>
  );
};

<<<<<<< Updated upstream
/* ================= YEAR PICKER MODAL ================= */
const YearPickerModal = ({ isOpen, onClose, years, selectedYear, onSelectYear, buttonRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      {/* Dropdown Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 50,
        }}
        className="bg-white rounded-xl shadow-xl border border-slate-200 p-4"
      >
        {/* Year Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                onSelectYear(year);
                onClose();
              }}
              className={`py-2 sm:py-2.5 px-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                selectedYear === year
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Clear Selection Button */}
        {selectedYear && (
          <button
            onClick={() => {
              onSelectYear(null);
              onClose();
            }}
            className="w-full mt-3 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors text-sm"
=======
const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative h-full bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500 overflow-hidden">
        
        {/* Status Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="px-4 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {project.status || "Active Research"}
          </div>
          {project.grant && (
             <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                Grant Funded
             </div>
          )}
        </div>

        <h3 className="text-xl font-bold font-serif text-slate-800 mb-4 leading-tight group-hover:text-amber-600 transition-colors duration-500">
          {project.title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3 pr-2">
          {project.description || "Experimental research pushing the boundaries of AI and software engineering within the lab environment."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(project.tags || ["Machine Learning", "Innovation"]).map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-tight rounded-lg border border-slate-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Authors / Leads */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex -space-x-3">
                {[1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">SRL</div>
                  </div>
                ))}
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team {project.teamCount || index + 2}</span>
          </div>
          <motion.div 
            whileHover={{ x: 5 }}
            className="text-amber-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer"
>>>>>>> Stashed changes
          >
            Details <ArrowRight size={14} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

<<<<<<< Updated upstream

/* ================= MAIN ================= */
const Publications = () => {
=======
/* ================= SKELETON ================= */

const SkeletonCard = () => (
  <div className="h-80 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm p-8 flex flex-col gap-4 animate-pulse">
    <div className="h-6 bg-slate-100 rounded-lg w-1/4" />
    <div className="h-10 bg-slate-100 rounded-lg w-3/4 mt-4" />
    <div className="h-20 bg-slate-100 rounded-lg w-full mt-4" />
    <div className="mt-auto h-12 bg-slate-100 rounded-lg w-full" />
  </div>
);

/* ================= MAIN ================= */

const Repository = () => {
  const [activeTab, setActiveTab] = useState("publications");
  const [allPublications, setAllPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

>>>>>>> Stashed changes
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);

<<<<<<< Updated upstream
  // Extract all unique years from data (2020 to current year)
  const allYears = Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i).reverse();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filtering logic
  const filteredPublications = publicationsData.filter((pub) => {
    const matchesCat = activeCategory === "All" || pub.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesQuery =
      (pub.title || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(pub.authors) ? pub.authors.join(", ") : pub.authors || "").toLowerCase().includes(searchLower) ||
      (pub.venue || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(pub.tags) ? pub.tags.join(", ") : pub.tags || "").toLowerCase().includes(searchLower);

    let matchesYear = true;
    if (selectedYear) {
      // Try to extract year from pub.date
      const pubYear = parseInt((pub.date && pub.date.match(/\d{4}/)?.[0]) || 0);
      matchesYear = pubYear === selectedYear;
    }
    return matchesCat && matchesQuery && matchesYear;
  });

  // Export to Excel function with multiple sheets (Conference as main sheet)
  const exportToExcel = (data) => {
    if (data.length === 0) {
      alert("No publications to export");
      return;
    }

    const headers = ["ID", "Title", "Authors", "Venue", "Date", "Category", "Description", "Tags", "Status", "Inventors"];
    const workbook = XLSX.utils.book_new();
    
    // Group data by category
    const categoryList = ["Conference", "Journal", "Book Chapter", "Patents"];
    const groupedData = {};
    
    categoryList.forEach(cat => {
      groupedData[cat] = data.filter(pub => pub.category === cat);
    });

    // Add sheets in order - Conference first as main sheet
    categoryList.forEach((category) => {
      const items = groupedData[category];
      if (items.length > 0) {
        // Prepare rows with headers
        const rows = items.map(pub => ([
          pub.id,
          pub.title,
          pub.authors.join("; "),
          pub.venue,
          pub.date,
          pub.category,
          pub.description,
          pub.tags.join("; "),
          pub.status || "-",
          pub.inventors ? pub.inventors.join("; ") : "-"
        ]));

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, ws, category);
      }
    });

    // Generate Excel file
    XLSX.writeFile(workbook, `publications_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="relative pt-6 lg:pt-8 pb-32 px-3 sm:px-4 lg:px-6 min-h-screen bg-[#F2EFE8] overflow-hidden">
      {/* Unique Mesh Gradient Background - Darkened */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f8e6c1]/60 via-[#EAE4D5]/40 to-[#00887b]/20" />

        {/* Animated Glow Spheres - Diagonal Orientation */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#E6B800]/15 rounded-full blur-[150px] pointer-events-none"
        />
        <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />


        {/* Subtle SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300887b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zm30 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-7xl font-black font-serif text-secondary-dark mb-3 uppercase tracking-tight"
          >
            Publications
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 text-lg max-w-xl mx-auto leading-snug"
          >
            Explore our latest research papers, journals, and book chapters driving innovation forward.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
=======
  // Fetch data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/publications`)
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((json) => {
        if (!cancelled) {
          setAllPublications(json.publications || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load publications:", err);
          setError("Experience an issue loading the repository.");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Aggregate Projects from studentsData
  const projectList = useMemo(() => {
    const list = [];
    // 1. Extract specifically mentioned ongoing researchWork
    studentsData.forEach(student => {
       const works = student.achievements_extended?.researchWork || [];
       works.forEach(w => {
          if (w.toLowerCase().includes("ongoing") || w.toLowerCase().includes("project")) {
             list.push({
                id: `p-${Math.random()}`,
                title: w.replace(/Ongoing Research Paper:|Ongoing:/gi, "").trim(),
                description: `A collaborative project by ${student.student_name} within the SRL infrastructure.`,
                tags: student.research || ["Innovation"],
                status: "Ongoing",
                grant: w.toLowerCase().includes("grant"),
                student: student.student_name
             });
          }
       });

       // 2. Extract srlPublications that are "under review" as ongoing projects
       const pubs = student.srlPublications || [];
       pubs.forEach(p => {
          if (p.category === "Paper under Review") {
             list.push({
                id: `pr-${Math.random()}`,
                title: p.title,
                description: `Research paper submitted to ${p.venue}. Currently undergoing peer review and validation.`,
                tags: ["Research Paper", "Peer Review"],
                status: "Under Review",
                grant: p.conferenceGrant,
                student: student.student_name
             });
          }
       });
    });

    // De-duplicate projects by title roughly
    const seen = new Set();
    return list.filter(p => {
       const key = p.title.toLowerCase().trim();
       if (seen.has(key)) return false;
       seen.add(key);
       return true;
    });
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(allPublications.map((p) => p.year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [allPublications]);

  const filteredItems = useMemo(() => {
    if (activeTab === "publications") {
      return allPublications.filter((pub) => {
        const matchesCat = activeCategory === "All" || pub.event_type === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesQuery = !q || (pub.title || "").toLowerCase().includes(q) || (pub.student_authors || "").toLowerCase().includes(q) || (pub.venue || "").toLowerCase().includes(q);
        const matchesYear = !selectedYear || pub.year === selectedYear;
        return matchesCat && matchesQuery && matchesYear;
      });
    } else {
      return projectList.filter(p => {
         const q = searchQuery.toLowerCase();
         return !q || (p.title || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
      });
    }
  }, [allPublications, projectList, activeTab, activeCategory, searchQuery, selectedYear]);

  const exportToExcel = useCallback(() => {
    if (filteredItems.length === 0) return;
    const items = activeTab === "publications" ? filteredItems : projectList;
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab);
    XLSX.writeFile(wb, `srl_${activeTab}_${new Date().toISOString().split("T")[0]}.xlsx`);
  }, [filteredItems, activeTab, projectList]);

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-slate-900 overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#0D9488]/5 blur-[120px] rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-amber-500/5 blur-[100px] rounded-full -ml-10 -mb-10" />
        <div className="absolute top-[20%] left-[10%] w-[1px] h-[60%] bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
        <div className="absolute top-[20%] right-[10%] w-[1px] h-[60%] bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
>>>>>>> Stashed changes
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
<<<<<<< Updated upstream
            <Link to="/add-publication" className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-teal-700 transition-colors inline-flex items-center gap-2">
              <PlusCircle size={20} />
              Add Publications
            </Link>
=======
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 group cursor-default">
               <Layers size={14} className="group-hover:text-teal-500 transition-colors" />
               Scholarly Repository
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tight mb-8 leading-none">
               SRL <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">Repository</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
               A centralized hub for our laboratory's high-impact publications and ongoing research projects pioneering the future of technology.
            </p>
>>>>>>> Stashed changes
          </motion.div>
        </div>
      </div>

<<<<<<< Updated upstream
        {/* Filters and Search Hub */}
        <div className="flex flex-col gap-2 mb-8">
          {/* Categories and Controls Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-2 bg-slate-50/50 p-1.5 sm:p-2.5 rounded-3xl border border-slate-200 shadow-sm">
            {/* Categories Tab */}
            <div className="flex items-center gap-1.5 overflow-x-auto lg:overflow-visible w-full lg:w-auto lg:scrollbar-hide py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat 
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
=======
      {/* Control Center */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-2 md:p-4 flex flex-col md:flex-row items-center gap-6 justify-between">
           
           {/* Tab Switcher */}
           <div className="flex bg-slate-50 rounded-[2rem] p-1.5 border border-slate-100 overflow-hidden">
              <TabButton 
                active={activeTab === "publications"} 
                label="Publications" 
                icon={BookOpen} 
                onClick={() => setActiveTab("publications")} 
              />
              <TabButton 
                active={activeTab === "projects"} 
                label="Projects" 
                icon={Cpu} 
                onClick={() => setActiveTab("projects")} 
              />
           </div>

           {/* Filters & Search */}
           <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search by title, author or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:bg-white focus:border-teal-500 transition-all"
                 />
              </div>

              <div className="hidden lg:flex items-center gap-2">
                 <button 
                  onClick={exportToExcel}
                  className="p-4 rounded-[2rem] bg-slate-50 text-slate-400 hover:bg-teal-500 hover:text-white transition-all duration-500 border border-slate-100"
                  title="Export Data"
                 >
                   <Download size={20} />
                 </button>
                 <Link 
                  to="/add-publication"
                  className="flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   <PlusCircle size={18} />
                   Contribute
                 </Link>
              </div>
           </div>
        </div>

        {/* Secondary Category Filters (Only for Publications) */}
        {activeTab === "publications" && (
           <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-8 overflow-x-auto pb-4 no-scrollbar"
           >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    activeCategory === cat 
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
>>>>>>> Stashed changes
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-200 mx-2" />
              
              {availableYears.slice(0, 5).map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                    selectedYear === year 
                    ? "bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20" 
                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                  }`}
                >
                  {year}
                </button>
              ))}
           </motion.div>
        )}
      </div>

<<<<<<< Updated upstream
            {/* Search and Year Picker */}
            <div className="flex items-center gap-1.5 w-full lg:w-auto">
              {/* Search Box */}
              <div className="relative flex-1 lg:flex-none lg:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search papers, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full py-2 h-9 pl-9 pr-3 text-xs sm:text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:border-slate-300"
                />
              </div>

              {/* Year Picker Button */}
              <button
                ref={yearButtonRef}
                onClick={() => setShowYearPicker(true)}
                className={`shrink-0 h-9 px-2.5 sm:px-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 ${
                  selectedYear
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Calendar size={15} />
                <span className="hidden sm:inline text-xs">{selectedYear || "Year"}</span>
              </button>
              {/* Export to Excel Button */}
              <button
                onClick={() => exportToExcel(filteredPublications)}
                title="Export to Excel"
                className="shrink-0 h-9 px-2.5 sm:px-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600"
              >
                <FileDown size={15} />
                <span className="hidden sm:inline text-xs">Export</span>
              </button>            </div>
          </div>

          {/* Active Filters Display */}
          {(activeCategory !== "All" || searchQuery || selectedYear) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-1.5 bg-teal-50/50 p-2 sm:p-3 rounded-2xl border border-teal-200/50"
            >
              <span className="text-xs font-semibold text-teal-700">Filters:</span>
              
              {activeCategory !== "All" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-teal-200"
                >
                  {activeCategory}
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-teal-200"
                >
                  <Search size={12} />
                  {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              {selectedYear && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium border border-teal-200"
                >
                  <Calendar size={12} />
                  {selectedYear}
                  <button
                    onClick={() => setSelectedYear(null)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )}

              {/* Clear All Button */}
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setSelectedYear(null);
                }}
                className="ml-auto text-teal-600 hover:text-teal-700 font-bold text-xs underline"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </div>

        {/* Year Picker Modal */}
        <YearPickerModal
          isOpen={showYearPicker}
          onClose={() => setShowYearPicker(false)}
          years={allYears}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          buttonRef={yearButtonRef}
        />

        {/* Results Counter */}
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            Loading publications...
          </motion.p>
        ) : filteredPublications.length > 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            Showing <span className="font-bold text-teal-600">{filteredPublications.length}</span> of <span className="font-bold">{publicationsData.length}</span> publications
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm sm:text-base text-slate-600 font-medium mb-6"
          >
            No publications found.
          </motion.p>
        )}

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col h-[350px] animate-pulse">
                  <div className="flex justify-between items-start mb-5">
                    <div className="h-6 w-24 bg-teal-50 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 md:h-8 w-3/4 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-6"></div>
                  
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded bg-gray-200 mt-1 shrink-0"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded bg-gray-200 mt-1 shrink-0"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="mt-auto border-t border-slate-100 pt-5 flex justify-between items-center">
                    <div className="flex gap-2">
                       <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                       <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                  </div>
                </div>
              ))
            ) : filteredPublications.length > 0 ? (
              filteredPublications.map((pub, index) => (
                <PublicationCard key={pub.id} pub={pub} index={index} exportToExcel={exportToExcel} />
              ))
            ) : loading ? null : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-slate-500 py-12 text-lg font-semibold"
              >
                No publications found.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

=======
      {/* Results Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40">
        
        {/* Count Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
           <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Showing <span className="text-teal-600">{filteredItems.length}</span> Results
           </p>
           {activeTab === "projects" && (
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Live Research Feed</span>
              </div>
           )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
               layout
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  activeTab === "publications" 
                  ? <PublicationCard key={item.id} pub={item} index={index} />
                  : <ProjectCard key={item.id} project={item} index={index} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <Search size={40} />
                   </div>
                   <h3 className="text-2xl font-black font-serif text-slate-300">No matching entries found</h3>
                   <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
>>>>>>> Stashed changes
      </div>

      {/* Background Style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Repository;
