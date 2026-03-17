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
            "Sarva Vidyalaya Kelavani Mandal (SVKM) was founded in 1919 by the visionary philanthropist Pujya Chhaganbha, whose guiding philosophy, 'કર ભલા, હોગા ભલા' (Do good, and good will come), continues to inspire the institution's journey in education and service. From its humble beginning with just six students, SVKM has grown into a vast educational network, now nurturing the academic aspirations of over 54,000 students across Kadi and Gandhinagar. Sarva Vidyalaya Kelavani Mandal, with over 106 years of history, is one of India's oldest educational trusts. It operates schools across different levels and offers a wide range of programs, including CBSE and GSEB schools, as well as undergraduate, graduate, and doctoral studies in fields such as engineering, sciences, management, arts, and healthcare. Guided by core principles of innovation, entrepreneurship, academic rigor, and the humanities, SVKM focuses on fostering holistic development for students, faculty, and society."
        ],
        stats: [
            { label: "Years of Legacy", value: "100+" },
            { label: "Institutions", value: "120+" },
            { label: "Students", value: "50,000+" },
            { label: "Campuses", value: "5+" }
        ],
        mission: "To provide quality, value-based, and affordable education to all, especially the underprivileged, and to foster holistic development among students and society.",
        vision: "To be a distinguished institution that generates confidence and dynamism in students, creating globally sustainable icons who contribute to the upliftment of their communities.",
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
        // goals: [
        //     "Providing qualitative and affordable education.",
        //     "Promoting research and development in all disciplines.",
        //     "Fostering entrepreneurship and innovation."
        // ],
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
        // founders: [
        //     {
        //         name: "Chhaganbhai Patel",
        //         image: chairmanPhoto, // Using available chairman photo as placeholder if specific KSV founder not available
        //         quote: "કર ભલા હોગા ભલા."
        //     }
        // ],
        // goals: [
        //     "Integrating technology in education.",
        //     "Encouraging social responsibility.",
        //     "Developing global leaders."
        // ],
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
                // role: "Head of MMPSRPC, KSV",
                header: "Message from Head of MMPSRPC, KSV",
                name: "Dr. Himani Trivedi",
                designation: "Head of M. M. Patel Students Research Project Cell, KSV",
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
            email: "mmpsrc.ksv@gmail.com",
            phone: "+91 079-232-44690",
            mapEmbed: "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    },
    "ieee": {
        title: "IEEE KSV Student Branch",
        subtitle: "Advancing Technology for Humanity",
        image: "https://ieee-ksv-sb.mmpsrpc.in/Pasted-Graphic.svg", // Using the icon from the site
        heroImage: ksvCampus, // Placeholder to match KSV theme
        description: [
            "The IEEE KSV Student Branch is a vibrant community of passionate engineering students and professionals dedicated to advancing technological innovation and excellence for the benefit of humanity. Under the umbrella of the global IEEE network, our branch actively provides students with opportunities to engage in cutting-edge projects, attend technical conferences, and participate in skill-building workshops.",
            "Through collaborative initiatives, we connect academic learning with real-world applications, nurturing an environment where future leaders can develop their technical prowess and network with industry experts."
        ],
        stats: [
            { label: "Active Members", value: "120+" },
            { label: "Events Conducted", value: "45+" },
            { label: "Technical Workshops", value: "20+" }
        ],
        mission: "To inspire, educate, and empower university students to become outstanding leaders in the global engineering and technology sectors by providing robust networking and resource platforms.",
        vision: "To champion technological advancement and groundbreaking innovation across the academic campus and build an internationally recognized student branch.",
        leadership: [
            {
                role: "Branch Counselor",
                header: "Message from Branch Counselor",
                name: "Dr. Faculty Name",
                designation: "Branch Counselor, IEEE KSV Student Branch",
                image: chairmanPhoto, // Placeholder image matching existing theme
                cardQuote: "Innovation distinguishes between a leader and a follower.",
                mainQuote: "Fostering an environment of technological brilliance and collaborative growth for every engineering mind.",
                message: [
                    "The IEEE KSV Student Branch stands as a beacon for aspiring engineers to transcend traditional academic boundaries. We are committed to nurturing technical excellence, cultivating profound leadership skills, and offering unparalleled global exposure to our student community.",
                    "Through rigorous workshops, dynamic seminars, and collaborative projects, we empower students to not only understand emerging technologies but to become the pioneers who will shape the future."
                ]
            },
            {
                role: "Branch Chair",
                header: "Message from Branch Chair",
                name: "Student Leader Name",
                designation: "Chairperson, IEEE KSV Student Branch",
                image: mamPhoto, // Placeholder image matching existing theme
                cardQuote: "Driven by passion, united by technology.",
                mainQuote: "A vibrant community where academic knowledge seamlessly transitions into real-world technological solutions.",
                message: [
                    "Leading the IEEE KSV Student Branch is an extraordinary privilege. Our branch is built by the students, for the students, creating a thriving ecosystem of learning, networking, and innovation.",
                    "We continuously strive to host impactful events that bridge the gap between academia and industry, ensuring our members are well-prepared for the evolving demands of the global engineering landscape."
                ]
            }
        ],
        objectivesTitle: "Core Objectives",
        objectivesSubtitle: "Empowering students through technical excellence and leadership development.",
        objectives: [
            {
                title: "Technical Skill Enhancement",
                description: "Organize intensive workshops, coding bootcamps, and technical seminars to build proficiency in cutting-edge technologies."
            },
            {
                title: "Global Networking",
                description: "Facilitate connections with industry professionals, researchers, and fellow students across the global IEEE network."
            },
            {
                title: "Research and Innovation",
                description: "Encourage and support student-led research papers, technical projects, and participation in international conferences."
            },
            {
                title: "Professional Development",
                description: "Offer career guidance, resume building workshops, and leadership training to prepare students for corporate environments."
            },
            {
                title: "Community Outreach",
                description: "Conduct community-driven technological initiatives to apply engineering solutions for local societal challenges."
            },
            {
                title: "Hackathons and Competitions",
                description: "Regularly host and participate in national and international coding and engineering competitions."
            }
        ],
        features: [
            "Technical Workshops & Seminars",
            "Global Networking Opportunities",
            "Skill Development Programs",
            "Innovation & Research Focus",
            "Leadership Building"
        ],
        contact: {
            address: "LDRP Campus, Sector-15, KH-5, Gandhinagar - 382015, Gujarat, India",
            email: "ieee@ksv.ac.in",
            phone: "+91 079-232-44690",
            mapEmbed: "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    }
};
