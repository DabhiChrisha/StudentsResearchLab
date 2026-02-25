import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Target, Zap, TrendingUp, Users, Award, BookOpen, Crown, Search } from "lucide-react";
import { useState, useEffect } from 'react';

// Single source of truth for student metadata. 
// Scores will be fetched from backend and merged into these profiles.
const STUDENT_PROFILES = [
    { name: "Kandarp\nDipakkumar\nGajjar", image: encodeURI("/students/Kandarp Gajjar.jpeg"), enrollment: "22BECE30091", dept: "CE", semester: "8th", attendance: 11, div: "-", batch: "2022-2026" },
    { name: "Nancy Rajesh\nPatel", image: encodeURI("/students/Nancy.jpeg"), enrollment: "22BEIT30123", dept: "IT", semester: "8th", attendance: 8, div: "-", batch: "2022-2026" },
    { name: "Pande Hemant\nRameshwarkumar", image: encodeURI("/students/Pande Hemant Rameshwarkumar.jpeg"), enrollment: "23BECE30493", dept: "CE", semester: "6th", attendance: 12, div: "-", batch: "2023-2027" },
    { name: "Patel Krish\nHimanshu", image: encodeURI("/students/Patel Krish Himanshu.jpeg"), enrollment: "23BECE30532", dept: "CE", semester: "6th", attendance: 12, div: "-", batch: "2023-2027" },
    { name: "Patel Banshari\nRahulkumar", image: encodeURI("/students/Patel Banshari Rahulkumar.jpg"), enrollment: "23BECE30168", dept: "CE", semester: "6th", attendance: 9, div: "-", batch: "2023-2027" },
    { name: "Jenish Sorathiya", enrollment: "23BEIT54020", dept: "IT", semester: "6th", div: "-", batch: "2023-2027", image: encodeURI("/students/Jenish Sorathiya.jpeg"), attendance: 11 },
    { name: "Patel Jainee Hasmukhbhai", enrollment: "23BECE30203", dept: "CE", semester: "6th", div: "C", batch: "2023-2027", image: encodeURI("/students/Patel Jainee Hasmukhbhai.jpeg"), attendance: 10 },
    { name: "Dabhi Chrisha Manish", enrollment: "24BECE30489", dept: "CE", semester: "4th", div: "G", batch: "2024-2028", image: encodeURI("/students/Dabhi Chrisha Manish.png"), attendance: 11 },
    { name: "Kansara Dev Dharmeshkumar", enrollment: "24BECE30114", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: encodeURI("/students/Kansara Dev Dharmeshkumar.jpeg"), attendance: 10 },
    { name: "Yash Kumavat", enrollment: "24BECE30122", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: encodeURI("/students/Yash Kumavat.jpeg"), attendance: 10 },
    { name: "Halvdadiya Rudr", enrollment: "24BECE30094", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: encodeURI("/students/Halvdadiya Rudr.jpeg"), attendance: 10 },
    { name: "Gajjar Antra Ashvinkumar", enrollment: "24BECE30081", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: encodeURI("/students/Gajjar Antra Ashvinkumar.jpeg"), attendance: 10 },
    { name: "Chavda Yashvi Surendrasinh", enrollment: "23BECE30036", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Chavda Yashvi Surendrasinh.jpeg"), attendance: 3 },
    { name: "Devda Rachita Bharatsinh", enrollment: "23BECE30059", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Devda Rachita Bharatsinh.jpeg"), attendance: 2 },
    { name: "Ghetiya Poojan Rahulbhai", enrollment: "25MECE30003", dept: "CE", semester: "1st", div: "J", batch: "2025-2027", image: encodeURI("/students/Ghetiya Poojan Rahulbhai.jpeg"), attendance: 2 },
    { name: "Heny Patel", enrollment: "23BECE30521", dept: "CE", semester: "6th", div: "P", batch: "2023-2027", image: encodeURI("/students/Heny Patel.jpeg"), attendance: 6 },
    { name: "Hetvi Hinsu", enrollment: "23BECE30449", dept: "CE", semester: "6th", div: "G", batch: "2023-2027", image: encodeURI("/students/Hetvi Hinsu.jpeg"), attendance: 5 },
    { name: "Honey Modha", enrollment: "224SBECE30016", dept: "CE", semester: "6th", div: "B", batch: "2023-2027", image: encodeURI("/students/Honey Modha.jpeg"), attendance: 3 },
    { name: "Janki Chitroda", enrollment: "23BECE30040", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Janki Chitroda.jpeg"), attendance: 3 },
    { name: "Kanksha Keyur Buch", enrollment: "23BECE30029", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Kanksha Keyur Buch.jpeg"), attendance: 4 },
    { name: "Kanudawala Zeel PareshKumar", enrollment: "23BECE30101", dept: "CE", semester: "6th", div: "B", batch: "2023-2027", image: encodeURI("/students/Kanudawala Zeel PareshKumar.jpeg"), attendance: 7 },
    { name: "Krishna Bhatt", enrollment: "23BECE30023", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Krishna Bhatt.jpeg"), attendance: 2 },
    { name: "Krutika Vijaybhai Patel", enrollment: "22BEIT30118", dept: "IT", semester: "8th", div: "J", batch: "2022-2026", image: encodeURI("/students/Krutika Vijaybhai Patel.jpeg"), attendance: 1 },
    { name: "Mihir Patel", enrollment: "23BECE30542", dept: "CE", semester: "6th", div: "P", batch: "2023-2027", image: encodeURI("/students/Mihir Patel.png"), attendance: 8 },
    { name: "Padh Charmi Ketankumar", enrollment: "23BECE30144", dept: "CE", semester: "6th", div: "C", batch: "2023-2027", image: encodeURI("/students/Padh Charmi Ketankumar.jpeg"), attendance: 3 },
    { name: "Panchal Henit Shaileshbhai", enrollment: "23BECE30490", dept: "CE", semester: "6th", div: "P", batch: "2023-2027", image: encodeURI("/students/Panchal Henit Shaileshbhai.jpeg"), attendance: 8 },
    { name: "Pandya Aayush Viral", enrollment: "24BECE30541", dept: "CE", semester: "4th", div: "P", batch: "2024-2028", image: encodeURI("/students/Pandya Aayush Viral.webp"), attendance: 11 },
    { name: "Parmar Mahi Nitinchandra", enrollment: "24BECE30548", dept: "CE", semester: "4th", div: "P", batch: "2024-2028", image: encodeURI("/students/Parmar Mahi Nitinchandra.webp"), attendance: 11 },
    { name: "Parva Kumar", enrollment: "22BECE30153", dept: "CE", semester: "8th", div: "C", batch: "2022-2026", image: encodeURI("/students/Parva Kumar.jpeg"), attendance: 1 },
    { name: "Pragati Varu", enrollment: "24BECE30436", dept: "CE", semester: "4th", div: "F", batch: "2024-2028", image: encodeURI("/students/Pragati Varu.jpeg"), attendance: 9 },
    { name: "Prem Raichura", enrollment: "224SBECE30059", dept: "CE", semester: "6th", div: "F", batch: "2023-2027", image: encodeURI("/students/Prem Raichura.jpeg"), attendance: 3 },
    { name: "Ridham Patel", enrollment: "22BEIT30133", dept: "IT", semester: "8th", div: "J", batch: "2022-2026", image: encodeURI("/students/Ridham Patel.png"), attendance: 1 },
    { name: "Rohan Thakar", enrollment: "23BECE30364", dept: "CE", semester: "6th", div: "F", batch: "2023-2027", image: encodeURI("/students/Rohan Thakar.png"), attendance: 7 },
    { name: "Yajurshi Velani", enrollment: "24BECE30441", dept: "CE", semester: "4th", div: "F", batch: "2024-2028", image: encodeURI("/students/Yajurshi Velani.png"), attendance: 7 },
    { name: "Zenisha Devani", enrollment: "23BECE30058", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Zenisha Devani.jpeg"), attendance: 3 },
];

const LeaderBoard = () => {
    const [topPerformers, setTopPerformers] = useState([]);
    const [regularPerformers, setRegularPerformers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                // Fetch dynamic scores and attendance records from the backend
                const [scoresResponse, attendanceResponse, srlResponse] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/scores'),
                    fetch('http://127.0.0.1:8000/api/attendance'),
                    fetch('http://127.0.0.1:8000/api/srl_sessions')
                ]);

                if (!scoresResponse.ok || !attendanceResponse.ok || !srlResponse.ok) throw new Error("Failed to fetch backend data");
                
                const scoresData = await scoresResponse.json();
                const attendanceData = await attendanceResponse.json();
                const srlData = await srlResponse.json();
                
                // Construct a score map: { "enrollment_no": total_points }
                const scoreMap = {};
                scoresData.records.forEach(record => {
                    scoreMap[record.enrollment_no] = record.total_points;
                });

                // Construct an attendance map for percentage calculation
                const attendanceMap = {};
                attendanceData.records.forEach(record => {
                    const en = record.enrollment_no;
                    const date = record.date;
                    const hours = record.hours || 0;
                    
                    if (!attendanceMap[en]) attendanceMap[en] = { totalHours: 0, dailyHours: {} };
                    
                    attendanceMap[en].totalHours += hours;
                    if (date) {
                        attendanceMap[en].dailyHours[date] = (attendanceMap[en].dailyHours[date] || 0) + hours;
                    }
                });

                // Build a Set of valid SRL Session dates for fast lookup
                const srlDates = new Set(srlData.records.map(r => r.session_date).filter(Boolean));

                // Merge static profiles with dynamic scores and attendance percentage
                const mergedStudents = STUDENT_PROFILES.map((student, index) => {
                    // Normalize the enrollment strings just in case 
                    const studentEnrollment = student.enrollment.trim().toUpperCase();
                    // Lookup score and percentage, default to 0 if not found
                    const score = scoreMap[studentEnrollment] || 0;
                    
                    let percentage = 0;
                    let srlPercentage = 0;
                    const attData = attendanceMap[studentEnrollment];
                    if (attData) {
                        const dates = Object.keys(attData.dailyHours);
                        const totalDays = dates.length;
                        if (totalDays > 0) {
                            const presentDays = dates.filter(d => attData.dailyHours[d] > 0).length;
                            percentage = Math.round((presentDays / totalDays) * 100);
                        }
                        
                        // Calculate SRL specific percentage based on inner join logic 
                        const srlValidDates = dates.filter(d => srlDates.has(d));
                        const totalSrlDays = srlValidDates.length;
                        if (totalSrlDays > 0) {
                            const presentSrlDays = srlValidDates.filter(d => attData.dailyHours[d] > 0).length;
                            srlPercentage = Math.round((presentSrlDays / totalSrlDays) * 100);
                        }
                    }
                    
                    return {
                        ...student,
                        id: student.id || index + 1, // Fallback ID if not provided
                        score: score,
                        attendance: percentage, // Overwrite hardcoded static attribute
                        srlAttendance: srlPercentage // Add SRL attribute
                    };
                });

                // Sort students descending by score, then by attendance hours
                const sortedStudents = [...mergedStudents].sort((a, b) => {
                    if (b.score !== a.score) {
                        return b.score - a.score;
                    }
                    return b.attendance - a.attendance;
                });

                // Calculate Ranks and Handle Groups/Ties correctly
                // Rank strictly increments for each student -> no shared ranks
                const rankedStudents = sortedStudents.map((student, index) => ({
                    ...student,
                    rank: index + 1
                }));

                // Group the top 5 ranks for the TopPerformers visually identical array expectation
                const tmpTopPerformers = [];
                for (let r = 1; r <= 5; r++) {
                    const studentsMatchingRank = rankedStudents.filter(s => s.rank === r);
                    if (studentsMatchingRank.length > 0) {
                        tmpTopPerformers.push({
                            rank: r,
                            points: studentsMatchingRank[0].score, // They all have same point value in a tier
                            students: studentsMatchingRank
                        });
                    }
                }

                setTopPerformers(tmpTopPerformers);
                
                // Group the rest (Rank 4 and beyond, to show 4 & 5 on mobile list)
                const restOfTheStudents = rankedStudents.filter(s => s.rank >= 4);
                setRegularPerformers(restOfTheStudents);
                setLoading(false);

            } catch (error) {
                console.error("Error building leaderboard:", error);
                
                // Fallback rendering incase backend is down: rank all 0
                const fallbackStudents = STUDENT_PROFILES.map((s, i) => ({ ...s, id: i+1, score: 0, rank: 1, attendance: 0 }));
                setTopPerformers([{ rank: 1, points: 0, students: fallbackStudents.slice(0, 5) }]);
                setRegularPerformers(fallbackStudents.slice(3));
                setLoading(false);
            }
        };

        fetchScores();
    }, []);
    const getRankStyles = (rank) => {
        // Fallback for ranks 6 and beyond or unhandled cases
        if (rank > 5) {
            return {
                card: "bg-white border-gray-200 shadow-sm",
                badge: "bg-gray-400",
                glow: "bg-gray-100",
                pts: "bg-gray-100 text-gray-600 border-gray-200",
                height: "h-full"
            };
        }
        const rankStyles = {
            1: {
                card: "bg-gradient-to-b from-yellow-50 via-amber-100 to-yellow-200 border-yellow-400 border-x-4 border-t-8 border-b-0 shadow-[0_-10px_40px_rgba(251,191,36,0.3)] z-30 transform scale-105",
                badge: "bg-gradient-to-br from-yellow-400 to-amber-600 shadow-yellow-500/50",
                glow: "bg-yellow-300/60",
                pts: "bg-white text-yellow-700 border-yellow-200 shadow-sm flex items-center justify-center gap-1",
                height: "h-[220px] sm:h-[260px]",
                crown: true
            },
            2: {
                card: "bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 border-slate-300 border-x-2 border-t-4 border-b-0 shadow-[0_-5px_20px_rgba(148,163,184,0.2)] z-20",
                badge: "bg-gradient-to-br from-slate-400 to-slate-600 shadow-slate-500/50",
                glow: "bg-slate-300/60",
                pts: "bg-white text-slate-700 border-slate-200 shadow-sm flex items-center justify-center gap-1",
                height: "h-[190px] sm:h-[220px]"
            },
            3: {
                card: "bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 border-orange-300 border-x-2 border-t-4 border-b-0 shadow-[0_-5px_20px_rgba(251,146,60,0.2)] z-20",
                badge: "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/50",
                glow: "bg-orange-300/60",
                pts: "bg-white text-orange-800 border-orange-200 shadow-sm flex items-center justify-center gap-1",
                height: "h-[160px] sm:h-[190px]"
            },
            4: {
                card: "bg-gradient-to-b from-emerald-50 via-emerald-100 to-emerald-200 border-emerald-300 border-x-2 border-t-4 border-b-0 shadow-[0_-5px_20px_rgba(52,211,153,0.15)] z-10",
                badge: "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/50",
                glow: "bg-emerald-300/40",
                pts: "bg-white text-emerald-800 border-emerald-200 shadow-sm flex items-center justify-center gap-1",
                height: "h-[140px] sm:h-[160px]"
            },
            5: {
                card: "bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200 border-sky-300 border-x-2 border-t-4 border-b-0 shadow-[0_-5px_20px_rgba(56,189,248,0.15)] z-10",
                badge: "bg-gradient-to-br from-sky-400 to-sky-600 shadow-sky-500/50",
                glow: "bg-sky-300/40",
                pts: "bg-white text-sky-800 border-sky-200 shadow-sm flex items-center justify-center gap-1",
                height: "h-[120px] sm:h-[140px]"
            }
        };
        return rankStyles[rank];
    };

    // Helper to order the top performers for the podium layout
    // No longer strictly needed for mobile flow, but kept as a reference 

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-6 pb-16 px-4 sm:px-6 lg:px-8 bg-[#fafafa] min-h-screen relative overflow-hidden font-sans"
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none z-0"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none z-0"></div>

            {/* Animated Rotating Watermarks (kept from orginal) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="fixed -top-[30vw] -left-[30vw] lg:-top-[400px] lg:-left-[400px] w-[120vw] h-[120vw] lg:w-[1000px] lg:h-[1000px] opacity-[0.25] pointer-events-none z-0"
                style={{
                    backgroundImage: 'url("/watermark.png")',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="fixed -bottom-[30vw] -right-[30vw] lg:-bottom-[400px] lg:-right-[400px] w-[120vw] h-[120vw] lg:w-[1000px] lg:h-[1000px] opacity-[0.25] pointer-events-none z-0"
                style={{
                    backgroundImage: 'url("/watermark.png")',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-amber-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                        <Trophy className="absolute inset-0 m-auto text-amber-500" size={24} />
                    </div>
                    <p className="mt-6 text-gray-600 font-semibold tracking-wide animate-pulse uppercase text-sm">Computing Rankings...</p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center gap-4 mb-16 text-center relative"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-2">
                             <TrendingUp size={16} className="text-amber-600" />
                             <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">Top Performers</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                            Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Leaderboard</span>
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base font-medium mt-2 leading-relaxed -translate-y-4">
                            Recognizing outstanding dedication, academic excellence, and continuous contribution to the research lab.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="max-w-6xl mx-auto mb-10 px-2 mt-8 sm:mt-12 lg:mt-16"
                    >
                    {/* Top 5 Podium UI */}
                    <div className="flex flex-row flex-nowrap items-end justify-center gap-x-1.5 sm:gap-x-3 h-[250px] sm:h-[300px] lg:h-[350px] relative mt-16 sm:mt-24 lg:mt-20 lg:pt-8 w-full scale-100 lg:scale-[0.82] origin-bottom mb-10 lg:mb-0">
                        

                        {topPerformers.filter(p => p.rank <= 5).map((performer, idx) => {
                            const styles = getRankStyles(performer.rank);
                            const isFirst = performer.rank === 1;
                            
                            // Enforce exact desktop layout order on mobile: 2-1-3 (4 and 5 hidden on mobile)
                            const orderMap = { 1: "order-3", 2: "order-2", 3: "order-4", 4: "order-1", 5: "order-5" };
                            const orderClass = orderMap[performer.rank];
                            
                            // Proportional scaling: 3 items take roughly 96% on mobile, 5 take 95% on desktop
                            const widthClass = "w-[32%] lg:w-[19%]";
                            
                            // Hide ranks 4 and 5 on mobile to save space
                            const displayClass = performer.rank > 3 ? "hidden lg:flex" : "flex";

                            return (
                                <motion.div
                                    key={performer.rank}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + (5 - performer.rank) * 0.15, type: "spring", stiffness: 100 }}
                                    className={`relative ${widthClass} ${orderClass} ${displayClass} flex-col items-center group mb-4 lg:mb-4`}
                                >
                                    {/* Data Section (Floating above the block) */}
                                    <div className={`flex flex-col items-center justify-end z-40 relative pb-6 w-full ${isFirst ? 'scale-110 mb-2' : ''}`}>
                                        
                                        {isFirst && (
                                            <motion.div 
                                                animate={{ y: [0, -8, 0] }} 
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute -top-10 text-yellow-400 drop-shadow-md z-50"
                                            >
                                                <Crown size={32} fill="currentColor" strokeWidth={1} />
                                            </motion.div>
                                        )}

                                        <div className={`relative mb-4 group-hover:-translate-y-2 transition-transform duration-300 ${isFirst ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'}`}>
                                            <div className={`absolute inset-0 rounded-full ${styles.glow} blur-md group-hover:blur-xl transition-all duration-300`}></div>
                                            <div className="absolute inset-0 rounded-full border-[3px] border-white shadow-xl overflow-hidden bg-gray-100 z-10">
                                                {performer.students[0] && (
                                                    <img src={performer.students[0].image} alt={performer.students[0].name} className="w-full h-full object-cover" />
                                                )}
                                                {performer.students.length > 1 && (
                                                    <div className="absolute bottom-0 right-0 bg-gray-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-lg rounded-br-full backdrop-blur-sm">
                                                        +{performer.students.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Rank Badge */}
                                            <div className={`absolute -bottom-3 -right-2 w-8 h-8 rounded-full ${styles.badge} flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white z-20`}>
                                                {performer.rank}
                                            </div>
                                        </div>

                                        <div className="text-center w-full px-2">
                                            {performer.students[0] && (
                                                <>
                                                    <h3 className={`font-black text-gray-900 leading-tight truncate ${isFirst ? 'text-lg mb-1' : 'text-sm sm:text-base'}`}>
                                                        {performer.students[0].name.split('\n').join(' ')}
                                                    </h3>
                                                    <div className={`inline-flex px-3 py-1 rounded-full ${styles.pts} mt-2`}>
                                                        <span className="font-black text-sm md:text-base">
                                                            {performer.points}
                                                        </span>
                                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80 mt-0.5">PTS</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Podium Block Base */}
                                    <div className={`w-[90%] lg:w-full rounded-t-2xl sm:rounded-t-3xl ${styles.card} relative overflow-hidden flex flex-col justify-start items-center pt-2 pb-2 transition-all duration-300 hover:brightness-105 mx-auto ${styles.height}`}>
                                        {/* Internal Shimmer Effect */}
                                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[20deg] group-hover:animate-shimmer pointer-events-none z-0"></div>

                                        {/* Scrollable multi-student list inside rank block if tie */}
                                        <div className={`w-full px-2 sm:px-4 flex flex-col gap-2 relative z-10 overflow-y-auto custom-scrollbar h-full`}>
                                            <style dangerouslySetInnerHTML={{
                                                __html: `
                                            .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                                            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
                                        `}} />
                                             {performer.students.map((student, sIdx) => (
                                                <div key={student.id} className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-2.5 shadow-sm border border-white/50 flex flex-col items-center flex-shrink-0">
                                                    {sIdx > 0 && (
                                                         <div className="text-[9px] font-black text-gray-400 mb-1 w-full text-center border-b border-gray-200/50 pb-1">TIE: {student.name.split('\n')[0]}</div>
                                                    )}
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest truncate w-full text-center">{student.enrollment}</p>
                                                    <div className="flex flex-col items-center mt-1.5 w-full gap-1">
                                                        <div className="flex flex-row gap-1 w-full justify-center">
                                                            <div className="flex flex-col items-center bg-white px-1 sm:px-2 py-1 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100/80 flex-1 overflow-hidden">
                                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                                    <Award size={10} className="text-blue-500 fill-blue-500 shrink-0" />
                                                                    <span className="text-[10px] sm:text-[11px] font-black text-gray-800">{student.srlAttendance}%</span>
                                                                </div>
                                                                <span className="text-[6px] sm:text-[7px] text-gray-400 font-bold leading-none mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">SRL SESSIONS</span>
                                                            </div>
                                                            <div className="flex flex-col items-center bg-white px-1 sm:px-2 py-1 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100/80 flex-1 overflow-hidden">
                                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                                    <Zap size={10} className="text-emerald-500 fill-emerald-500 shrink-0" />
                                                                    <span className="text-[10px] sm:text-[11px] font-black text-gray-800">{student.attendance}%</span>
                                                                </div>
                                                                <span className="text-[6px] sm:text-[8px] text-gray-400 font-bold leading-none mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">OVERALL</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Attendance</span>
                                                    </div>
                                                </div>
                                             ))}
                                        </div>
                                    </div>
                                    
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Table Section: Scrollable from Rank 5 onwards */}
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl p-4 sm:p-6 lg:p-8 relative">
                            {/* Container Watermark */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-[100%] z-0 opacity-[0.25] pointer-events-none mix-blend-multiply origin-center"
                                style={{
                                    backgroundImage: 'url("/watermark.png")',
                                    backgroundPosition: 'center',
                                    backgroundSize: '25%',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></motion.div>
                            <div className="max-h-[600px] overflow-y-auto scrollable-container pr-2 relative z-10">
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                .scrollable-container::-webkit-scrollbar { width: 6px; }
                                .scrollable-container::-webkit-scrollbar-track { background: transparent; }
                                .scrollable-container::-webkit-scrollbar-thumb { background: #fde68a; border-radius: 10px; }
                                .scrollable-container::-webkit-scrollbar-thumb:hover { background: #fac131ff; }
                            `}} />
                                <div className="flex flex-col gap-3">
                                    {regularPerformers.map((student, idx) => {
                                        // Ranks 4 and 5 are hidden on desktop (in podium instead) but shown on mobile
                                        const displayClass = student.rank <= 5 ? "flex lg:hidden" : "flex";
                                        return (
                                        <motion.div
                                            key={student.name}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (idx * 0.05) }}
                                            className={`${displayClass} flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/85 hover:bg-gradient-to-r hover:from-white/90 hover:to-amber-50/90 border border-gray-100/80 rounded-[1.5rem] transition-all duration-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 group relative overflow-hidden backdrop-blur-sm`}
                                        >


                                            {/* Shiny effect on hover for the list items */}
                                            <div className="absolute top-0 bottom-0 left-[-100%] w-[100%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[10deg] transition-all duration-700 ease-in-out group-hover:left-[200%] z-0 pointer-events-none"></div>

                                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 relative z-10 w-full">
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-1">
                                                    <div className="w-[30px] sm:w-[40px] text-center font-black text-gray-400 group-hover:text-amber-500 transition-colors text-sm sm:text-lg">
                                                        #{student.rank}
                                                    </div>

                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gray-100 flex-shrink-0 group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                                        <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                                    </div>

                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-[12px] sm:text-[15px] font-bold text-gray-800 group-hover:text-amber-900 transition-colors truncate">{student.name}</h4>
                                                            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100/50 text-amber-700 text-[9px] font-black uppercase tracking-wider">{student.batch}</span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                            <span className="text-[9px] sm:text-[11px] font-medium text-gray-500 group-hover:text-gray-600">
                                                                {student.enrollment} • {student.dept}
                                                            </span>
                                                            <span className="text-[8px] sm:text-[10px] bg-gray-100 group-hover:bg-amber-100/50 group-hover:text-amber-700 text-gray-500 px-1.5 sm:px-2 py-0.5 rounded-md font-bold transition-colors">
                                                                {student.semester} Sem
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 w-full sm:w-auto px-1 sm:px-0 pr-2 sm:pr-4 shrink-0 mt-1 sm:mt-0 border-t border-gray-100/50 sm:border-0 pt-3 sm:pt-0">
                                                    {/* New Attendance Column at the marked blue dot position */}
                                                    <div className="flex flex-col items-center justify-center min-w-[70px] gap-1">
                                                        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6">
                                                            {/* SRL Attendance (Left) */}
                                                            <div className="flex flex-col items-center">
                                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                                    <Award size={14} className="text-blue-500 fill-blue-500 opacity-90 sm:w-4 sm:h-4 w-3.5 h-3.5" />
                                                                    <span className="text-sm sm:text-lg font-black text-blue-600 drop-shadow-sm">
                                                                        {student.srlAttendance}%
                                                                    </span>
                                                                </div>
                                                                <div className="text-[6px] sm:text-[8px] font-bold text-gray-400 tracking-widest mt-0.5 whitespace-nowrap">SRL SESSIONS</div>
                                                            </div>

                                                            <div className="h-6 sm:h-8 w-px bg-gray-200/60 block"></div>

                                                            {/* Overall Attendance (Right) */}
                                                            <div className="flex flex-col items-center">
                                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                                    <Zap size={14} className="text-emerald-500 fill-emerald-500 opacity-90 sm:w-4 sm:h-4 w-3.5 h-3.5" />
                                                                    <span className="text-sm sm:text-lg font-black text-emerald-600 drop-shadow-sm">
                                                                        {student.attendance}%
                                                                    </span>
                                                                </div>
                                                                <div className="text-[6px] sm:text-[8px] font-bold text-gray-400 tracking-widest mt-0.5">OVERALL</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-[8px] sm:text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5 sm:mt-1">Attendance</div>
                                                    </div>

                                                    <div className="text-right border-l border-gray-100/80 pl-4 sm:pl-6">
                                                        <div className="text-base sm:text-xl font-black text-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-500 drop-shadow-sm">
                                                            {student.score}
                                                        </div>
                                                        <div className="text-[7px] sm:text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">PTS</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                </div>
            )}
        </motion.div >
    );
};

export default LeaderBoard;