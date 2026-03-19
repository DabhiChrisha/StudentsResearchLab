import svkmLogo from "../assets/svkm.png";
import ksvLogo from "../assets/KSV Logo.png";
import mmpsrpcLogo from "../assets/MMPSRPC Logo.png";
import ksvCampus from "../assets/ksv_campus.jpg";
import mmpsrpcCampus from "../assets/mmpsrpc_campus.jpeg";
import svkmCampus from "../assets/svkm_campus.jpg";
import chhaganbhaPhoto from "../assets/pujya_chhaganbha.jpg";
import shriManeklal from "../assets/shri_maneklal_patel.jpg";
import chairmanPhoto from "../assets/chairman.png";
import mamPhoto from "../assets/Dr.Himani Trivedi Ma'am.png";

export const organizationData = {
    "svkm": {
        title: "Sarva Vidyalaya Kelavani Mandal",
        subtitle: "કર ભલા હોગા ભલા.",
        image: svkmLogo,
        heroImage: svkmCampus,
        website: "https://svkm.org.in/",
        description: [
            `Sarva Vidyalaya Kelavani Mandal (SVKM) was founded in 1919 by the visionary philanthropist Pujya Chhaganbha, whose guiding philosophy, "કર ભલા, હોગા ભલા" (Do good, and good will come), continues to inspire the institution’s enduring legacy of education and service. From its humble beginnings with just six students, SVKM has evolved into a vast educational network that today nurtures the academic aspirations of over 54,000 students across Kadi and Gandhinagar. With a prestigious history spanning over 106 years, SVKM stands as one of India's oldest and most respected educational trusts, operating a diverse range of institutions including CBSE and GSEB schools, as well as undergraduate, graduate, and doctoral programs in fields such as engineering, sciences, management, arts, and healthcare. Driven by the core principles of innovation, entrepreneurship, and academic rigor, the Mandal remains dedicated to fostering holistic development and excellence for its students, faculty, and society at large.`
        ],
        stats: [
            { label: "Years of Legacy", value: "100+" },
            { label: "Institutions", value: "120+" },
            { label: "Students", value: "50,000+" },
            { label: "Campuses", value: "5+" }
        ],
        mission: "Our mission is to provide quality, value-based, and affordable education to all, with a profound commitment to the underprivileged, while fostering the holistic development of our students and the betterment of society.",
        vision: "To be a distinguished center of excellence that instills confidence and dynamism in our students, transforming them into globally sustainable icons who contribute meaningfully to the upliftment of their communities and the world.",
        founders: [
            {
                name: "Pujya Chhaganbha",
                image: chhaganbhaPhoto,
                quote: "કર ભલા હોગા ભલા."
            },
            {
                name: "Shri Maneklal M. Patel",
                image: shriManeklal,
                quote: "શિક્ષણ એ જ સાચી સેવા છે."
            }
        ],
        features: [
            "Philanthropic Legacy Since 1919",
            "Value-Based Education",
            "Inclusive & Affordable",
            "From KG to PG & PhD",
            "Focus on Women's Education"
        ],
        contact: {
            address: "Sarva Vidyalaya Campus, Behind Railway Station, Kadi - 382715, Gujarat, India",
            email: "info@svkm.org.in",
            phone: "+91 2764 242996",
            mapEmbed: "https://maps.google.com/maps?q=Sarva+Vidyalaya+Campus+Kadi&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    },
    "ksv": {
        title: "Kadi Sarva Vishwavidyalaya",
        subtitle: "કર ભલા હોગા ભલા.",
        image: ksvLogo,
        heroImage: ksvCampus,
        website: "https://ksv.ac.in/",
        description: [
            "Kadi Sarva Vishwavidyalaya (KSV) was established in May 2007 under the Gujarat State Government Act 21 of 2007 and is recognized by the University Grants Commission (UGC). Founded by Sarva Vidyalaya Kelavani Mandal (SVKM), a philanthropic trust with over 106 years of legacy guided by the principle 'Kar Bhala, Hoga Bhala' (Do good, and good will come), the university is dedicated to providing inclusive, value-based education to students from all sections of society. The university's growth was significantly strengthened by the visionary leadership of Late Shri Maneklal M. Patel, under whom the Gandhinagar and Kadi campuses and their constituent colleges were unified in March 2012 under the umbrella of KSV. Today, with 23+ constituent colleges and departments across its campuses, KSV offers contemporary, need-based programs while promoting research, innovation, and holistic development for societal and economic advancement."
        ],
        stats: [
            { label: "Acre Campus", value: "100+" },
            { label: "Institutes", value: "30+" },
            { label: "Teachers", value: "5000+" },
            { label: "Students", value: "50000+" }
        ],
        mission: "To deliver need-based education relevant to contemporary times, promote excellence in research and innovation, and cultivate an inclusive and welcoming environment for all students.",
        vision: "To be a leading university that provides quality education and research opportunities to students from all backgrounds, contributing significantly to the social, economic, and cultural development of society.",
        features: [
            "UGC Approved University",
            "Inclusive & Equitable Education",
            "Research-Driven Curriculum",
            "State-of-the-Art Infrastructure",
            "Strong Industry Linkages"
        ],
        contact: {
            address: "Sector-15, Gandhinagar - 382015, Gujarat, India.",
            email: "info@ksv.ac.in",
            phone: "+91 94090 35835",
            linkedin: "https://www.linkedin.com/school/kadi-sarva-vishwavidyalaya-gandihnagar/",
            mapEmbed: "https://maps.google.com/maps?q=Kadi+Sarva+Vishwavidyalaya+Kadi+Campus&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    },
    "mmpsrpc": {
        title: "M. M. Patel Students Research Project Cell",
        subtitle: "For the students, By the students, Of the students!",
        website: "https://www.mmpsrpc.in/",
        image: mmpsrpcLogo,
        heroImage: mmpsrpcCampus,
        description: [
            "M. M. Patel Students Research Project Cell (MMPSRPC) was founded with the vision of fostering a strong research culture and academic excellence among students at KSV University. It was created as a dynamic platform to encourage young minds to explore research, innovation, and interdisciplinary learning while actively contributing to the academic community. Since its inception, MMPSRPC has evolved from a small group of motivated students into a vibrant and collaborative community of researchers, mentors, and faculty members. Driven by a commitment to nurturing talent and promoting meaningful research, the cell continues to empower students to think critically, innovate, and push the boundaries of knowledge."
        ],
        stats: [
            { label: "Ongoing Projects", value: "17+" },
            { label: "Students Researchers", value: "65+" },
            { label: "Publications", value: "2+" }
        ],
        mission: "Empowering student researchers through comprehensive grant support and funding initiatives to drive innovation and scientific discovery.",
        vision: "Shaping the future of research through student-led innovation and global collaboration.",
        leadership: [
            {
                role: "",
                header: "Message from Hon. Chairman Sir",
                name: "Shri Vallabhbhai M. Patel",
                designation: "Chairman, Sarva Vidyalaya Kelvani Mandal, Kadi & Gandhinagar. President, Kadi Sarva Vishwavidyalaya Gandhinagar.",
                image: chairmanPhoto,
                cardQuote: "Knowledge is valuable, but wisdom with compassion, that's what truly builds a better tomorrow.",
                mainQuote: "Optimism, tradition, inclusiveness, service, compassion, tolerance, hope, and faithfulness are the underpinnings of Sarva Vidyalaya Kelvani Mandal for decades now.",
                message: [
                    "With the objective of providing education to one and all, our trust has been managing various educational institutions from Pre-Primary to University level. The M. M. Patel Students Research Project Cell is a testament to our commitment to fostering innovation and research among our students.",
                    "My vision is to serve every student of KSV in every possible better way, ensuring academic and personal growth. I am dedicated to supporting and nurturing careers, believing in the power of education to transform lives and communities, making education accessible and inclusive for all."
                ]
            },
            {
                header: "Message from Head of MMPSRPC, KSV",
                name: "Dr. Himani Trivedi",
                designation: "Head of M. M. Patel Students Research Project Cell",
                image: mamPhoto,
                cardQuote: "Growth comes from steady effort, continuous learning, and discipline.",
                mainQuote: "Aspirations, curiosity, excellence, and dedication form the foundation of the Students Research Project Cell. For the students, By the students, Of the students!",
                message: [
                    "Dedicated to fostering the growth of KSV students, the M. M. Patel Students Research Project Cell upholds a strong commitment to academic excellence. The Students Research Cell empowers skill development through meaningful activities and opportunities that strengthen knowledge and growth of students. This guidance and support helps students to succeed in their future careers and make valuable contribution to the society."
                ]
            }
        ],
        objectivesTitle: "Goals",
        objectivesSubtitle: "Cultivate a dynamic environment that inspires and supports student-driven research initiatives.",
        objectives: [
            {
                title: "Nurture Fund Support",
                description: "Create a welcoming environment that facilitates access to funds essential for students to pursue their research initiatives, high-impact research publications in top-tier journals across various disciplines."
            },
            {
                title: "Ensure Resource Accessibility",
                description: "Make essential tools and materials readily available to empower students in the exploration of innovative ideas."
            },
            {
                title: "Foster Inclusive Opportunities",
                description: "Promote diversity by ensuring all students are welcomed and supported in their research endeavours."
            },
            {
                title: "Assist with Research Dissemination",
                description: "Offer support for students in navigating the publishing process and securing patents."
            },
            {
                title: "Encourage Collaboration",
                description: "Cultivate a collaborative environment that encourages interdisciplinary projects, enhancing the quality of research."
            },
            {
                title: "Recognize and Celebrate Achievements",
                description: "Acknowledge and celebrate each research milestone to foster a culture of appreciation and motivation."
            }
        ],
        contact: {
            address: "LDRP Campus, Sector-15, KH-5, Gandhinagar - 382015, Gujarat, India",
            email: "mmpsrpc@ksv.ac.in",
            linkedin: "https://www.linkedin.com/company/mmpsrpc",
            mapEmbed: "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    },
    "ieee": {
        title: "IEEE Student Branch\nKadi Sarva Vishwavidyalaya",
        subtitle: "Empowering Students through Innovation and Leadership",
        image: "https://ieee-ksv-sb.mmpsrpc.in/Pasted-Graphic.svg",
        heroImage: ksvCampus,
        website: "https://ieee-ksv-sb.mmpsrpc.in/",
        sections: {
            intro: [
                "The KSV IEEE Student Branch, established under the esteemed guidance of Kadi Sarva Vishwavidyalaya (KSV), has emerged as a premier hub for technological innovation, professional growth, and cutting-edge research. Serving a diverse community of students across more than 25 colleges under the KSV umbrella, the branch was founded to cultivate a vibrant culture of research, creativity, and interdisciplinary collaboration. Since its inception, it has evolved into an essential pillar of the university’s mission, driving excellence in engineering and technology education. By bridging the gap between academic theory and industry practice, the KSV IEEE Student Branch empowers the next generation of engineers to become global innovators and leaders in an ever-evolving digital landscape.",
                "Guided by the core global principle of 'Advancing Technology for Humanity,' the KSV IEEE Student Branch aligns seamlessly with the university's ethos of delivering purposeful, need-based education. By offering contemporary courses and hands-on technical opportunities, the branch bridges the gap between traditional learning and the demands of an ever-changing technological landscape. This synergy ensures that students are not only academically proficient but also equipped with the innovative mindset required to solve real-world challenges. As a vital extension of KSV’s mission, the IEEE Student Branch remains committed to empowering future professionals who are ready to lead and contribute to the global advancement of technology."
            ],
            mission: [
                "The Institute of Electrical and Electronics Engineers (IEEE) is dedicated to advancing technology for the benefit of humanity, serving as a global catalyst for innovation and excellence in engineering and applied sciences. The organization’s vision is to foster a world where technology acts as a primary driver for societal progress, promoting sustainable development and significantly enhancing the quality of life for people worldwide. By upholding the highest standards of academic and professional rigor, IEEE inspires a global community of thinkers and doers to collaborate on solutions that address the world’s most pressing challenges, ensuring that technical advancement always aligns with the greater good of society.",
                "Through its expansive global network, comprehensive educational initiatives, and commitment to pioneering innovation, IEEE empowers professionals to transcend the conventional limits of technological advancement. By providing access to world-class resources and a community of experts, the organization facilitates the pursuit of technical breakthroughs while ensuring that every advancement is guided by the most rigorous ethical standards. This framework is designed to cultivate a generation of practitioners who are not only technically proficient but are also deeply committed to the responsible and sustainable evolution of the global technological landscape."
            ],
            activities: [
                "Since its inception, the IEEE KSV Student Branch has established itself as a premier leader in orchestrating a diverse array of high-impact technical symposiums, specialized workshops, and scholarly seminars across the critical disciplines of Computer Science, Electronics, Electrical Engineering, and Information Technology. By curating a portfolio of flagship initiatives—including technical paper presentations, project exhibitions, advanced coding competitions, and intensive hackathons—the branch provides a sophisticated platform for students to demonstrate their technical prowess and engage in creative, interdisciplinary collaboration. These engagements foster a rigorous culture of healthy competition and provide indispensable hands-on experience with the latest global technology trends, effectively bridging the gap between theoretical academic concepts and real-world application. Through this dedicated focus on innovation and excellence, the branch empowers its members to transcend traditional boundaries, thoroughly preparing them for distinguished careers at the vanguard of engineering and transformative research."
            ],
            impact: [
                "The IEEE KSV Student Branch serves as a vital conduit between academia and the global technology sector, fostering robust industry synergies by hosting distinguished experts from leading corporations and premier research institutions. These high-level engagements are meticulously designed to augment student employability while providing deep insights into the rapidly evolving demands of the modern industrial landscape. Beyond professional networking, the branch is a steadfast advocate for scholarly excellence, actively mentoring students as they navigate the complexities of research and publication within IEEE-indexed conferences and journals. By empowering students to contribute to the global body of technical knowledge, the branch significantly elevates the stature of Kadi Sarva Vishwavidyalaya as a distinguished hub of innovation, research, and transformative engineering leadership.",
                "Aligned with the core values of Kadi Sarva Vishwavidyalaya (KSV) and its commitment to profound social responsibility, the branch orchestrates strategic initiatives designed to bridge the digital divide and empower underserved communities. These efforts include high-impact digital literacy workshops and the development of bespoke technological solutions tailored to address critical local challenges. By actively promoting STEM education and fostering an environment of inclusive innovation, the branch demonstrates a steadfast dedication to the global IEEE mission of Advancing Technology for Humanity. These humanitarian endeavors ensure that the technical expertise cultivated within our laboratories is translated into tangible societal progress, reinforcing our role as a catalyst for both engineering excellence and global well-being."
            ]
        },
        description: [
            "The IEEE KSV Student Branch, established under the esteemed guidance of Kadi Sarva Vishwavidyalaya (KSV), stands as a premier epicenter for technological innovation, professional development, and scholarly research. Serving a diverse academic community across more than 25 constituent colleges under the expansive KSV umbrella, the branch was founded with a strategic vision to cultivate a robust culture of interdisciplinary research and creative collaboration. Since its inception, it has rapidly evolved into an indispensable component of the university’s broader commitment to excellence in engineering and technological education. By fostering an environment where academic theory and practical innovation converge, the branch empowers the next generation of engineers to push the boundaries of modern science and contribute meaningfully to the global research landscape.",
            "Guided by the fundamental global principle of 'Advancing Technology for Humanity, '' the IEEE KSV Student Branch aligns seamlessly with the core ethos of Kadi Sarva Vishwavidyalaya (KSV). This synergy is characterized by a shared commitment to providing need-based, high-impact education and curating contemporary curricula designed to address the complexities of an ever-evolving technological landscape. By integrating these international standards into the local academic framework, the branch serves as a critical bridge between scholarly theory and industrial demand. This ensures that the student community is not only technically proficient but also strategically positioned to navigate and lead within the dynamic frontiers of modern engineering and transformative research."
        ],
        stats: [
            { label: "Past Events", value: "32+" },
            { label: "Members", value: "94+" },
            { label: "Upcoming Events", value: "2+" }
        ],
        mission: "IEEE is committed to advancing technology for the benefit of humanity by fostering innovation and excellence in engineering and applied sciences. Through collaboration, education, and research, it empowers individuals to push technological boundaries while upholding strong ethical standards. The KSV IEEE Student Branch supports this mission by creating opportunities for student growth, leadership, and innovation.",
        vision: "To create a future where students harness technology, research, and innovation to drive societal progress, promote sustainable development, and enhance quality of life through impactful engineering solutions.",
        objectivesTitle: "Objectives of IEEE-KSV SB",
        // objectivesSubtitle: "Dedicated to advancing technology and fostering a global community of technical professionals.",
        objectives: [
            { title: "Advancing Technology", description: "Foster technological innovation and excellence for the benefit of humanity." },
            { title: "Career Development", description: "Offer comprehensive resources for professional development, including workshops, mentorship programs, and access to industry insights." },
            { title: "Standards Development", description: "Establish globally recognized industry standards to ensure interoperability and quality." },
            { title: "Professional Growth", description: "Support engineers and technologists in their professional and career growth." },
            { title: "Community Engagement", description: "Encourage collaboration and engagement within the technical and scientific community." },
            { title: "Ethical Responsibility", description: "Promote ethical conduct and responsibility in the use of technology." },
            { title: "Collaboration", description: "Foster partnerships that drive innovation through collaborative efforts." },
            { title: "Research & Development", description: "Initiate projects that enhance technological advancements through dedicated research and development." },
            { title: "Networking & Connectivity", description: "Enable collaboration and knowledge exchange within the technical community." }
        ],
        advantages: [
            { title: "Global Network", description: "Connect with a diverse community of over 400,000 members spanning 160 countries." },
            { title: "Knowledge Exchange", description: "Access a wealth of cutting-edge research, publications, and conferences." },
            { title: "Professional Development", description: "Benefit from a wide array of continuing education programs and workshops." },
            { title: "Industry Standards", description: "Contribute to and stay updated on internationally recognized technical standards." },
            { title: "Innovation Hub", description: "Engage in collaborative projects and initiatives that shape the future of technology." },
            { title: "Ethical Leadership", description: "Promote responsible technological advancement and professional integrity." },
            { title: "Resource Access", description: "Utilize an extensive digital library containing millions of technical documents." },
            { title: "Recognition", description: "Gain prestige through IEEE's renowned awards, fellowships, and certifications." },
            { title: "Networking Opportunities", description: "Participate in local and international events, conferences, and symposia." }
        ],
        execomTitle: "Executive Committee – IEEE KSV",
        execomSubtitle: "Meet the student leaders driving innovation and collaboration across IEEE chapters.",
        execom: [
            { name: "Yash Kumavat", role: "Chairperson", group: "IEEE KSV SB", image: "/students/Yash Kumavat.jpeg", linkedin: "https://www.linkedin.com/in/yash-kumavat-503a6a326/", email: "yashnkumavat2005@gmail.com" },
            { name: "Antra Gajjar", role: "Vice Chair", group: "IEEE KSV SB", image: "/students/Gajjar Antra Ashvinkumar.jpeg", linkedin: "https://www.linkedin.com/in/antra-gajjar-957977330/", email: "gajjarantra03@gmail.com" },
            { name: "Rudr Halvadiya", role: "Secretary", group: "IEEE KSV SB", image: "/students/Halvdadiya Rudr.jpeg", linkedin: "https://www.linkedin.com/in/rudr-halvadiya", email: "rudrhalvadiya2000@gmail.com" },
            { name: "Dev Kansara", role: "Treasurer", group: "IEEE KSV SB", image: "/students/Kansara Dev Dharmeshkumar.jpeg", linkedin: "https://www.linkedin.com/in/dev-kansara-37b37037a/", email: "kansaradev95@gmail.com" },
            { name: "Chrisha Dabhi", role: "Webmaster", group: "IEEE KSV SB", image: "/students/Dabhi Chrisha Manish.png", linkedin: "https://www.linkedin.com/in/chrishadabhi", email: "chrishaadabhii0704@gmail.com" },
            { name: "Aayush Pandya", role: "Chairperson", group: "IEEE KSV SPS", image: "/students/Pandya Aayush Viral.jpeg" },
            { name: "Harsh Parekh", role: "Vice Chair", group: "IEEE KSV SPS", image: "/students/Harsh Parekh.jpeg" },
            { name: "Yajurshi Velani", role: "Secretary", group: "IEEE KSV SPS", image: "/students/Yajurshi Velani.png" },
            { name: "Pragati Varu", role: "Treasurer", group: "IEEE KSV SPS", image: "/students/Pragati Varu.jpeg" },
            { name: "Jenish Sorathiya", role: "Webmaster", group: "IEEE KSV SPS", image: "/students/Jenish Sorathiya.jpeg" },
            { name: "Riyaben Solanki", role: "Chairperson", group: "IEEE KSV WIE", image: "/students/Riya Solanki IEEE.png" },
            { name: "Divya Balchandani", role: "Vice-Chair", group: "IEEE KSV WIE", image: "/students/Divya Balchandani.png" },
            { name: "Honey Modha", role: "Secretary", group: "IEEE KSV WIE", image: "/students/Honey Modha.jpeg" },
            { name: "Banshari Patel", role: "Treasurer", group: "IEEE KSV WIE", image: "/students/Patel Banshari Rahulkumar.jpg" },
            { name: "Mahi Parmar", role: "Webmaster", group: "IEEE KSV WIE", image: "/students/Parmar Mahi Nitinchandra.jpeg" }
        ],
        contact: {
            address: "LDRP-ITR Campus, Kadi Sarva Vishwavidyalaya, Sector-15, KH-5, Gandhinagar-382015, Gujarat, India",
            email: "ieeeksv@ksv.ac.in",
            phone: "+91 9408801690",
            linkedin: "https://www.linkedin.com/company/ieee-student-branch-ksv/posts/?feedView=all",
            mapEmbed: "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    }
};
