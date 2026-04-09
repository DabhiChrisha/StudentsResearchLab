const fs = require('fs');
const path = require('path');

const achievementsData = {
    "AAYUSH VIRAL PANDYA": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "2nd Runner-Up Cognivia Hackathon Sampark'26",
            "InnovAItion Hackathon 2026, DAU Finalists",
            "ImpactThon 2025-26 Finalist",
            "AISEHack Hackathon Finalist",
            "OdooxGVP Hackathon 2026"
        ],
        "leadership": [
            "Treasurer, IEEE KSV SPS 2025",
            "Chair, IEEE KSV SPS 2026",
            "Coordinator, Website Committee, IEEE KSV SB 2026"
        ],
        "awards": [
            "2nd Runner-Up Cognivia Hackathon Sampark'26"
        ],
        "certifications": [
            "2nd Runner-Up Cognivia Hackathon Sampark'26"
        ]
    },
    "ARNAB GHOSH": {
        "semester": 6.0,
        "department": "CE",
        "institute": "VS-ITR",
        "organization": "SRL",
        "hackathons": [
            "Ideathon 2024-2025"
        ],
        "certifications": [
            "Poster Making KSV"
        ]
    },
    "CHAVADA YASHVI SURENDRASINH": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Ongoing Research Paper: An Optimized Hybrid Ensemble Machine Learning Framework for Employability Prediction using a Multi-Attribute Dataset",
            "AI Impact Summit 2026 Case Study: Niramai — Thermalytix: Privacy-Preserving AI for Breast Cancer Screening"
        ],
        "hackathons": [
            "Finalists at ImpactThon-2026",
            "Participated at ANRF-AISEHACK 2026",
            "Participated in Smart India Hackathon(2025)",
            "Participated in SSIP(2024)",
            "Participated in Bhartiya Antariksh Hackathon by ISRO 2024",
            "Finalists in DAU InnovAItion 2026",
            "Participated in Cognivia Hackathon of SAMPARK 2026(IEEE Gujarat Section)"
        ],
        "certifications": [
            "NPTEL-Programming in Java(Topper 1%)"
        ],
        "additionalAchievements": [
            "Coordinator in the Xenesis 2025"
        ]
    },
    "DABHI CHRISHA MANISH": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "1st Runner-Up – SAMPARK'25 Datathon, IEEE Gujarat Section",
            "GTU National Poster Presentation Finalist",
            "Finalist – InnovAItion Hackathon, Intuitive × Dhirubhai Ambani University",
            "ImpactThon 2025-26 @KSV Finalist",
            "AISEHack Hackathon Finalist"
        ],
        "leadership": [
            "Secretary, IEEE KSV SPS 2025",
            "Outreach Committee Member of SCR 2025",
            "Webmaster, IEEE KSV SB 2026"
        ],
        "awards": [
            "1st Runner-Up – SAMPARK'25 Datathon, IEEE Gujarat Section"
        ],
        "certifications": [
            "1st Runner-Up – SAMPARK'25 Datathon, IEEE Gujarat Section"
        ]
    },
    "DEVDA RACHITA BHARATSINH": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Ongoing Research Paper: An Optimized Hybrid Ensemble Machine Learning Framework for Employability Prediction using a Multi-Attribute Dataset"
        ],
        "hackathons": [
            "Semifinilist at ImpactThon-2026",
            "Participated at ANRF-AISEHACK 2026",
            "Participated in Smart India Hackathon(2024, 2025)",
            "Participated in SSIP(2024)",
            "Participated in Bhartiya Antariksh Hackathon by ISRO 2024",
            "Finalists in DAU InnovAItion 2026",
            "Participated in Cognivia Hackathon of SAMPARK 2026(IEEE Gujarat Section)",
            "Waitlisted in Smart India Hackathon(2024)"
        ],
        "certifications": [
            "NPTEL-Programming in Java(Topper 1%)"
        ],
        "additionalAchievements": [
            "Coordinator in the Xenesis 2025"
        ]
    },
    "GAJJAR ANTRA ASHVINKUMAR": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "AISEHack Hackathon Finalist",
            "ImpactThon Finalist",
            "InnovAItion - Shaping Future Innovators, DAU Finalists",
            "Participated in SSIP 2025",
            "Participated in SIH 2025",
            "Participated in SSIP 2024",
            "Participated in IEEE Intel Hackathon 2024"
        ],
        "leadership": [
            "Vice Chair, IEEE KSV SB"
        ],
        "certifications": [
            "ImpactThon Finalist",
            "InnovAItion - Shaping Future Innovators, DAU Finalists"
        ]
    },
    "GHETIYA POOJAN RAHULBHAI": {
        "semester": 2.0,
        "department": "CE - Masters",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "hackathons": [
            "IEEE Sampark 26 - Second Runner up",
            "Impactthon @KSV 2025 Hackathon Finalist",
            "Smart India Hackathon 2024 Winner"
        ],
        "internships": [
            "FullStack Developer Intern (Passdn Technologies) (March 24 - May 24)",
            "JavaScript Developer Intern (MealPe) (May 24 - Sept. 25)",
            "Software Engineer (MealPe) (Sept. 25 - Present)"
        ],
        "awards": [
            "Finalist - Laksh Season 5",
            "Winner - Laksh Season 6",
            "Finalist - Laksh Season 7"
        ],
        "additionalAchievements": [
            "UK–France Future Leaders Immersion Program 2025 – University of Kent (UK) & IESEG School of Management (France)"
        ]
    },
    "HENY PATEL": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Generative AI as a Catalyst in Indian Education Ecosystem"
        ],
        "certifications": [
            "NPTEL Python for Data Science",
            "Dau Hackathon Participation",
            "Impacthon Winner Certificate",
            "ISRO Hackathon Participation Certificate"
        ]
    },
    "HETVI HINSU": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Generative AI as a Catalyst in Indian Education Ecosystem"
        ],
        "hackathons": [
            "Winner - ImpactThon @ KSV 2025–26 (Track: Technologyfor Social Good and sustainable Process) — ₹50,000 prize",
            "Finalist - InnovAItion Hackathon by Intuitive & Dhirubhai Ambani University",
            "Shortlisted - AISEHack 2026 Finale at IIIT Hyderabad",
            "Participated in Cognivia Hackathon 2026",
            "Participated in Smart India Hackathon (2024, 2025)",
            "Participated SSIP (2023, 2024)",
            "Participated in ISRO Hackathon (2023, 2024)",
            "Participated in SBI Hackathon (2024)"
        ],
        "internships": [
            "Front End Web Development Intern(Aug2025- Sept2025)",
            "Research Intern AT IPR GANDHINAGAR (DEC-2025 to APRIL-2026)"
        ],
        "awards": [
            "Second Winner- Edunet Regional Showcase Event, Gujarat."
        ],
        "certifications": [
            "NPTEL- DBMS",
            "ImpacThon Winner Certificate",
            "EDUNET Foundation - Regional Event Certificate",
            "InnvoAItion -DAU Certificate"
        ],
        "additionalAchievements": [
            "Presented Bending Research Project at PAG MEETING-2026(PDEU, GANDHINAGAR)"
        ]
    },
    "HONEY MODHA": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Enhancing Data Mining Techniques for Identifying Health Risk Patterns in Underserved Populations (NASCENT MR 2025)"
        ],
        "hackathons": [
            "Participated in ImpactThon",
            "4th Runnerup at InnovAItion Hackathon by Intuitive & Dhirubhai Ambani University",
            "Shortlisted - AISEHack 2026 Finale at IIIT Hyderabad",
            "Participated in Cognivia Hackathon 2026",
            "Participated in Smart India Hackathon (2025)"
        ],
        "internships": [
            "Project Trainee at Institute for Plasma Research (December 2025 to March 2026)"
        ],
        "leadership": [
            "Secretary, IEEE KSV WIE Affinity Group 2025 and 2026",
            "Coordinator of Documentation and Report Committee 2026"
        ],
        "certifications": [
            "Impacthon Winner Certificate"
        ]
    },
    "JADEJA BHAGYASHREE VANRAJSINH": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "AISEHack26 Finalist"
        ],
        "leadership": [
            "Co-coordinator, Website Commitee, IEEE KSV SB"
        ]
    },
    "JANKI CHITRODA": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "AI Impact Summit 2026 Case Study: Niramai — Thermalytix: Privacy-Preserving AI for Breast Cancer Screening",
            "Ongoing Research Paper: An Optimized Hybrid Ensemble Machine Learning Framework for Employability Prediction using a Multi-Attribute Dataset"
        ],
        "hackathons": [
            "Finalists at ImpactThon-2026",
            "Participated at ANRF-AISEHACK 2026",
            "Participated in Smart India Hackathon(2025)",
            "Participated in SSIP(2024)",
            "Participated in Bhartiya Antariksh Hackathon by ISRO 2024",
            "Finalists in DAU InnovAItion 2026",
            "Participated in Cognivia Hackathon of SAMPARK 2026(IEEE Gujarat Section)",
            "Waitlisted in Smart India Hackathon(2024)"
        ],
        "internships": [
            "Completed Def-Space Winter Internship at BSERC (2026)"
        ],
        "certifications": [
            "ImpactThon Finalist Certificate (2025-2026)",
            "NPTEL-Programming in Java"
        ],
        "additionalAchievements": [
            "Coordinator in the Xenesis 2025"
        ]
    },
    "JENISH SORATHIYA": {
        "semester": 6.0,
        "department": "IT",
        "institute": "VS-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "2nd Runner-Up Cognivia Hackathon Sampark'26",
            "InnovAItion Hackathon 2026, DAU Finalists",
            "2nd Runner-Up ImpactThon 2025-26",
            "AISEHack Hackathon Finalist",
            "2 times Odoo Hackathon Finalist"
        ],
        "leadership": [
            "Webmaster, IEEE KSV SPS 2026",
            "SPOC 1, Website Committee, IEEE KSV SB 2026"
        ],
        "awards": [
            "2nd Runner-Up Cognivia Hackathon Sampark'26",
            "2nd Runner-Up ImpactThon 2025-26"
        ]
    },
    "KANDARP DIPAKKUMAR GAJJAR": {
        "semester": 8.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Publication: Fusing Retrieval Techniques for Enhanced Personalized Community Question Answering (PIRFIRE 2024)",
            "Patent: EcoSmart Dustbin for Automated Waste Segregation (Project Grant: ₹15,000)"
        ],
        "hackathons": [
            "OdooxGVP Hackathon 2026 - Runnerups",
            "InnovAItion Hackathon 2026 - 4th Runnerups",
            "SIH 2024 National Finalists",
            "SSIP 2023 - 2nd Runnerups",
            "SIH 2023 AIR 7"
        ],
        "internships": [
            "Research Assistant at MMPSRPC, KSV",
            "National Technical Research Organisation, Delhi (30K/Month Stipend)",
            "Institute for Plasma Research (Software Development Intern)"
        ],
        "leadership": [
            "Research Assistant, MMPSRPC, 2026",
            "Student Coordinator, ImpactThon@KSV 2025-2026",
            "Chairperson, IEEE LDRP-ITR Student Branch 2024",
            "Main Student Event Coordinator, Xenesis 2024"
        ],
        "certifications": [
            "GATE CSE 2026 Qualified",
            "GATE DA 2026 Qualified",
            "CAT 2025 Qualified (94.46 Percentile)",
            "HASOC FIRE 2025- Data Annotation Certification",
            "GATE CSE 2025 Qualified",
            "NPTEL- Python for Data Science (Top 5%)",
            "Letter of Recommendation from Global Cert Pte. Ltd., Singapore",
            "AWS Certified Cloud Practitioner (CCP) 2024"
        ],
        "additionalAchievements": [
            "Acknowledgment letter for MMPSRPC website from SVKM President",
            "Runner-up in Business and Innovation Program, Global Cert Pte. Ltd., Singapore"
        ]
    },
    "KANKSHA KEYUR BUCH": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Ongoing Research Paper: An Optimized Hybrid Ensemble Machine Learning Framework for Employability Prediction using a Multi-Attribute Dataset"
        ],
        "hackathons": [
            "Semifinilist at ImpactThon-2026",
            "Participated at ANRF-AISEHACK 2026",
            "Participated in Smart India Hackathon(2025)",
            "Participated in SSIP(2024)",
            "Participated in Bhartiya Antariksh Hackathon by ISRO 2024",
            "Finalists in DAU InnovAItion 2026",
            "Participated in Cognivia Hackathon of SAMPARK 2026(IEEE Gujarat Section)"
        ],
        "certifications": [
            "NPTEL-Programming in Java(Topper 1%)"
        ]
    },
    "KANSARA DEV DHARMESHKUMAR": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "AISEHack Hackathon Finalist",
            "Participated in ImpactThon 2025-2026",
            "InnovAItion - Shaping Future Innovators, DAU Finalists",
            "Participated in KDSH Hackathon",
            "Participated in SSIP 2025",
            "Participated in SIH 2025",
            "Participated in SSIP 2024"
        ],
        "leadership": [
            "Treasurer IEEE KSV SB"
        ],
        "certifications": [
            "InnovAItion - Shaping Future Innovators, DAU Finalists"
        ]
    },
    "KANUDAWALA ZEEL PARESH": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Accepted: Book Chapter: Quantum Tools: A Comprehensive Survey (Springer)",
            "Ongoing: A survey and Case Based Analysis of FaceSwapping Deepfake Detection Models",
            "Ongoing: ZTA-Shield: A Zero Trust Approach for Multi-Tenant Clouds"
        ],
        "hackathons": [
            "Finalists at ImpactThon-2026",
            "Finalists at ANRF-AISEHACK 2026",
            "Participated in Smart India Hackathon(2024, 2025)",
            "Participated in SSIP(2024, 2025)",
            "Participated in Cognivia Hackathon 2026"
        ],
        "certifications": [
            "Microsoft Azure (AZ-900)",
            "AWS Cloud Practitioner (CLF-CO2)",
            "Nptel for Database Management System (Elite)"
        ]
    },
    "KRISHNA BHATT": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Ongoing Research Paper: An Optimized Hybrid Ensemble Machine Learning Framework for Employability Prediction using a Multi-Attribute Dataset",
            "AI Impact Summit 2026 Case Study: Niramai — Thermalytix: Privacy-Preserving AI for Breast Cancer Screening"
        ],
        "hackathons": [
            "Semifinilist at ImpactThon-2026",
            "Participated at ANRF-AISEHACK 2026",
            "Participated in Smart India Hackathon(2024, 2025)",
            "Participated in SSIP(2024)",
            "Participated in Bhartiya Antariksh Hackathon by ISRO 2024",
            "Finalists in DAU InnovAItion 2026",
            "Participated in Cognivia Hackathon of SAMPARK 2026(IEEE Gujarat Section)",
            "Waitlisted in Smart India Hackathon(2024)"
        ],
        "internships": [
            "Completed Internship at IIT ROPAR"
        ],
        "certifications": [
            "NPTEL-Programming, Data Structures and Algorithms using Python",
            "NPTEL-Programming in Java(Topper 1%)",
            "NPTEL-Mathematical Foundations for Machine Learning",
            "NPTEL-Introduction to Machine Learning"
        ]
    },
    "KRUTIKA VIJAYBHAI PATEL": {
        "semester": 8.0,
        "department": "IT",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "International: Ethical AI and Gamified Pedagogy for Sustainable Classrooms (9th NYC Green School Conference, New York)",
            "National: EcoSmart Dustbin Project (Filed Patent: 202521111515)"
        ],
        "hackathons": [
            "Participated in SIH 2025"
        ],
        "internships": [
            "Institute for Plasma Research (Software Development Intern)"
        ],
        "leadership": [
            "Student Organiser - ERTE 2025",
            "Core Volunteer - Xenesis 2023",
            "Treasurer - IEEE LDRP-ITR Student Branch 2024",
            "Student Organiser - ImpactThon @KSV 2025",
            "Volunteer - ERT in AI&LLM 2025",
            "Volunteer - MMPSRPC Research Presentation 2025"
        ],
        "certifications": [
            "GATE DA 2026 Qualified",
            "AWS Certified Cloud Practitioner (CCP) 2025",
            "Python for Data Science (NPTEL)",
            "Database Management System (NPTEL)",
            "C Programming Language (NPTEL)"
        ],
        "additionalAchievements": [
            "Acknowledgment letter for MMPSRPC website from SVKM President"
        ]
    },
    "KUMAVAT YASH NENARAM": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "AISEHack Hackathon Finalist",
            "ImpactThon Finalist",
            "InnovAItion - Shaping Future Innovators, DAU Finalists",
            "Participated in SSIP 2025",
            "Participated in SIH 2025",
            "Participated in SSIP 2024"
        ],
        "leadership": [
            "Chair, IEEE KSV SB"
        ],
        "certifications": [
            "ImpactThon Finalist",
            "InnovAItion - Shaping Future Innovators, DAU Finalists"
        ]
    },
    "MAHI NITINCHANDRA PARMAR": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Ongoing: Smart Agriculture Project",
            "Ongoing: Drone Surveillance Project",
            "Ongoing: Encroachment Detection Project"
        ],
        "hackathons": [
            "ImpactThon@KSV 2025-2026 Finalist",
            "AISEHack Hackathon Finalist",
            "GTU Poster Presentation Finalist"
        ],
        "leadership": [
            "Webmaster, IEEE KSV WIE 2026",
            "Webmaster, IEEE KSV SPS 2025"
        ]
    },
    "MIHIR PATEL": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "hackathons": [
            "Winner - ImpactThon @ KSV 2025–26 (Track: Technologyfor Social Good and sustainable Process) — ₹50,000 prize",
            "Finalist - InnovAItion Hackathon by Intuitive & Dhirubhai Ambani University",
            "Shortlisted - AISEHack 2026 Finale at IIIT Hyderabad",
            "Participated in Cognivia Hackathon 2026",
            "Participated in Smart India Hackathon (2024, 2025)",
            "Participated SSIP (2023, 2024)",
            "Participated in ISRO Hackathon (2023, 2024)",
            "Participated in SBI Hackathon (2024)"
        ],
        "certifications": [
            "NPTEL Python for Data Science",
            "Dau Hackathon Participation",
            "Columbia++ Machine Learning Certificate",
            "Impactthon Winner Certificate",
            "ISRO Hackathon Participation Certificate"
        ],
        "additionalAchievements": [
            "Presented Bending Research Project at PAG MEETING-2026(PDEU, GANDHINAGAR)"
        ]
    },
    "NANCY RAJESH PATEL": {
        "semester": 8.0,
        "department": "IT",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "International: EcoAudit AI (9th NYC Green School Conference, New York)",
            "National: EcoSmart Dustbin Project (Filed Patent: 202521111515)",
            "State: Finalist - Research Poster Presentation"
        ],
        "hackathons": [
            "Top 5 Finalist - KAVACH 2023 National Hackathon",
            "Top 5 Finalist - Smart India Hackathon 2023",
            "Top 5 Finalist - Smart India Hackathon 2024",
            "Top 25 Finalist - Odoo x Gujarat Vidhyapith Hackathon 2025",
            "4th Runner-up - InnovAItion Hackathon 2026",
            "2nd Runner-up - SSIP 2023 Hackathon"
        ],
        "internships": [
            "Summer School Programme 2025 at IPR",
            "Institute for Plasma Research (IPR) Internship 2024"
        ],
        "leadership": [
            "Student Coordinator - ERTE 2025",
            "Student Coordinator - ImpactThon @KSV 2025-2026",
            "Vice-Chairperson, IEEE LDRP-ITR Student Branch, 2024",
            "Student Event Co-Coordinator, Xenesis’24",
            "Digital Committee Head, Xenesis’24"
        ],
        "certifications": [
            "Dau Hackathon Participation"
        ],
        "additionalAchievements": [
            "Letter of Appreciation for MMPSRPC website from SVKM President",
            "Letter of Recommendation from GlobalCert Pte. Ltd., Singapore"
        ]
    },
    "PADH CHARMI KETANKUMAR": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Published: TrafficEye: Intelligent Traffic Optimization (AIMV 2025, IEEE Xplore)",
            "Published: Quantum Tools: A Comprehensive Survey (Springer)",
            "Ongoing: Secure Park: Real-Time Edge AI Vision (Grant: ₹69,017)",
            "Ongoing: PharmaADRAI",
            "Ongoing: SecureSamvaad",
            "Ongoing: FaceSwapping Deepfake Detection Models Survey"
        ],
        "hackathons": [
            "Finalist at TicTechToe 2024",
            "4th Runnerup at InnovAItion Hackathon by Intuitive & Dhirubhai Ambani University",
            "Shortlisted - AISEHack 2026 Finale at IIIT Hyderabad",
            "Participated in Cognivia Hackathon 2026",
            "Participated in Smart India Hackathon (2024, 2025)",
            "Participated SSIP (2023, 2024)",
            "Participated in ISRO Hackathon (2023, 2024)"
        ],
        "internships": [
            "AI/ML Research Intern at Reliance Industries Limited (May-June 2025)",
            "Institute For Plasma Research (December - April 2025)"
        ],
        "leadership": [
            "Digital Committee Member- IEEE LDRP-ITR"
        ],
        "certifications": [
            "ISRO Hackathon Participation Certificate"
        ],
        "additionalAchievements": [
            "Active Member — SRL",
            "Introduction to Algorithms and Analysis (NPTEL 2025)"
        ]
    },
    "PANCHAL HENIT SHAILESHBHAI": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Generative AI as a Catalyst in Indian Education Ecosystem"
        ],
        "hackathons": [
            "Winner - ImpactThon @ KSV 2025–26 (Track: Technologyfor Social Good and sustainable Process) — ₹50,000 prize",
            "Finalist - InnovAItion Hackathon by Intuitive & Dhirubhai Ambani University",
            "Shortlisted - AISEHack 2026 Finale at IIIT Hyderabad",
            "Participated in Cognivia Hackathon 2026",
            "Participated in Smart India Hackathon (2023, 2024, 2025)",
            "Participated SSIP (2023, 2024)",
            "Participated in ISRO Hackathon (2023, 2024)",
            "Participated in SBI Hackathon (2024)"
        ],
        "internships": [
            "Front End Web Development Intern(Aug2025- Sept2025)",
            "Research Intern(IIT GANDHINAGAR)--Lingo Labs (Jan2026- Present)"
        ],
        "leadership": [
            "Digital Committee Member- IEEE LDRP-ITR"
        ],
        "awards": [
            "Entrepreneurship Award(WEC,KSV)- 2024, 2025",
            "Second Winner- Edunet Regional Showcase Event, Gujarat."
        ],
        "certifications": [
            "AZ-900 Azure Fundamentals (Microsoft)",
            "NPTEL- DBMS",
            "NPTEL-C++",
            "ImpacThon Winner Certificate",
            "EDUNET Foundation - Regional Event Certificate",
            "InnvoAItion -DAU Certificate",
            "Ignite(WEC,KSV)-2024"
        ],
        "additionalAchievements": [
            "Presented Bending Research Project at PAG MEETING-2026(PDEU, GANDHINAGAR)"
        ]
    },
    "PANDE HEMANT RAMESHWARKUMAR": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Published: Exploring AI’s Influence on Human Thinking (AISTS 2025, IEEE)",
            "Published: Identifying Health Risk Patterns (NASCENT MR 2025)",
            "Published: Book Chapter - Introduction to Internet of Things",
            "Ongoing: Early Epileptic Seizure Diagnosis",
            "Ongoing: LLM-Based Personalized Health Advice Generator",
            "Current Project: Portable Sensor for Microplastic Detection",
            "Winner Project: Student Attendance Tracking (Grant: ₹50,000)"
        ],
        "hackathons": [
            "Smart India Hackathon 2024 (Wellness Vivek)",
            "Smart India Hackathon 2025 (EduTrack)",
            "Odoo Hackathon 2025 (ReWear)",
            "IEEE Gujarat Datathon 2025 (AI-Based Nail Disease Detection)",
            "ISRO Hackathon (2024, 2025)",
            "Winner – ImpactThon @ KSV 2025–26",
            "4th runnerup – InnovAItion Hackathon",
            "Finalist - ANRF - AISEHack Hacakthon (2026)"
        ],
        "internships": [
            "AI/ML Research Intern - IEEE EMBS Student Internship 2025",
            "AI/ML Intern - SPS Internship 2025"
        ],
        "leadership": [
            "Secretary - IEEE KSV Student Branch (2025)",
            "Vice Chair - IEEE SPS Student Chapter (2025)",
            "Hackathon Coordinator - MMPSRPC",
            "Student Coordinator - ERTE-2025"
        ],
        "awards": [
            "Winner - IEEE R10 Ethics Awareness Contest",
            "2nd Prize - Poster Presentation (IEEE SPS Forum – IGNITE 2.0)",
            "National Poster Competition (GTU) - Presented Dropout Analysis"
        ],
        "certifications": [
            "NPTEL Certified – DBMS",
            "NPTEL Certified – Python for Data Science",
            "NPTEL Certified – Introduction to Algorithms",
            "Github Certified – Github Foundation"
        ],
        "additionalAchievements": [
            "Student Coordinator – STTP Program",
            "Volunteer – Research Oriented Workshop",
            "Volunteer – Chiropractic Research Meet"
        ]
    },
    "PARVA KUMAR": {
        "semester": 8.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Published: Deep Learning based Safe Car Driving Experience (AIMV 2025, IEEE)",
            "Published: Explainable Edge Intelligence (Accepted at ICNDSA-2026)",
            "Ongoing: Secure Park: Real-Time Edge AI Vision (Grant: ₹69,017)"
        ],
        "hackathons": [
            "Finalist at Odoo Combat 2024",
            "Finalist at InnovAItion Hackathon",
            "Participated in OdooXGVP 2026",
            "SIH (2024, 2025)",
            "SSIP (2023, 2024)",
            "ISRO Hackathon (2024)"
        ],
        "internships": [
            "AI/ML Developer Internship (Jun 2025-Oct 2025)"
        ],
        "leadership": [
            "Core Volunteer - Xenesis 2023",
            "Event Organizer - Xenesis 2024"
        ],
        "certifications": [
            "Python for Data Science (NPTEL)",
            "Research Paper Presentor at AIMV 2025",
            "Google Data Analytics by Google",
            "Machine Learning by DeepLearning.AI"
        ],
        "additionalAchievements": [
            "Demonstrated 'Silent-Talk' project at Savishkar 2025",
            "Student Coordinator – STTP Program"
        ]
    },
    "PATEL BANSHARI RAHULKUMAR": {
        "semester": 6.0,
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Published: AI's Influence on Human Thinking (AISTS 2025)",
            "Book Chapter: Introduction to Internet of Things (Springer)",
            "Accepted: Personalized Mood Detection Using LLMs (AICCoNS 2026, Dubai)",
            "Winner Project: Student Attendance Tracking (Grant: ₹50,000)",
            "Ongoing: Early Epileptic Seizure Diagnosis",
            "Ongoing: AI-Powered Drone Surveillance",
            "Ongoing: Intelligent Skill Extraction"
        ],
        "hackathons": [
            "1st Runner-Up – SAMPARK'25 Datathon",
            "5th Position – Internal SIH 2024",
            "Finalist – InnovAItion Hackathon",
            "Finalist – IEEE Data Science Challenge (DSC 3.0)",
            "Winner – ImpactThon @ KSV 2025–26 (₹50,000 prize)"
        ],
        "internships": [
            "IEEE EMBS Student Internship Program (NeuroPredict Project)",
            "IEEE SPS GS Mentorship Program (Mood Detection Project)"
        ],
        "leadership": [
            "Chairperson – IEEE KSV SPS Student Chapter",
            "Vice Chair – IEEE Student Branch, KSV",
            "Webmaster – IEEE KSV WIE Affinity Group",
            "Section Co-Lead – IEEEXtreme 2025"
        ],
        "awards": [
            "1st Prize – Poster Making (Xenesis 2025)",
            "Best Poster (2nd Position) – Track V: Intelligent Data Analytics (IGNITE 2.0)",
            "1st Runner-Up – Datathon (Sampark 2025)"
        ],
        "additionalAchievements": [
            "UK–France Future Leaders Immersion Program 2025",
            "ACM India Summer School 2025 on AI for Social Good"
        ]
    },
    "PATEL HENCY MUKESH": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "leadership": [
            "Co-ordinator – Xensis Event (2025)",
            "Recognized as One of the Best Leaders – Sarva Netrutva-102",
            "Co-Coordinator – Digital Committee, IEEE KSV Student Branch"
        ],
        "awards": [
            "1st Rank – Teachers’ Day Elocution Competition (University)",
            "Mahila Gaurav Award-2026"
        ],
        "certifications": [
            "3-Day Entrepreneurship Bootcamp (IEEE Region 10 ACEI)",
            "Anchor, National STTP on Linear Algebra for Machine Learning"
        ]
    },
    "PATEL JAINEE HASMUKHBHAI": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Published: Exploring AI's Influence on Human Thinking (AISTS 2025)",
            "Published: Misinformation Detection using LLMs (ACAI 2025)",
            "Published: Book Chapter: Introduction to Internet of Things (Springer)",
            "Winner Project: Student Attendance Tracking (Grant: ₹50,000)"
        ],
        "hackathons": [
            "Winner - ImpactThon @ KSV 2025–26",
            "Runner-Up - Datathon, Sampark 2025",
            "Finalist - IEEE Data Science Challenge (DSC 3.0)",
            "Finalist - InnovAItion Hackathon",
            "5th Position - Internal SIH 2024"
        ],
        "internships": [
            "Research Internship — IEEE (EMBS) Pune Chapter",
            "Research Internship — IEEE SPS Gujarat Section"
        ],
        "leadership": [
            "Co-ordinator – Xensis 2025",
            "Core Member – WEC, LDRP-ITR",
            "Sarva Netrutva-102 Best Leader"
        ],
        "awards": [
            "Winner — IEEE R10 Ethics Awareness Contest",
            "Best Poster / 2nd Prize — IGNITE 2.0 (AISTS 2025)",
            "Appreciation Letter for IEEE KSV Website"
        ],
        "additionalAchievements": [
            "UK–France Future Leaders Program 2025",
            "Active Member — SRL",
            "Azure Fundamentals (AZ-900) Certified"
        ]
    },
    "PATEL KRISH HIMANSHU": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Published: Exploring AI's Influence on Human Thinking (AISTS 2025)",
            "Published: Prostate Cancer Detection (WcCST 2026)",
            "Published: SHAP-Enhanced Outbreak Forecasting (NASCENT MR 2025)",
            "Winner Project: Student Attendance Tracking (Grant: ₹50,000)"
        ],
        "hackathons": [
            "Winner - ImpactThon @ KSV 2025–26",
            "Finalist - InnovAItion Hackathon",
            "Shortlisted - AISEHack 2026 Finale",
            "5th Position - Internal SIH 2024"
        ],
        "internships": [
            "Research Internship — IEEE (EMBS) Pune Chapter (Schizophrenia detection pipeline)",
            "Research Internship — IEEE SPS Gujarat Section (Prostate cancer grading)"
        ],
        "leadership": [
            "Student Research Coordinator - MMPSRPC",
            "Treasurer – IEEE Student Branch, KSV (2025)",
            "Section Student Representative - IEEE Gujarat Section"
        ],
        "awards": [
            "2nd Prize - Poster Presentation (IGNITE 2.0)",
            "Finalist - National Poster Competition (GTU)"
        ],
        "certifications": [
            "AWS Cloud Practitioner",
            "NPTEL Problem Solving in C (Silver medal, Top 5%)",
            "NPTEL Python for Data Science (Silver medal)"
        ],
        "additionalAchievements": [
            "Demonstrated 'Silent-Talk' project at Savishkar 2025",
            "Round 2 Qualifier - TCS CodeVita Season 13"
        ]
    },
    "PRAGATI VARU": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Ongoing Research Paper: An Optimized Hybrid Ensemble Machine Learning Framework for Employability Prediction using a Multi-Attribute Dataset"
        ],
        "hackathons": [
            "Finalist Impactthon",
            "Finalist ANRF AISE-Hack 2026",
            "Participated in Smart India Hackathon (2024, 2025)",
            "Participated in SSIP(2024, 2025)",
            "Participated in DAU InnovAItion 2026",
            "Participated in Cognivia Hackathon of SAMPARK 2026"
        ],
        "leadership": [
            "Treasurer, IEEE SPS KSV"
        ],
        "certifications": [
            "ImpactThon (2025-2026) Participation",
            "NPTEL - Python For Data Science (Elite)"
        ]
    },
    "PREM RAICHURA": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Published: TrafficEye: Intelligent Traffic Optimization (AIMV 2025, IEEE)",
            "Winner Project: Secure Park ecosystem (Grant: ₹69,017)",
            "Ongoing: PharmaADR-AI",
            "Ongoing: Face-Swapping Deepfake Detection Models survey",
            "Ongoing: Secure Samvaad"
        ],
        "hackathons": [
            "Finalist - InnovAItion Hackathon by Intuitive & DAU (2025)",
            "Finalist - Tic Tae Toe Hackathon by Intuitive & DAU (2024)",
            "Shortlisted - AISEHack 2026 Finale at IIIT Hyderabad",
            "Participated - SIH (2024, 2025) & SSIP"
        ],
        "internships": [
            "Institute for Plasma Research (Devops Intern) (Jan 2026 - April 2026)"
        ],
        "awards": [
            "Grant ₹2,500/- for conference publications from MMPSRPC"
        ],
        "certifications": [
            "NPTEL - Python for data science"
        ]
    },
    "RIDHAM PATEL": {
        "semester": 8.0,
        "department": "IT",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "National: EcoSmart Dustbin Project (Filed Patent: 202521111515)"
        ],
        "hackathons": [
            "SSIP New Vibrant Hackathon 2023 (2nd Runner Up)",
            "SIH 2023 Finalist",
            "SIH 2024 Finalist",
            "Odoo x GVP Hackathon 2025/2026"
        ],
        "internships": [
            "MotionCut (Web Development Intern)",
            "Institute for Plasma Research (Software Development Intern)",
            "IEEE EMBS Pune Chapter (AI/ML Intern)",
            "OpenXcell Technolabs (Associate Software Engineer)"
        ],
        "leadership": [
            "Webmaster - IEEE LDRP-ITR Student Branch 2024",
            "Student Organiser - ERTE ERTE 2025"
        ],
        "certifications": [
            "AWS Certified Cloud Practitioner",
            "GATE DA 2026 Qualified"
        ],
        "additionalAchievements": [
            "UK–France Future Leaders Immersion Program 2025",
            "Developed ImpactThon @KSV 2025 Hackathon Website"
        ]
    },
    "ROHAN THAKAR": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Accepted: Book Chapter: Quantum Tools: A Comprehensive Survey (Springer)",
            "Accepted: TrafficEye: Intelligent Smart Traffic Enhancement",
            "Ongoing: FaceSwapping Deepfake Detection Models survey",
            "Ongoing: ZTA-Shield: Zero Trust Approach"
        ],
        "hackathons": [
            "Finalists at ImpactThon-2026",
            "Finalists at ANRF-AISEHACK 2026",
            "SIH (2024, 2025)",
            "SSIP (2024, 2025)",
            "DAU InnovAItion 2026"
        ],
        "certifications": [
            "NPTEL Modern C++",
            "NPTEL DBMS",
            "NPTEL Introduction to Algorithms"
        ],
        "additionalAchievements": [
            "Volunteered at ROBOFEST 5.0"
        ]
    },
    "RUDR JAYESHKUMAR HALVADIYA": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "hackathons": [
            "AISEHack Hackathon Finalist",
            "Odoo X :Gujarat Vidyapith Finalist",
            "ImpactThon Finalist",
            "InnovAItion - Shaping Future Innovators, DAU Finalists",
            "Participated in SSIP 2024/2025",
            "Participated in SIH 2025"
        ],
        "leadership": [
            "Secretary,IEEE KSV SB",
            "Team Leader OdooxVidhyapith [2026]"
        ]
    },
    "YAJURSHI VELANI": {
        "semester": 4.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL, IEEE-KSV",
        "researchWork": [
            "Ongoing: Encroachment Detection Project"
        ],
        "hackathons": [
            "4th Runner up in Impacthon",
            "Finalist ANRF AISE-Hack 2026",
            "SIH/SSIP Participant",
            "Finalist IEEE MYOSA COMPETITION 4.0"
        ],
        "internships": [
            "IEEE EMBS Student Internship Program IEEE Pune Section"
        ],
        "leadership": [
            "Secretary , IEEE SPS , KSV"
        ],
        "certifications": [
            "Certificate of impacthon , Ideathon"
        ],
        "additionalAchievements": [
            "Anchoring at Xenesis , Orientation"
        ]
    },
    "ZENISHA DEVANI": {
        "semester": 6.0,
        "department": "CE",
        "institute": "LDRP-ITR",
        "organization": "SRL",
        "researchWork": [
            "Accepted: Book Chapter: Quantum Tools: A Comprehensive Survey (Springer)",
            "Ongoing: FaceSwapping Deepfake Detection Models survey",
            "Ongoing: ZTA-Shield",
            "Ongoing: OSMAR: Oil Spill Monitoring"
        ],
        "hackathons": [
            "1st Runner Up at Gujarat Innovation Showcase 2026",
            "Finalists at ImpactThon-2026",
            "Finalists at ANRF-AISEHACK 2026",
            "2nd Runner Up at Innovation Track of SAMPARK 2024"
        ],
        "internships": [
            "Internship at Institute of Plasma Research"
        ],
        "leadership": [
            "Website Committee Member- IEEE LDRP-ITR",
            "Member of NSS"
        ],
        "awards": [
            "Second Winner- Edunet Regional Showcase Event, Gujarat."
        ],
        "certifications": [
            "NPTEL Introduction to Algorithms",
            "NPTEL DBMS",
            "AZ-900 Azure Fundamentals (Microsoft)"
        ],
        "additionalAchievements": [
            "Volunteered at STTP on Mathmatics Driven Machine Learning (2024)"
        ]
    }
};

const studentsFilePath = path.join(__dirname, 'srlStudents.json');
const studentsData = JSON.parse(fs.readFileSync(studentsFilePath, 'utf8'));

const nameOverrides = {
    "Yashvi Chavda": "CHAVADA YASHVI SURENDRASINH",
    "Rudr Halvadiya": "RUDR JAYESHKUMAR HALVADIYA"
};

let updatedCount = 0;
const updatedStudents = studentsData.map(student => {
  let nameKey = student.student_name;
  if (nameOverrides[nameKey]) {
      nameKey = nameOverrides[nameKey];
  }
  
  const searchName = nameKey.toUpperCase();
  
  let matchName = Object.keys(achievementsData).find(key => {
      const k = key.toUpperCase();
      if (k === searchName) return true;
      
      const kParts = k.split(' ').filter(p => p.length > 2);
      const nParts = searchName.split(' ').filter(p => p.length > 2);
      
      const common = kParts.filter(p => nParts.includes(p));
      if (common.length >= 2) return true;

      return false;
  });

  if (matchName) {
    const ach = achievementsData[matchName];
    // Add additional fields to student object
    student.achievements_extended = {
        semester: ach.semester,
        department: ach.department,
        institute: ach.institute,
        organization: ach.organization,
        researchWork: ach.researchWork || [],
        hackathons: ach.hackathons || [],
        leadership: ach.leadership || [],
        awards: ach.awards || [],
        certifications: ach.certifications || [],
        additionalAchievements: ach.additionalAchievements || [],
        internships: ach.internships || []
    };
    updatedCount++;
    console.log(`Added achievements for: ${student.student_name}`);
  } else {
    console.log(`MISSING Achievements for: ${student.student_name}`);
  }
  return student;
});

fs.writeFileSync(studentsFilePath, JSON.stringify(updatedStudents, null, 4));
console.log(`Successfully added achievements for ${updatedCount} students.`);

// --- BACKEND SYNC ---
const syncToBackend = async () => {
    try {
        console.log("\n🚀 Syncing achievements to backend...");
        const response = await fetch('http://localhost:8000/api/researchers/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'achievements', data: achievementsData })
        });
        const result = await response.json();
        console.log("✅ Backend Sync SUCCESS:", result.message);
    } catch (err) {
        console.error("❌ Backend Sync FAILED:", err.message);
        console.log("   (Make sure the backend is running at http://localhost:8000)");
    }
};

syncToBackend();
