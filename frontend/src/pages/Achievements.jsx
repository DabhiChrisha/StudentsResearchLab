import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/* ================= DATA ================= */
const data = [
  {
    id: 1,
    title: "Student Research Excellence 🏆",
    type: "image",
    media: [
      "/Achievements/Achievement-Henit-Zenisha-Hetvi/img-1.jpg",
      "/Achievements/Achievement-Henit-Zenisha-Hetvi/img-2.jpg",
      "/Achievements/Achievement-Henit-Zenisha-Hetvi/img-3.jpg",
      "/Achievements/Achievement-Henit-Zenisha-Hetvi/img-4.jpg",
      "/Achievements/Achievement-Henit-Zenisha-Hetvi/img-5.jpg",
    ],
    date: "13th Feb 2026",
    category: "Competition",
    description:
      "M. M. Patel Students Research Project Cell, KSV proudly congratulates Team OSMAR for securing 🥈 Second Prize (Booth Track) at the Gujarat Innovation Project Showcase held at GEC Surat, Gujarat, organized by Edunet Foundation with support from Shell India Markets Pvt. Ltd. The team presented “OSMAR: Oil Spill Monitoring using Advanced SAR Imagery,” effectively demonstrating their hardware–software solution for efficient oil spill detection. Facilitated through the Skills4Future Program under the KSV–Edunet MoU, this achievement reflects the impact of structured mentorship and industry exposure. The team—Pavan Thakkar, Zenisha Devani, Krisha P., Henit Panchal, and Hetvi Hinsu—worked under the guidance of Mr. Rohit Bhadauriya and Dr. Himani Trivedi, showcasing the strong culture of innovation and applied research nurtured at KSV 🚀💡.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_edunetfoundation-ksv-svkm-activity-7429557690068017152-W3eO?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 2,
    title: "🌍 Day 2 | KSV at IndiaAI Impact Summit 2026 ✨",
    type: "image",
    media: [
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-1.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-2.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-3.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-4.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-5.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-6.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-7.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-8.jpg",
      "/Achievements/IndiaAI-Impact-Summit-Day2/img-9.jpg",
    ],
    date: "17th Feb 2026",
    category: "Summit",
    description:
      "Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, marked a proud moment on Day 2 of the IndiaAI Impact Summit 2026, organized under the Digital India initiative by MeitY, Government of India, where the Compendium “Casebook on AI and Gender Empowerment” was officially launched in collaboration with UN Women. Among hundreds of global submissions, the Students Research Lab (SRL) members of KSV Student Researchers Team—Janki Chitroda, Yashvi Chavda, and Krishna Bhatt (CE, LDRP-ITR, KSV), guided by Dr. Himani Trivedi—were selected among the 23 research works published, earning international recognition. The team also engaged with eminent global leaders and policymakers on inclusive AI innovation, while Dr. Rupesh Vyas and Dr. Nitin Pandya represented KSV at the summit, highlighting the university’s strong academic leadership and expanding global research footprint 🌍✨.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429466085311098880-XDnV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 3,
    title: "KSV at IndiaAI Impact Summit 2026 🌍✨",
    type: "image",
    media: [
      "/Achievements/IndiaAI-Impact-Summit/img-1.jpg",
      "/Achievements/IndiaAI-Impact-Summit/img-2.jpg",
      "/Achievements/IndiaAI-Impact-Summit/img-3.jpg",
      "/Achievements/IndiaAI-Impact-Summit/img-4.jpg",
      "/Achievements/IndiaAI-Impact-Summit/img-5.jpg",
      "/Achievements/IndiaAI-Impact-Summit/img-6.jpg",
      "/Achievements/IndiaAI-Impact-Summit/img-7.jpg",
    ],
    date: "16th Feb 2026",
    category: "Summit",
    description:
      "Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, proudly highlights its strong presence at the IndiaAI Impact Summit 2026, organized under the Digital India initiative by MeitY, Government of India. The Students Research Lab (SRL) members of the KSV Students Researchers Team—Janki Chitroda, Yashvi Chavda, and Krishna Bhatt (CE, LDRP-ITR, KSV), guided by Dr. Himani Trivedi—have been selected for the prestigious Casebook on AI and Gender Empowerment in collaboration with UN Women India, earning national recognition and the opportunity to present their work to a global audience of policymakers and innovators. Representing the university at the summit were Dr. Rupesh Vyas and Dr. Nitin Pandya, reflecting KSV’s strong commitment to research excellence, inclusive AI innovation, and impactful global engagement 🌍✨.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmpsrpc-activity-7429342935848067073-MDgF?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 4,
    title: "🚀 KSV at National PAG Meet ✨",
    type: "image",
    media: [
      "/Achievements/Achievement-Henit-Hetvi-Mihir/img-1.jpg",
      "/Achievements/Achievement-Henit-Hetvi-Mihir/img-2.jpg",
      "/Achievements/Achievement-Henit-Hetvi-Mihir/img-3.jpg",
      "/Achievements/Achievement-Henit-Hetvi-Mihir/img-4.jpg",
      "/Achievements/Achievement-Henit-Hetvi-Mihir/img-5.jpg",
    ],
    date: "6th Feb 2026",
    category: "Meeting",
    description:
      "A proud moment for M. M. Patel Research Cell, KSV and M. M. Patel Students Research Project Cell, KSV, as Students Research Lab (SRL) members represented the university at the National-level 3rd Project Advisor Group (PAG) Meeting of DST–Technology Enabling Centre (DST-TEC) held at Pandit Deendayal Energy University, Gandhinagar. The event, graced by Dr. Krishna Kanth Pulicherla, featured KSV project teams—Henit Panchal, Hetvi Hinsu, Mihir Patel, and Kavya Chandegara—who showcased innovative, technically strong, and real-world relevant solutions. Their participation highlights Kadi Sarva Vishwavidyalaya’s growing research ecosystem and its commitment to fostering student-driven innovation and national-level impact ✨🚀.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_svkm-ksv-mmprc-activity-7428803534722068480-m68o?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 5,
    title: "🏆 Team BlackBox Achievement 🌟",
    type: "image",
    media: [
      "/Achievements/DAU-InnovAItion-Hackathon/img-1.jpg",
    ],
    date: "11th Jan 2026",
    category: "Competition",
    description:
      "Congratulations to Students Research Lab (SRL) members Team BlackBox from Kadi Sarva Vishwavidyalaya (KSV), Gandhinagar, for securing the 4th Runner-Up position at the national-level hackathon INNOVAITION – Shaping Future Innovators, powered by Intuitive.ai in collaboration with Dhirubhai Ambani University. Among 75 shortlisted teams nationwide, the team’s performance reflected strong technical excellence, innovation, and collaborative problem-solving. Team members—Kandarp Gajjar, Nancy Patel, Hemant Pande, Charmi Padh, and Honey Modha (LDRP-ITR)—worked under the guidance of Dr. Himani Trivedi, exemplifying the research-driven culture and innovation mindset fostered at the M. M. Patel Students Research Project Cell, KSV Student Research Lab (SRL) 🔬✨.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_mmpsrpc-srl-ksv-activity-7419418359429115904-bOge?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 6,
    title: "7 Teams from the Students Research Lab Shortlisted at INNOVAITION National Hackathon",
    type: "image",
    media: [
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-1.jpg",
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-2.jpg",
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-3.jpg",
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-4.jpg",
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-5.jpg",
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-6.jpg",
      "/Achievements/DAU-InnovAItion-Hackathon-7-teams/img-7.jpg",
    ],
    date: "11th Jan 2026",
    category: "Competition",
    description:
      "A proud moment for the MMPSRPC Students Research Lab (SRL) as 7 student teams have been shortlisted at “INNOVAITION – Shaping Future Innovators,” a national-level hackathon powered by Intuitive.ai in collaboration with Dhirubhai Ambani University (DAU).",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-srl-mmpsrpc-activity-7419393479648206848-1bfv?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 7,
    title: "Congratulations to Our Bright Minds 🎉",
    type: "image",
    media: [
      "/Achievements/Paper-Presentation-Ayushi-Manasvi-Swayam/img-1.jpg",
    ],
    date: "",
    category: "Paper Presentation",
    description:
      "We proudly congratulate the Students Research Lab (SRL) members—Ayushi Joddha (Presenter), Manasvi Shah, and Swayam Kalburgi (CE, LDRP-ITR, KSV)—for receiving the Conference Paper Presentation Grant from the M. M. Patel Students Research Project Cell, KSV under the guidance of Dr. Himani Trivedi. Their paper, “EfficientNetB3 Adapted Hybrid UNet with Attention Guided Decoding for Urban Scene Segmentation,” was presented at the 13th IEEE International Conference on Intelligent Systems and Embedded Design (ISED 2025), organized by NIT Raipur and published in IEEE Xplore (Scopus Indexed). This achievement reflects their strong research commitment and contribution to AI-driven innovation—heartiest congratulations to the team on this milestone 🚀✨.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-ldrpitr-mmpsrpc-activity-7413814908217344000-JmvS?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 8,
    title: "Congratulations to Our Bright Minds 🎉",
    type: "image",
    media: [
      "/Achievements/Paper-Presentation-Henit-Hetvi-Heny/img-1.jpg",
    ],
    date: "",
    category: "Paper Presentation",
    description:
      "We proudly congratulate the Students Research Lab (SRL) members—Henit Panchal (Presenter), Hetvi Hinsu, and Heny Patel (CE, LDRP-ITR, KSV)—for receiving the Conference Paper Presentation Grant from the M. M. Patel Students Research Project Cell, KSV under the guidance of Dr. Shivani A. Trivedi and Dr. Himani Trivedi. Their paper, “Generative AI as a Catalyst in Indian Education Ecosystems,” was presented at AAMLAD-2025 – 1st International Workshop on Advancing AI and ML Across Disciplines, organized by ABV-IIITM, Gwalior and published in Springer (CCIS). This achievement reflects their strong research commitment and contribution to AI-driven educational innovation—heartiest congratulations to the team on this milestone 🚀✨.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-researchexcellence-studentachievement-activity-7412352256806920192-MoVv?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 9,
    title: "National Research Representation 🌟",
    type: "image",
    media: [
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-1.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-2.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-3.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-4.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-5.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-6.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-7.jpg",
      "/Achievements/Conference-Krish-Jenish-Hemant-Honey/img-8.jpg",
    ],
    date: "10th-11th Dec 2025",
    category: "Conference",
    description:
      "M. M. Patel Students Research Project Cell, KSV (MMPSRPC), Kadi Sarva Vishwavidyalaya, Gandhinagar, proudly shares that Students Research Lab (SRL) members from Vidush Somany Institute of Technology and Research, Kadi and LDRP ITR participated in the NASCENT MR – National Scientific Conference on Emerging Trends in Multidisciplinary Research 2025 held at Puducherry and organized by Vinayaka Mission's Research Foundation. The students successfully presented their accepted papers: “SHAP-Enhanced Outbreak Forecasting: Interpretable Multi-Modal Learning for Waterborne Disease Prediction” by Krish Patel (Presenter) and Jenish Sorathiya, and “Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations” by Hemant Pande (Presenter) and Honey Modha, under the mentorship of Dr. Himani Trivedi. Their participation reflects KSV’s strong interdisciplinary research culture—heartiest congratulations to the teams and best wishes for their continued academic success 🚀✨.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7407377566589759488-qigD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 10,
    title: "Students Research Lab Researchers Publish AI Study at International Conference",
    type: "image",
    media: [
      "/Achievements/Research-Paper-Publication-18-11-25/img-1.jpg",
    ],
    date: "18th November 2025",
    category: "Research Paper Publish",
    description:
      "A proud research milestone for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers successfully published their paper at the International Conference on Artificial Intelligence and Smart Technologies for Sustainability (AISTS) 2025, organized by Marwadi University, Rajkot. The research paper titled “Exploring AI's Influence on Human Thinking: Productivity, Learning, and Cognitive Skills in the Age of XAI” has been published in the IEEE Xplore Digital Library, reflecting the students’ dedication to meaningful research and innovation.",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7398590758359912448-l4bb?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 11,
    title: "Research Paper Published in IEEE Xplore by Students Research Lab Researchers",
    type: "image",
    media: [
      "/Achievements/Research-Paper-Publication-21-10-25/img-1.jpg",
    ],
    date: "21st October 2025",
    category: "Research Paper Publish",
    description:
      "A proud research achievement for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers successfully published their paper titled “TrafficEye: Intelligent Traffic Optimization Using Deep Learning Approach” in the IEEE Xplore Digital Library through the 2nd IEEE International Conference on Artificial Intelligence and Machine Vision (AIMV-2025). Guided by Dr. Himani Trivedi, the research explores the application of deep learning techniques to improve traffic management and optimization, contributing to smarter and more efficient urban mobility solutions. This accomplishment highlights the strong research culture, innovation, and collaborative learning environment fostered within the Students Research Lab, where students actively transform ideas into impactful technological research. 🚀🔬",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-mmpsrpc-researchexcellence-activity-7389603335164743680-rS1B?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 12,
    title: "Global Research Presentation at the 9th NYC Green School Conference 2025",
    type: "image",
    media: [
      "/Achievements/Global-Recognition-9th-NYC/img-1.jpg",
      "/Achievements/Global-Recognition-9th-NYC/img-2.jpg",
      "/Achievements/Global-Recognition-9th-NYC/img-3.jpg",
      "/Achievements/Global-Recognition-9th-NYC/img-4.jpg",
      "/Achievements/Global-Recognition-9th-NYC/img-5.jpg",
      "/Achievements/Global-Recognition-9th-NYC/img-6.jpg",
    ],
    date: "",
    category: "Global Recognition",
    description:
      "A proud moment for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as faculty and student researchers showcased their work at the 9th NYC Green School Conference 2025, organized by Green Mentors at the ILR School, Cornell University, New York. Representing LDRP Institute of Technology & Research, the researchers presented innovative work focused on sustainable construction, ethical AI in education, and AI-driven sustainability diagnostics for smart institutions. Their participation reflects the growing research culture and commitment to addressing global challenges through innovation and interdisciplinary thinking. This international platform provided an opportunity to contribute to meaningful discussions on sustainability, technology, and future-ready education, highlighting the impact of research emerging from the Students Research Lab. 🌍✨",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_ksv-svkm-mmpsrpc-activity-7380831837272756224-XA7Q?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 13,
    title: "Research Posters from Students Research Lab Selected for GTU National Finale",
    type: "image",
    media: [
      "/Achievements/Research-Posters-19&20-9-25/img-1.jpg",
      "/Achievements/Research-Posters-19&20-9-25/img-2.jpg",
      "/Achievements/Research-Posters-19&20-9-25/img-3.jpg",
      "/Achievements/Research-Posters-19&20-9-25/img-4.jpg",
    ],
    date: "19th & 20th September, 2025",
    category: "Research Poster",
    description:
      "A proud moment for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers have been selected for the finale of the National Poster Competition on AI Powered Research and Innovation, organized by Gujarat Technological University (GTU), Ahmedabad. The selected teams will present their innovative research posters at the national-level finale scheduled for 19–20 September 2025, showcasing their work on AI-driven student dropout analysis using machine learning and air pollution tracking through satellite and ground data fusion. Guided by Dr. Himani Trivedi, this achievement reflects the growing research culture, innovation mindset, and collaborative learning environment fostered within the Students Research Lab, where students actively transform ideas into impactful research contributions. 🚀🔬",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_gtu-airesearch-studentinnovation-activity-7376116498777616385-VT7i?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
  {
    id: 14,
    title: "Research Paper Publication Achievement: Students Publish Paper in Springer Book Series",
    type: "image",
    media: [
      "/Achievements/Research-Posters-8&9-11-24/img-1.jpg",
    ],
    date: "8th & 9th November 2024",
    category: "Research Paper Publish",
    description:
      "A significant research milestone for the M. M. Patel Students Research Project Cell – Students Research Lab (SRL) as student researchers successfully published their paper titled “Improving Urban Road Safety: Enhancing Pedestrian Safety Through Automated Traffic Signal Control and Law Enforcement” in the Springer Lecture Notes in Networks and Systems (LNNS) book series – Data Science and Security. The research was presented at the International Conference on Data Science, Computation and Security 2024, highlighting innovative approaches to improving urban road safety through intelligent traffic signal control and enforcement mechanisms. Guided by Dr. Himani Trivedi, this achievement reflects the strong research culture, innovation, and application-driven learning nurtured within the Students Research Lab, where students actively contribute to impactful solutions addressing real-world challenges. 🚀🔬",
    linkedin: "https://www.linkedin.com/posts/mmpsrpc_springer-researchpublication-datascience-activity-7368163507625746434-vjXc?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFJiBFMBBjWJQ8FYFoDQDvjaardrEEtrUsI",
  },
];

/* 🎊 Confetti helper */
const fireConfetti = () => {
  const duration = 1200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });

    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
};

/* ================= CARD ================= */
const Card = ({ item, onClick }) => (
  <motion.div
    layout
    transition={{ type: "spring", stiffness: 140, damping: 22 }}
    whileHover={{ y: -6 }}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="relative cursor-pointer rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white group"
  >
    <div className="aspect-[4/3] overflow-hidden bg-white">
      {item.type === "image" ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full h-full"
        >
          {item.media.map((img, index) => (
            <SwiperSlide
              key={index}
              className="!flex !items-center !justify-center"
            >
              <img
                src={img}
                alt={item.title}
                className="block max-w-full max-h-full object-contain mx-auto"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <video
            src={item.media}
            muted
            loop
            autoPlay
            playsInline
            className="block max-w-full max-h-full object-contain mx-auto"
          />
        </div>
      )}
    </div>

    <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-5 text-white">
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-sm opacity-80">{item.date}</p>
      <p className="text-xs mt-1 opacity-70">Click to view details</p>
    </div>
  </motion.div>
);

/* ================= MAIN ================= */
const Achievements = () => {
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);
  const detailRef = useRef(null);
  const remaining = data.filter((d) => d.id !== selected?.id);

  useEffect(() => {
    if (selected && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [selected]);

  const handleSelect = (item) => {
    setSelected(item);
    fireConfetti();
  };

  return (
    <div
      ref={sectionRef}
      className="relative pt-8 lg:pt-12 pb-40 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F2EFE8] overflow-hidden"
    >
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl lg:text-7xl font-black font-serif text-secondary-dark mb-3 uppercase tracking-tight">
            Achievements
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-snug">
            Celebrating the milestones and scholarly breakthroughs of our
            dedicated researchers.
          </p>
        </div>

        {/* BEFORE CLICK */}
        {!selected && (
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.map((item) => (
              <Card
                key={item.id}
                item={item}
                onClick={() => handleSelect(item)}
              />
            ))}
          </motion.div>
        )}

        {/* AFTER CLICK */}
        {selected && (
          <motion.div
            layout
            onClick={() => setSelected(null)}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="grid grid-cols-1 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] gap-8 items-start"
          >
            {/* LEFT — card list (hidden on mobile to prevent clustering, visible on lg+) */}
            <motion.div
              layout
              onClick={(e) => e.stopPropagation()}
              className="hidden lg:block space-y-6 self-start"
            >
              <Card
                item={selected}
                onClick={() => setSelected(null)}
              />

              {remaining.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  onClick={() => handleSelect(item)}
                />
              ))}
            </motion.div>

            {/* RIGHT DETAIL — full-width on mobile, right column on lg+ */}
            <motion.div
              layout
              ref={detailRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="scroll-mt-28 w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 order-first lg:order-last"            >
              <div className="aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
                {selected.type === "image" ? (
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true, }}
                    pagination={{ clickable: true }}
                    loop
                    className="w-full h-full"
                  >
                    {selected.media.map((img, index) => (
                      <SwiperSlide
                        key={index}
                        className="!flex !items-center !justify-center"
                      >
                        <img
                          src={img}
                          alt={selected.title}
                          className="block max-w-full max-h-full object-contain mx-auto"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      src={selected.media}
                      controls
                      autoPlay
                      className="block max-w-full max-h-full object-contain mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 font-serif">
                  {selected.title}
                </h3>

                <div className="flex flex-wrap gap-3 mb-4 text-sm">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">
                    {selected.category}
                  </span>
                  <span className="text-slate-500">{selected.date}</span>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">
                  {selected.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={selected.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#004182] transition"
                  >
                    View on LinkedIn
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition lg:hidden"
                  >
                    ← Back to All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Achievements;