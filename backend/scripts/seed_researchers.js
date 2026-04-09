const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// Load backend .env
require("dotenv").config({ path: path.join(__dirname, "../.env") });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || "https://npdtneznlzganiolvhmw.supabase.co",
    process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wZHRuZXpubHpnYW5pb2x2aG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzE3NjksImV4cCI6MjA4NzM0Nzc2OX0.PwBd-ZIbABocG_jX5iAWxXhO3DpGLlJDNDyTlqvByxg"
);

async function seed() {
    try {
        console.log("Reading srlStudents.json...");
        const jsonPath = path.join(__dirname, "../../frontend/src/data/srlStudents.json");
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`Could not find srlStudents.json at ${jsonPath}`);
        }
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

        console.log(`Found ${jsonData.length} students. Syncing to Supabase...`);

        for (const s of jsonData) {
            const enroll = (s.enrollment_no || "").trim().toUpperCase();
            if (!enroll) {
                console.warn(`Skipping student without enrollment: ${s.student_name}`);
                continue;
            }

            // 1. Sync to students_details (ONLY core columns)
            const { error: detError } = await supabase
                .from("students_details")
                .upsert({
                    enrollment_no: enroll,
                    student_name: s.student_name,
                    profile_image: s.photo || "/students/schoolstudent.png",
                    department: s.department || "CE",
                    semester: s.semester || "6th",
                    batch: s.batch || "-",
                    institute_name: s.achievements_extended?.institute || "LDRP-ITR",
                    email: s.email || ""
                }, { onConflict: 'enrollment_no' });

            if (detError) console.error(`Error syncing info for ${s.student_name}:`, detError.message);

            // 2. Sync to member_cv_profiles (store the whole object in 'projects' column)
            const { error: cvError } = await supabase
                .from("member_cv_profiles")
                .upsert({
                    enrollment_no: enroll,
                    student_name: s.student_name,
                    research_area: Array.isArray(s.research) ? s.research.join(',') : s.research,
                    hackathons: JSON.stringify(s.hackathons || []),
                    projects: JSON.stringify(s) // Using projects as a JSON blob store
                }, { onConflict: 'enrollment_no' });

            if (cvError) console.error(`Error syncing CV for ${s.student_name}:`, cvError.message);
            
            console.log(`✅ Synced: ${s.student_name}`);
        }

        console.log("\nSeeding completed successfully!");
    } catch (err) {
        console.error("Seeding failed:", err.message);
    }
}

seed();
