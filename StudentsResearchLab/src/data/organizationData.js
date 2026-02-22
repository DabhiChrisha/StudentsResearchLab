import svkmLogo from "../assets/svkm.png";
import ksvLogo from "../assets/KSV Logo.png";
import mmpsrpcLogo from "../assets/MMPSRPC Logo.png";
import chairmanPhoto from "../assets/chairman.png";
import mamPhoto from "../assets/Ma'am Photo.png";

export const organizationData = {
    "svkm": {
        title: "SVKM",
        subtitle: "Shree Vile Parle Kelavani Mandal",
        image: svkmLogo,
        description: [
            "Shree Vile Parle Kelavani Mandal (SVKM) is a public charitable trust registered under the Society's Registration Act and Bombay Public Trust Act.",
            "From its humble beginnings in 1934, when it took over the Rashtriya Shala, a school established by the freedom fighters in the Vile Parle area, SVKM has grown into a prestigious educational brand.",
            "Today, it manages a large number of educational institutions in Mumbai and other cities, providing quality education from school to post-graduation levels."
        ],
        stats: [
            { label: "Founded", value: "1934" },
            { label: "Institutions", value: "30+" },
            { label: "Students", value: "50,000+" },
            { label: "Alumni", value: "100,000+" }
        ],
        mission: "To provide world-class education with a focus on holistic development and social responsibility.",
        vision: "To be a leading educational trust that shapes the future of the nation through excellence and innovation.",
        founders: [
            {
                name: "Hon'ble Chairman",
                image: chairmanPhoto,
                quote: "Education is the most powerful weapon which you can use to change the world."
            }
        ],
        goals: [
            "Providing qualitative and affordable education.",
            "Promoting research and development in all disciplines.",
            "Fostering entrepreneurship and innovation."
        ],
        features: [
            "Interdisciplinary Research",
            "Industry-Academia Collaboration",
            "State-of-the-art Infrastructure"
        ],
        contact: {
            address: "Vile Parle (West), Mumbai - 400 056, India.",
            email: "info@svkm.ac.in",
            phone: "+91 22 4219 9999",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.812328114946!2d72.8338!3d19.1097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c995!2sSVKM!5e0!3m2!1sen!2sin!4v1"
        }
    },
    "ksv": {
        title: "KSV",
        subtitle: "Kadi Sarva Vishwavidyalaya",
        image: ksvLogo,
        description: [
            "Kadi Sarva Vishwavidyalaya is a University established vide Gujarat State Government Act 21 of 2007 in May 2007 and approved by UGC.",
            "The University has been set up by Sarva Vidyalaya Kelavani Mandal, a trust with more than 100 years of philanthropic existence.",
            "The University is established to providing admissions and high-quality education to all students regardless of their backgrounds."
        ],
        stats: [
            { label: "Established", value: "2007" },
            { label: "Campuses", value: "2" },
            { label: "Programs", value: "50+" },
            { label: "Graduates", value: "20,000+" }
        ],
        mission: "To foster a community of scholars focused on innovation and academic rigor.",
        vision: "To become a world-renowned center for higher learning and research.",
        founders: [
            {
                name: "Chhaganbhai Patel",
                image: chairmanPhoto, // Using available chairman photo as placeholder if specific KSV founder not available
                quote: "Service to humanity is service to God."
            }
        ],
        goals: [
            "Integrating technology in education.",
            "Encouraging social responsibility.",
            "Developing global leaders."
        ],
        features: [
            "Excellence in Research",
            "Social Impact Initiatives",
            "Global Network"
        ],
        contact: {
            address: "Sector-15, Gandhinagar - 382015, Gujarat, India.",
            email: "info@ksv.ac.in",
            phone: "+91 79 2324 1492",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.43!2d72.63!3d23.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8!2sKSV!5e0!3m2!1sen!2sin!4v1"
        }
    },
    "mmpsrpc": {
        title: "MMPSRPC",
        subtitle: "M. M. Patel Students Research Project Cell",
        image: mmpsrpcLogo,
        description: [
            "M. M. Patel Students Research Project Cell (MMPSRPC) is the nodal center for research activities at Kadi Sarva Vishwavidyalaya.",
            "It was established with the sole objective of fostering a disciplined research culture among undergraduate and postgraduate students.",
            "The cell provides mentorship, funding, and resources for high-impact research projects."
        ],
        stats: [
            { label: "Active Projects", value: "100+" },
            { label: "Funded Research", value: "₹10L+" },
            { label: "Patents Filed", value: "10" },
            { label: "Mentors", value: "50+" }
        ],
        mission: "To transform students into rigorous researchers and innovative problem solvers.",
        vision: "To be the premier student research cell in the country.",
        founders: [
            {
                name: "Dr. Himani Trivedi",
                image: mamPhoto,
                quote: "Discipline builds excellence."
            }
        ],
        goals: [
            "Standardizing research methodology.",
            "Facilitating scholarly publications.",
            "Building a peer-review ecosystem."
        ],
        features: [
            "Guided Mentorship",
            "Research Ethics Training",
            "Publication Support"
        ],
        contact: {
            address: "LDRP-ITR, Sector-15, Gandhinagar - 382015, Gujarat.",
            email: "mmpsrc.ksv@gmail.com",
            phone: "+91 999 888 7777",
            mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.43!2d72.63!3d23.22!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8!2sLDRP!5e0!3m2!1sen!2sin!4v1"
        }
    }
};
