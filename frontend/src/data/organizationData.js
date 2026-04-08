import ksvCampus from "../assets/ksv_campus.jpg";
import mmpsrpcCampus from "../assets/mmpsrpc_campus.jpeg";
import svkmCampus from "../assets/svkm_campus.jpg";
import chhaganbhaPhoto from "../assets/pujya_chhaganbha.jpg";
import shriManeklal from "../assets/shri_maneklal_patel.jpg";
import chairmanPhoto from "../assets/chairman.png";
import mamPhoto from "../assets/Dr.Himani Trivedi Ma'am.png";
import ieeeBackground from "../assets/IEEE KSV.jpeg";
// import ieeeExecomPhoto from "../assets/ExeCom'26.png";

export const organizationData = {
  svkm: {
    title: "Sarva Vidyalaya Kelavani Mandal",
    subtitle: "કર ભલા હોગા ભલા.",
    image: "/SVKM.svg",
    heroImage: svkmCampus,
    website: "https://svkm.org.in/",
    description: [
      `Sarva Vidyalaya Kelavani Mandal (SVKM) was established in 1919 by the philanthropist Pujya Chhaganbha. His guiding principle, "કર ભલા, હોગા ભલા" (Do good, and good will come), has driven the trust's growth in education. What began with just six students has now expanded to educating more than 54,000 students across various schools and colleges in Kadi and Gandhinagar.

      Sarva Vidyalaya Kelavni Mandal, with over 105 years of history, is one of India's oldest educational trusts. It operates schools across different levels and offers a wide range of programs, including CBSE and GSEB schools, as well as undergraduate, graduate, and doctoral studies in fields such as engineering, sciences, management, arts, and healthcare.

      Guided by core principles of innovation, entrepreneurship, academic rigor, and the humanities, SVKM focuses on fostering holistic development for students, faculty, and society.`,
    ],
    // Keep stats as is
    stats: [
      { label: "Years of Legacy", value: "105+", icon: "History" },
      { label: "Students", value: "54,000+", icon: "Users" },
      { label: "Institutions", value: "120+", icon: "Building2" },
      // { label: "Campuses", value: "5+" },
    ],
    // Remove mission and vision and update them with the content you find on the website for the campuses & also keep an image carousel for the institutions with their images.
    // mission:
    //   "Our mission is to provide quality, value-based, and affordable education to all, with a profound commitment to the underprivileged, while fostering the holistic development of our students and the betterment of society.",
    // vision:
    //   "To be a distinguished center of excellence that instills confidence and dynamism in our students, transforming them into globally sustainable icons who contribute meaningfully to the upliftment of their communities and the world.",
    founders: [
      {
        name: "Pujya Chhaganbha",
        image: chhaganbhaPhoto,
        quote: "કર ભલા હોગા ભલા.",
      },
      {
        name: "Shri Maneklal M. Patel",
        image: shriManeklal,
        quote: "શિક્ષણ એ જ સાચી સેવા છે.",
      },
    ],
    features: [
      // "Philanthropic Legacy Since 1919",
      // "Value-Based Education",
      // "Inclusive & Affordable",
      // "From KG to PG & PhD",
      // "Focus on Women's Education",
    ],
    contact: {
      address:
        "Sarva Vidyalaya Campus, Behind Railway Station, Kadi - 382715, Gujarat, India",
      email: "info@svkm.org.in",
      // phone: "+91 2764 242996",
      mapEmbed:
        "https://maps.google.com/maps?q=Sarva+Vidyalaya+Campus+Kadi&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  },
  ksv: {
    title: "Kadi Sarva Vishwavidyalaya",
    subtitle: "કર ભલા હોગા ભલા.",
    image: "/KSV.svg",
    heroImage: ksvCampus,
    website: "https://ksv.ac.in/",
    description: [
      "Kadi Sarva Vishwavidyalaya (KSV) was established through the Gujarat State Government Act 21 of 2007 in May 2007 and is approved by the UGC (Ref F.9-18/2008(cpp-1) March 19, 2009).",
      'The university was founded by Sarva Vidyalaya Kelavni Mandal, a trust with more than 105 years of philanthropic existence and benevolence, guided by the principle "Kar Bhala, Hoga Bhala" (Do good, and good will come). This principle has shaped the trust’s mission to provide inclusive, value-based education to all, regardless of caste, creed, or religion.',
      "The university’s growth and success were greatly enhanced by the modest efforts and relentless contribution of Late Shri Maneklal M. Patel. Under his leadership, the university successfully amalgamated all three campuses in Gandhinagar and Kadi with its constituent colleges in March 2012, uniting them under the umbrella of Kadi Sarva Vishwavidyalaya.",
      "KSV is dedicated to offering need-based, contemporary courses while fostering research activities that contribute to economic growth and societal development. With 23+ Constituent Colleges and Departments at its Gandhinagar and Kadi campuses, the university continues to uphold the founders' vision of providing quality education that empowers students and benefits society at large.",
    ],
    stats: [
      // { label: "Acre Campus", value: "100+", icon: "Map" },
      { label: "Students", value: "50000+", icon: "Users" },
      { label: "Institutes", value: "29", icon: "Building2" },
      { label: "Teachers", value: "5000+", icon: "GraduationCap" },
    ],
    // mission:
    //   "To deliver need-based education relevant to contemporary times, promote excellence in research and innovation, and cultivate an inclusive and welcoming environment for all students.",
    // vision:
    //   "To be a leading university that provides quality education and research opportunities to students from all backgrounds, contributing significantly to the social, economic, and cultural development of society.",
    features: [
      // "UGC Approved University",
      // "Inclusive & Equitable Education",
      // "Research-Driven Curriculum",
      // "State-of-the-Art Infrastructure",
      // "Strong Industry Linkages",
    ],
    contact: {
      address: "Sector-15, Gandhinagar - 382015, Gujarat, India.",
      email: "info@ksv.ac.in",
      // phone: "+91 94090 35835",
      linkedin:
        "https://www.linkedin.com/school/kadi-sarva-vishwavidyalaya-gandihnagar/",
      mapEmbed:
        "https://maps.google.com/maps?q=Kadi+Sarva+Vishwavidyalaya+Kadi+Campus&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  },
  mmpsrpc: {
    title: "M. M. Patel Students Research Project Cell",
    subtitle: "For the students, By the students, Of the students!",
    website: "https://www.mmpsrpc.in/",
    image: "/MMPSRPC.svg",
    heroImage: mmpsrpcCampus,
    description: [
      "Founded in 2024, M. M. Patel Students Research Project Cell has been at the forefront of fostering academic excellence and innovative research among students at KSV University. Our journey began with a vision to create a platform where students could explore their research potential and contribute to the academic community.",
      "Over the years, we have grown from a small group of enthusiastic researchers to a vibrant community of researchers, mentors, and faculty members. Our commitment to nurturing talent and pushing the boundaries of knowledge has remained unwavering throughout our journey.",
    ],
    stats: [
      { label: "Ongoing Projects", value: "25", icon: "Briefcase" },
      { label: "Students Researchers", value: "65+", icon: "Microscope" },
      { label: "Publications", value: "7", icon: "BookOpen" },
    ],
    // mission:
    //   "Empowering student researchers through comprehensive grant support and funding initiatives to drive innovation and scientific discovery.",
    // vision:
    //   "Shaping the future of research through student-led innovation and global collaboration.",
    leadership: [
      {
        role: "",
        header: "Message from Hon. Chairman Sir",
        name: "Shri Vallabhbhai M. Patel",
        designation:
          "Chairman, Sarva Vidyalaya Kelvani Mandal, Kadi & Gandhinagar. President, Kadi Sarva Vishwavidyalaya Gandhinagar.",
        image: chairmanPhoto,
        cardQuote:
          "Knowledge is valuable, but wisdom with compassion, that's what truly builds a better tomorrow.",
        mainQuote:
          "Optimism, tradition, inclusiveness, service, compassion, tolerance, hope, and faithfulness are the underpinnings of Sarva Vidyalaya Kelvani Mandal for decades now.",
        message: [
          "With the objective of providing education to one and all, our trust has been managing various educational institutions from Pre-Primary to University level. The M. M. Patel Students Research Project Cell is a testament to our commitment to fostering innovation and research among our students.",
          "My vision is to serve every student of KSV in every possible better way, ensuring academic and personal growth. I am dedicated to supporting and nurturing careers, believing in the power of education to transform lives and communities, making education accessible and inclusive for all.",
        ],
      },
      {
        header: "Message from Head of MMPSRPC, KSV",
        name: "Dr. Himani Trivedi",
        designation: "Head of M. M. Patel Students Research Project Cell",
        image: mamPhoto,
        cardQuote:
          "Growth comes from steady effort, continuous learning, and discipline.",
        mainQuote:
          "Aspirations, curiosity, excellence, and dedication form the foundation of the Students Research Project Cell. For the students, By the students, Of the students!",
        message: [
          "Dedicated to fostering the growth of KSV students, the M. M. Patel Students Research Project Cell upholds a strong commitment to academic excellence. The Students Research Cell empowers skill development through meaningful activities and opportunities that strengthen knowledge and growth of students. This guidance and support helps students to succeed in their future careers and make valuable contribution to the society.",
        ],
      },
    ],
    objectivesTitle: "Goals",
    objectivesSubtitle:
      "Cultivate a dynamic environment that inspires and supports student-driven research initiatives.",
    objectives: [
      {
        title: "Nurture Fund Support",
        description:
          "Create a welcoming environment that facilitates access to funds essential for students to pursue their research initiatives, high-impact research publications in top-tier journals across various disciplines.",
      },
      {
        title: "Ensure Resource Accessibility",
        description:
          "Make essential tools and materials readily available to empower students in the exploration of innovative ideas.",
      },
      {
        title: "Foster Inclusive Opportunities",
        description:
          "Promote diversity by ensuring all students are welcomed and supported in their research endeavours.",
      },
      {
        title: "Assist with Research Dissemination",
        description:
          "Offer support for students in navigating the publishing process and securing patents.",
      },
      {
        title: "Encourage Collaboration",
        description:
          "Cultivate a collaborative environment that encourages interdisciplinary projects, enhancing the quality of research.",
      },
      {
        title: "Recognize and Celebrate Achievements",
        description:
          "Acknowledge and celebrate each research milestone to foster a culture of appreciation and motivation.",
      },
    ],
    contact: {
      address:
        "LDRP Campus, Sector-15, KH-5, Gandhinagar - 382015, Gujarat, India",
      email: "mmpsrpc@ksv.ac.in",
      linkedin: "https://www.linkedin.com/company/mmpsrpc",
      mapEmbed:
        "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  },
  ieee: {
    title: "IEEE Student Branch\nKadi Sarva Vishwavidyalaya",
    subtitle: "Empowering Students through Innovation and Leadership",
    image: "https://ieee-ksv-sb.mmpsrpc.in/Pasted-Graphic.svg",
    heroImage: ieeeBackground,
    website: "https://ieee-ksv-sb.mmpsrpc.in/",
    sections: {
      intro: [
        "The KSV IEEE Student Branch, established under the esteemed guidance of Kadi Sarva Vishwavidyalaya (KSV), has become a prominent center for technological innovation, professional development, and research for students across more than 25 colleges under the KSV umbrella. The branch was founded with the vision of fostering a vibrant culture of research, innovation, and collaboration, and has quickly evolved into an integral part of the university’s commitment to excellence in engineering and technology education.",
        'Operating with the core principle of "Advancing Technology for Humanity," the KSV IEEE Student Branch aligns seamlessly with KSV’s ethos of providing need-based education and offering contemporary courses that meet the demands of an ever-changing technological landscape.',
      ],
      mission: [
        "The Institute of Electrical and Electronics Engineers (IEEE) is dedicated to advancing technology for the benefit of humanity. IEEE aims to inspire innovation and uphold excellence in engineering and applied sciences across the globe. The organization's vision is to create a world where technology is a key driver for societal progress, promoting sustainable development and enhancing the quality of life for people worldwide.",
        "Through its network, education, and innovation, IEEE empowers professionals to push the limits of technological advancement while maintaining the highest ethical standards. The KSV IEEE Student Branch mirrors this mission by creating opportunities for collaboration, growth, and technological leadership, ensuring students are equipped with the tools they need to lead in the future.",
      ],
      activities: [
        "Since its inception, the IEEE KSV Student Branch has been a leader in organizing a variety of technical events, workshops, and seminars across disciplines like Computer Science, Electronics, Electrical Engineering, and Information Technology. These include flagship events such as technical paper presentations, project exhibitions, coding competitions, and hackathons, which provide students a platform to showcase their skills, engage in healthy competition, and collaborate creatively. These events offer hands-on experience and exposure to the latest technology trends, helping students prepare for careers in engineering and innovation.",
      ],
      impact: [
        "The IEEE KSV Student Branch fosters strong industry connections by inviting distinguished speakers from leading tech companies and research institutions, enhancing students’ employability and industry knowledge. The branch also supports student research, encouraging them to publish in IEEE conferences and journals, thus elevating KSV’s reputation as a hub of innovation.",
        "Aligned with KSV’s commitment to social responsibility, the branch leads initiatives like digital literacy workshops for underserved communities, developing tech solutions for local issues, and promoting STEM education. These initiatives reflect the branch’s dedication to IEEE’s mission of advancing technology for the benefit of humanity.",
      ],
    },
    description: [
      "The KSV IEEE Student Branch, established under the esteemed guidance of Kadi Sarva Vishwavidyalaya (KSV), has become a prominent center for technological innovation, professional development, and research for students across more than 25 colleges under the KSV umbrella. The branch was founded with the vision of fostering a vibrant culture of research, innovation, and collaboration, and has quickly evolved into an integral part of the university’s commitment to excellence in engineering and technology education.",
      'Operating with the core principle of "Advancing Technology for Humanity," the KSV IEEE Student Branch aligns seamlessly with KSV’s ethos of providing need-based education and offering contemporary courses that meet the demands of an ever-changing technological landscape.',
    ],
    stats: [
      { label: "Past Events", value: "40+", icon: "CalendarCheck" },
      { label: "Members", value: "60+", icon: "Users" },
      { label: "Active Committees", value: "5", icon: "Layers" },
    ],
    // mission:
    //   "The Institute of Electrical and Electronics Engineers (IEEE) is dedicated to advancing technology for the benefit of humanity.",
    // vision:
    //   "To create a world where technology is a key driver for societal progress, promoting sustainable development and enhancing the quality of life for people worldwide.",
    objectivesTitle: "Objectives of IEEE-KSV SB",
    // objectivesSubtitle: "Dedicated to advancing technology and fostering a global community of technical professionals.",
    objectives: [
      {
        title: "Advancing Technology",
        description:
          "Foster technological innovation and excellence for the benefit of humanity.",
      },
      {
        title: "Career Development",
        description:
          "Offer comprehensive resources for professional development, including workshops, mentorship programs, and access to industry insights.",
      },
      {
        title: "Standards Development",
        description:
          "Establish globally recognized industry standards to ensure interoperability and quality.",
      },
      {
        title: "Professional Growth",
        description:
          "Support engineers and technologists in their professional and career growth.",
      },
      {
        title: "Community Engagement",
        description:
          "Encourage collaboration and engagement within the technical and scientific community.",
      },
      {
        title: "Ethical Responsibility",
        description:
          "Promote ethical conduct and responsibility in the use of technology.",
      },
      {
        title: "Collaboration",
        description:
          "Foster partnerships that drive innovation through collaborative efforts.",
      },
      {
        title: "Research & Development",
        description:
          "Initiate projects that enhance technological advancements through dedicated research and development.",
      },
      {
        title: "Networking & Connectivity",
        description:
          "Enable collaboration and knowledge exchange within the technical community.",
      },
    ],
    // features: [
    //     "Humanitarian Technology",
    //     "Professional Networking",
    //     "Skill Development",
    //     "Research Publications",
    //     "Global Collaboration"
    // ],
    advantages: [
      {
        title: "Global Network",
        description:
          "Connect with a diverse community of over 400,000 members spanning 160 countries.",
      },
      {
        title: "Knowledge Exchange",
        description:
          "Access a wealth of cutting-edge research, publications and conferences.",
      },
      {
        title: "Professional Development",
        description:
          "Benefit from a wide array of continuing education programs and workshops.",
      },
      {
        title: "Industry Standards",
        description:
          "Contribute to and stay updated on internationally recognized technical standards.",
      },
      {
        title: "Innovation Hub",
        description:
          "Engage in collaborative projects and initiatives that shape the future of technology.",
      },
      {
        title: "Ethical Leadership",
        description:
          "Promote responsible technological advancement and professional integrity.",
      },
      {
        title: "Resource Access",
        description:
          "Utilize an extensive digital library containing millions of technical documents.",
      },
      {
        title: "Recognition",
        description:
          "Gain prestige through IEEE's renowned awards, fellowships and certifications.",
      },
      {
        title: "Networking Opportunities",
        description:
          "Participate in local and international events, conferences and symposia.",
      },
    ],
    execomTitle: "Executive Committee – IEEE KSV",
    execomSubtitle:
      "Meet the student leaders driving innovation and collaboration across IEEE chapters.",
    execom: [
      {
        name: "Yash Kumavat",
        role: "Chairperson",
        group: "IEEE KSV SB",
        image: "/students/Yash Kumavat.jpeg",
        linkedin: "https://www.linkedin.com/in/yash-kumavat-503a6a326/",
        email: "yashnkumavat2005@gmail.com",
      },
      {
        name: "Antra Gajjar",
        role: "Vice Chair",
        group: "IEEE KSV SB",
        image: "/students/Gajjar Antra Ashvinkumar.jpeg",
        linkedin: "https://www.linkedin.com/in/antra-gajjar-957977330/",
        email: "gajjarantra03@gmail.com",
      },
      {
        name: "Rudr Halvadiya",
        role: "Secretary",
        group: "IEEE KSV SB",
        image: "/students/Halvdadiya Rudr.jpeg",
        linkedin: "https://www.linkedin.com/in/rudr-halvadiya",
        email: "rudrhalvadiya2000@gmail.com",
      },
      {
        name: "Dev Kansara",
        role: "Treasurer",
        group: "IEEE KSV SB",
        image: "/students/Kansara Dev Dharmeshkumar.jpeg",
        linkedin: "https://www.linkedin.com/in/dev-kansara-37b37037a/",
        email: "kansaradev95@gmail.com",
      },
      {
        name: "Chrisha Dabhi",
        role: "Webmaster",
        group: "IEEE KSV SB",
        image: "/students/Dabhi Chrisha Manish.png",
        linkedin: "https://www.linkedin.com/in/chrishadabhi",
        email: "chrishaadabhii0704@gmail.com",
      },
      {
        name: "Aayush Pandya",
        role: "Chairperson",
        group: "IEEE KSV SPS",
        image: "/students/Pandya Aayush Viral.jpeg",
      },
      {
        name: "Harsh Parekh",
        role: "Vice Chair",
        group: "IEEE KSV SPS",
        image: "/students/Harsh Parekh.jpeg",
      },
      {
        name: "Yajurshi Velani",
        role: "Secretary",
        group: "IEEE KSV SPS",
        image: "/students/Yajurshi Velani.png",
      },
      {
        name: "Pragati Varu",
        role: "Treasurer",
        group: "IEEE KSV SPS",
        image: "/students/Pragati Varu.jpeg",
      },
      {
        name: "Jenish Sorathiya",
        role: "Webmaster",
        group: "IEEE KSV SPS",
        image: "/students/Jenish Sorathiya.jpeg",
      },
      {
        name: "Riyaben Solanki",
        role: "Chairperson",
        group: "IEEE KSV WIE",
        image: "/students/Riya Solanki IEEE.png",
      },
      {
        name: "Divya Balchandani",
        role: "Vice-Chair",
        group: "IEEE KSV WIE",
        image: "/students/Divya Balchandani.png",
      },
      {
        name: "Honey Modha",
        role: "Secretary",
        group: "IEEE KSV WIE",
        image: "/students/Honey Modha.jpeg",
      },
      {
        name: "Banshari Patel",
        role: "Treasurer",
        group: "IEEE KSV WIE",
        image: "/students/Patel Banshari Rahulkumar.jpg",
      },
      {
        name: "Mahi Parmar",
        role: "Webmaster",
        group: "IEEE KSV WIE",
        image: "/students/Parmar Mahi Nitinchandra.jpeg",
      },
    ],
    // execomPhoto: ieeeExecomPhoto,
    contact: {
      address:
        "LDRP-ITR Campus, Kadi Sarva Vishwavidyalaya, Sector-15, KH-5, Gandhinagar-382015, Gujarat, India",
      email: "ieeeksv@ksv.ac.in",
      // phone: "+91 9408801690",
      linkedin:
        "https://www.linkedin.com/company/ieee-student-branch-ksv/posts/?feedView=all",
      mapEmbed:
        "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  },
};
