import svkmLogo from "../assets/svkm.png";
import ksvLogo from "../assets/KSV Logo.png";
import mmpsrpcLogo from "../assets/MMPSRPC Logo.png";
import chhaganbhaPhoto from "../assets/pujya_chhaganbha.jpg";
import shriManeklal from "../assets/shri_maneklal_patel.jpg";
import chairmanPhoto from "../assets/chairman.png";
// import mamPhoto from "../assets/Ma'am Photo.png";

export const organizationData = {
    "svkm": {
        title: "Sarva Vidyalaya Kelavani Mandal",
        subtitle: "કર ભલા હોગા ભલા.",
        image: svkmLogo,
        website: "https://svkm.org.in/",
        description: [
            "Sarva Vidyalaya Kelavani Mandal (SVKM) was founded in 1919 by the visionary philanthropist Pujya Chhaganbha, whose guiding philosophy, 'કર ભલા, હોગા ભલા' (Do good, and good will come), continues to inspire the institution's journey in education and service. From its humble beginning with just six students, SVKM has grown into a vast educational network, now nurturing the academic aspirations of over 54,000 students across Kadi and Gandhinagar."
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
            email: "mail@svim.ac.in",
            phone: "+91 2764 242996",
            mapEmbed: "https://maps.google.com/maps?q=Sarva+Vidyalaya+Campus+Kadi&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    },
    "ksv": {
        title: "Kadi Sarva Vishwavidyalaya",
        subtitle: "કર ભલા હોગા ભલા.",
        image: ksvLogo,
        website: "https://ksv.ac.in/",
        description: [
            "Kadi Sarva Vishwavidyalaya (KSV) was established in May 2007 under the Gujarat State Government Act 21 of 2007 and is recognized by the University Grants Commission (UGC). Founded by Sarva Vidyalaya Kelavani Mandal (SVKM), a philanthropic trust with over 105 years of legacy guided by the principle 'Kar Bhala, Hoga Bhala' (Do good, and good will come), the university is dedicated to providing inclusive, value-based education to students from all sections of society.The university's growth was significantly strengthened by the visionary leadership of Late Shri Maneklal M. Patel, under whom the Gandhinagar and Kadi campuses and their constituent colleges were unified in March 2012 under the umbrella of KSV. Today, with 23+ constituent colleges and departments across its campuses, KSV offers contemporary, need-based programs while promoting research, innovation, and holistic development for societal and economic advancement."
        ],
        stats: [
            { label: "Acre Campus", value: "100+" },
            { label: "Institutes", value: "30+" },
            { label: "Teachers", value: "5000+" },
            { label: "Students", value: "50000+" }
        ],
        mission: "To deliver need-based education relevant to contemporary times, promote excellence in research and innovation, and cultivate an inclusive and welcoming environment for all students.",
        vision: "To be a leading university that provides quality education and research opportunities to students from all backgrounds, contributing significantly to the social, economic, and cultural development of society.",
        founders: [
            {
                name: "Chhaganbhai Patel",
                image: chairmanPhoto, // Using available chairman photo as placeholder if specific KSV founder not available
                quote: "કર ભલા હોગા ભલા."
            }
        ],
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
        description: [
            "Established in 2024, the M. M. Patel Students Research Project Cell (MMPSRPC) was founded with the vision of fostering a strong research culture and academic excellence among students at KSV University. It was created as a dynamic platform to encourage young minds to explore research, innovation, and interdisciplinary learning while actively contributing to the academic community.Since its inception, MMPSRPC has evolved from a small group of motivated students into a vibrant and collaborative community of researchers, mentors, and faculty members. Driven by a commitment to nurturing talent and promoting meaningful research, the cell continues to empower students to think critically, innovate, and push the boundaries of knowledge."
        ],
        stats: [
            { label: "Ongoing Projects", value: "17+" },
            { label: "Students Researchers", value: "65+" },
            { label: "Publications", value: "2+" }
        ],
        mission: "Empowering student researchers through comprehensive grant support and funding initiatives to drive innovation and scientific discovery.",
        vision: "Shaping the future of research through student-led innovation and global collaboration.",
        // founders: [
        //     {
        //         name: "Dr. Himani Trivedi",
        //         image: mamPhoto,
        //         quote: "Discipline builds excellence."
        //     }
        // ],
        objectives: [
            {
                title: "Research Excellence",
                description: "Foster a culture of high-quality research and innovation among students."
            },
            {
                title: "Critical Thinking",
                description: "Develop analytical and critical thinking skills essential for groundbreaking research."
            },
            {
                title: "Collaborative Research",
                description: "Promote interdisciplinary collaboration and teamwork in research projects."
            },
            {
                title: "Innovation Catalyst",
                description: "Stimulate cutting-edge ideas and transform them into impactful research outcomes."
            },
            {
                title: "Problem Solving",
                description: "To equip students with advanced problem-solving skills for tackling complex research challenges."
            },
            {
                title: "Research Grant",
                description: "Provide support and guidance for securing research grants and funding opportunities."
            },
            {
                title: "Industry Linkages",
                description: "Strengthen relationships between student researchers and industry through consultancy projects, workshops, and collaborative innovations."
            },
            {
                title: "Knowledge Dissemination",
                description: "Assist students in publishing research papers, presenting findings at conferences, and contributing to the academic community."
            }
        ],
        contact: {
            address: "LDRP Campus, Sector-15, KH-5, Gandhinagar - 382015, Gujarat, India",
            email: "mmpsrc.ksv@gmail.com",
            phone: "+91 079-232-44690",
            mapEmbed: "https://maps.google.com/maps?q=LDRP+Institute+of+Technology+and+Research+Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
        }
    }
};
