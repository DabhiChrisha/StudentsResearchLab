const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../../frontend/src/data/srlStudents.json');
const students = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const updates = {
    "Aayush Viral Pandya": [
        "SSIP 2024 - Participant",
        "SSIP 2025 (Early) - Participant",
        "SSIP 2025 (Late) - Participant",
        "SIH 2025 - Participant",
        "AI for Mineral Targetting Hackathon 2025 - Participant",
        "ImpactThon 2025-26 - Finalist",
        "Cognivia Hackathon (IEEE Sampark) - 2nd Runner Up",
        "InnovAItion - Shaping Future Innovators Hackathon - Finalist",
        "Kharagpur Data Science Hackathon (KDSH) 2026 - Participant",
        "AISEHack Hackathon - Finalist",
        "Odoo X Gujarat Vidhyapith Hackathon 2026 - Finalist",
        "IEEE YESIST12 - Participant"
    ],
    "Chrisha Manish Dabhi": [
        "SIH 2024 - Participant",
        "SSIP 2024 - Participant",
        "Odoo x Gujarat Vidyapith Hackathon 2024 - Participant",
        "SIH 2025 - Participant",
        "SSIP 2025 (Early) - Participant",
        "SSIP 2025 (Late) - Participant",
        "InnovAItion - Shaping Future Innovators Hackathon - Finalist",
        "Cognivia Hackathon (IEEE Sampark) - Participant",
        "ImpactThon @KSV 2025-2026 - Finalist",
        "Odoo X Gujarat Vidyapith 2026 - Participant",
        "Kharagpur Data Science Hackathon (2026) - Participant",
        "AISEHack 2026 - Finalist",
        "IEEE YESIST12 - Participant"
    ],
    "Mahi Parmar": [
        "SIH 2024 - Participant",
        "SSIP 2024 - Participant",
        "Odoo x Gujarat Vidyapith Hackathon 2024 - Participant",
        "SIH 2025 - Participant",
        "SSIP 2025 (Early) - Participant",
        "SSIP 2025 (Late) - Participant",
        "ISRO Hackathon 2025 - Participant",
        "InnovAItion - Shaping Future Innovators Hackathon - Participant",
        "Cognivia Hackathon (IEEE Sampark) - Participant",
        "ImpactThon @KSV 2025-2026 - Finalist",
        "Odoo X Gujarat Vidyapith 2026 - Participant",
        "Kharagpur Data Science Hackathon (2026) - Participant",
        "AISEHack 2026 - Finalist",
        "IEEE YESIST12 - Participant"
    ],
    "Antra Gajjar": [
        "IEEE Intel 2024 - Participant",
        "SSIP in early 2025 (Cancelled) - Participant",
        "SSIP in late 2025 - Participant",
        "SIH 2025 - Participant",
        "ImpactThon @KSV 2025-2026 - Finalist",
        "IEEE Cognivia 2026- Participant",
        "InnovAItion 2026 - Finalist",
        "Kharagpur Data Science Hackathon (KDSH) 2026 - Participant",
        "AISEHack 2026 - Finalist"
    ],
    "Yash Kumavat": [
        "IEEE Intel 2024 - Participant",
        "SSIP in early 2025 (Cancelled) - Participant",
        "SSIP in late 2025 - Participant",
        "SIH 2025 - Participant",
        "ImpactThon @KSV 2025-2026 - Finalist",
        "IEEE Cognivia 2026- Participant",
        "InnovAItion 2026 - Finalist",
        "Kharagpur Data Science Hackathon (KDSH) 2026 - Participant",
        "AISEHack 2026 - Finalist"
    ],
    "Yajurshi Velani": [
        "SSIP 2024 - Participant",
        "SIH 2025 - Participant",
        "ImpactThon 2025-26 - 4th Runner up",
        "Cognivia Hackathon (IEEE Sampark) - Participant",
        "InnovAItion - Shaping Future Innovators Hackathon - Finalist",
        "Kharagpur Data Science Hackathon (KDSH) 2026 - Participant",
        "AISEHack Hackathon - Finalist",
        "Odoo X Gujarat Vidhyapith Hackathon 2026 - Participant"
    ],
    "Bhagyashree Jadeja": [
        "AISEHack Hackathon- Finalist",
        "ImpactThon -Participant",
        "SIH 2025- Participant",
        "Odoo X Gujarat Vidhyapith Hackathon 2026- Participant",
        "IEEE YESIST12- Participant"
    ],
    "Pragati Varu": [
        "SSIP 2024, 2025 - Participant",
        "SIH 2025 - Participant",
        "ISRO Hackathon 2025 - Participant",
        "IEEE YESIST12 2025 - Participant",
        "IEEE YESIST12 2026 - Paricipant",
        "Cognivia Hackathon 2026 - Paricipant",
        "Odoo x Vidhyapith Hackathon 2026 - Participant",
        "KDSH Hackathon 2026 - Participant",
        "ImpactThon@KSV 2026 - Finalist",
        "ANRF AISEHack 2026 - Finalist",
        "DAU InnovAItion Hackathon 2026 - Participant"
    ],
    "Dev Kansara": [
        "SSIP 2024 - Participant",
        "SSIP 2025 - Participant",
        "SIH 2025 - Participant",
        "ImpactThon @KSV 2025-2026 - Participant",
        "IEEE Cognivia 2026- Participant",
        "InnovAItion 2026 - Finalist",
        "Kharagpur Data Science Hackathon (KDSH) 2026 - Participant",
        "AISEHack 2026 - Finalist"
    ],
    "Rudr Halvadiya": [
        "SSIP 2024 - participant",
        "SSIP 2025 - participant",
        "SIH 2025 - participant",
        "Impactthon 2026 - Finalist",
        "InnovAItion - finalist",
        "Odoo x Vidhyapith - Finalist",
        "AISE Hack - finalist",
        "KDSH 2026 - Participant"
    ]
};

let updatedCount = 0;
students.forEach(s => {
    // Match by name (exact or partial)
    for (const [name, hackathons] of Object.entries(updates)) {
        if (s.student_name.includes(name) || name.includes(s.student_name)) {
            s.hackathons = hackathons;
            if (!s.achievements_extended) s.achievements_extended = {};
            s.achievements_extended.hackathons = hackathons;
            console.log(`Updated ${s.student_name}`);
            updatedCount++;
            break;
        }
    }
});

fs.writeFileSync(jsonPath, JSON.stringify(students, null, 4));
console.log(`\nSuccessfully updated ${updatedCount} students in srlStudents.json`);
