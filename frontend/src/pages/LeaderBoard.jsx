import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Target, Zap, Clock, TrendingUp, Users, Award, BookOpen, Crown, Search, Calendar, Timer } from "lucide-react";
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
    { name: "Jadeja Bhagyashree Vanrajsinh", enrollment: "24BECE30099", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: encodeURI("/students/Jadeja Bhagyashree.jpeg"), attendance: 10 },
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
    { name: "Pandya Aayush Viral", enrollment: "24BECE30541", dept: "CE", semester: "4th", div: "P", batch: "2024-2028", image: encodeURI("/students/Pandya Aayush Viral.jpeg"), attendance: 11 },
    { name: "Parmar Mahi Nitinchandra", enrollment: "24BECE30548", dept: "CE", semester: "4th", div: "P", batch: "2024-2028", image: encodeURI("/students/Parmar Mahi Nitinchandra.jpeg"), attendance: 11 },
    { name: "Parva Kumar", enrollment: "22BECE30153", dept: "CE", semester: "8th", div: "C", batch: "2022-2026", image: encodeURI("/students/Parva Kumar.jpeg"), attendance: 1 },
    { name: "Pragati Varu", enrollment: "24BECE30436", dept: "CE", semester: "4th", div: "F", batch: "2024-2028", image: encodeURI("/students/Pragati Varu.jpeg"), attendance: 9 },
    { name: "Prem Raichura", enrollment: "224SBECE30059", dept: "CE", semester: "6th", div: "F", batch: "2023-2027", image: encodeURI("/students/Prem Raichura.jpeg"), attendance: 3 },
    { name: "Ridham Patel", enrollment: "22BEIT30133", dept: "IT", semester: "8th", div: "J", batch: "2022-2026", image: encodeURI("/students/Ridham Patel.png"), attendance: 1 },
    { name: "Rohan Thakar", enrollment: "23BECE30364", dept: "CE", semester: "6th", div: "F", batch: "2023-2027", image: encodeURI("/students/Rohan Thakar.png"), attendance: 7 },
    { name: "Yajurshi Velani", enrollment: "24BECE30441", dept: "CE", semester: "4th", div: "F", batch: "2024-2028", image: encodeURI("/students/Yajurshi Velani.png"), attendance: 7 },
    { name: "Zenisha Devani", enrollment: "23BECE30058", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: encodeURI("/students/Zenisha Devani.jpeg"), attendance: 3 },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://studentsresearchlab-1.onrender.com';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Merge backend data with static profiles
const mergeProfiles = (leaderboard) => {
    const profileMap = {};
    STUDENT_PROFILES.forEach(p => {
        profileMap[p.enrollment.trim().toUpperCase()] = p;
    });
    return leaderboard.map((student, index) => {
        const en = student.enrollment_no.trim().toUpperCase();
        const profile = profileMap[en] || {};
        return {
            ...profile,
            id: index + 1,
            enrollment: student.enrollment_no,
            name: student.name || profile.name || "Unknown Student",
            image: student.image || profile.image || "/SRL.svg",
            score: student.score || 0,
            attendance: student.attendance || 0,
            srlAttendance: student.srlAttendance || 0,
            totalHours: student.totalHours || 0,
            rank: student.rank,
        };
    });
};

const LeaderBoard = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [monthlyStudents, setMonthlyStudents] = useState([]);
    const [top5ByHours, setTop5ByHours] = useState([]);
    const [monthLabel, setMonthLabel] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const [overallRes, monthlyRes, hoursRes] = await Promise.all([
                    fetch(`${API_BASE}/api/leaderboard`),
                    fetch(`${API_BASE}/api/leaderboard/monthly`),
                    fetch(`${API_BASE}/api/leaderboard/top-hours`),
                ]);

                if (!overallRes.ok) throw new Error("Failed to fetch overall leaderboard");

                const { leaderboard: overallData } = await overallRes.json();
                const mergedOverall = mergeProfiles(overallData);
                setAllStudents(mergedOverall);

                if (monthlyRes.ok) {
                    const monthlyJson = await monthlyRes.json();
                    const mergedMonthly = mergeProfiles(monthlyJson.leaderboard);
                    setMonthlyStudents(mergedMonthly);
                    setMonthLabel((monthlyJson.monthName || MONTH_NAMES[(monthlyJson.month || 1) - 1]) + ' ' + monthlyJson.year);
                } else {
                    // Fallback: use overall data for monthly
                    setMonthlyStudents(mergedOverall);
                    setMonthLabel(MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear());
                }

                if (hoursRes.ok) {
                    const hoursJson = await hoursRes.json();
                    setTop5ByHours(mergeProfiles(hoursJson.leaderboard));
                } else {
                    setTop5ByHours([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error building leaderboard:", error);
                const fallbackStudents = STUDENT_PROFILES.map((s, i) => ({ ...s, id: i + 1, score: 0, rank: i + 1, attendance: 0, srlAttendance: 0, totalHours: 0 }));
                setAllStudents(fallbackStudents);
                setMonthlyStudents(fallbackStudents);
                setTop5ByHours(fallbackStudents.slice(0, 5));
                setMonthLabel(MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear());
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // Top 5 by points (overall)
    const top5ByPoints = allStudents.slice(0, 5);
    // Top 5 monthly
    const top5Monthly = monthlyStudents.slice(0, 5);


    // Reusable podium section with all 5 members in a horizontal row
    const PodiumSection = ({ title, icon: Icon, students, valueKey = "score", valueLabel = "PTS", accentColor = "bg-amber-100 text-amber-800" }) => {
        const getValue = (student) => {
            const val = valueKey === 'score' ? student.score : student[valueKey];
            const suffix = (valueKey === 'attendance' || valueKey === 'srlAttendance') ? '%' : '';
            return `${val}${suffix}`;
        };
        const getDisplayName = (student) => (student.name || '').split('\n').join(' ');

        // Display order: Rank 4, Rank 2, Rank 1, Rank 3, Rank 5
        const displayOrder = students.length >= 5
            ? [students[3], students[1], students[0], students[2], students[4]]
            : students.length >= 3
                ? [students[1], students[0], students[2], ...students.slice(3)]
                : students;
        const rankMap = students.length >= 5
            ? [4, 2, 1, 3, 5]
            : students.length >= 3
                ? [2, 1, 3, ...students.slice(3).map((_, i) => i + 4)]
                : students.map((_, i) => i + 1);

        const podiumConfig = {
            1: { podiumH: 'h-[220px]', avatarSize: 'w-[70px] h-[70px]', ringColor: 'ring-yellow-400', gradient: 'from-yellow-100 via-amber-50 to-yellow-200', border: 'border-yellow-300', textColor: 'text-yellow-700', scoreSize: 'text-base', rankBg: 'bg-yellow-400', rankText: 'text-white' },
            2: { podiumH: 'h-[190px]', avatarSize: 'w-[58px] h-[58px]', ringColor: 'ring-slate-300', gradient: 'from-slate-100 via-gray-50 to-slate-200', border: 'border-slate-300', textColor: 'text-slate-600', scoreSize: 'text-sm', rankBg: 'bg-slate-400', rankText: 'text-white' },
            3: { podiumH: 'h-[170px]', avatarSize: 'w-[54px] h-[54px]', ringColor: 'ring-orange-300', gradient: 'from-orange-100 via-amber-50 to-orange-200', border: 'border-orange-300', textColor: 'text-orange-700', scoreSize: 'text-sm', rankBg: 'bg-orange-400', rankText: 'text-white' },
            4: { podiumH: 'h-[150px]', avatarSize: 'w-[48px] h-[48px]', ringColor: 'ring-gray-200', gradient: 'from-gray-50 to-gray-100', border: 'border-gray-200', textColor: 'text-gray-500', scoreSize: 'text-xs', rankBg: 'bg-gray-300', rankText: 'text-gray-600' },
            5: { podiumH: 'h-[150px]', avatarSize: 'w-[44px] h-[44px]', ringColor: 'ring-gray-200', gradient: 'from-gray-50 to-gray-100', border: 'border-gray-200', textColor: 'text-gray-500', scoreSize: 'text-xs', rankBg: 'bg-gray-300', rankText: 'text-gray-600' },
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
                {/* Section Header */}
                <div className={`flex items-center gap-2 px-4 py-3 ${accentColor} border-b border-gray-100`}>
                    <Icon size={18} className="opacity-80" />
                    <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
                </div>

                {/* Podium Area — all 5 in a row */}
                <div className="px-3 pt-14 pb-4">
                    <div className="flex items-end justify-center gap-1.5 sm:gap-2">
                        {displayOrder.map((student, idx) => {
                            if (!student) return null;
                            const rank = rankMap[idx];
                            const cfg = podiumConfig[rank] || podiumConfig[5];
                            const displayName = getDisplayName(student);
                            return (
                                <motion.div
                                    key={student.enrollment + '-pod-' + rank}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + idx * 0.08, type: 'spring', stiffness: 200 }}
                                    className="flex-1 flex flex-col items-center relative group"
                                >
                                    {/* Crown for Rank 1 */}
                                    {rank === 1 && (
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            className="absolute z-20"
                                            style={{ top: '-8px' }}
                                        >
                                            <Crown size={20} className="text-yellow-500 drop-shadow-md" fill="currentColor" strokeWidth={1} />
                                        </motion.div>
                                    )}

                                    {/* Floating Avatar */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, y: -4 }}
                                        className={`${cfg.avatarSize} rounded-full overflow-hidden border-[3px] border-white ring-2 ${cfg.ringColor} shadow-lg bg-gray-100 relative z-10 mb-[-20px] cursor-pointer`}
                                        style={{ marginTop: rank === 1 ? '14px' : '0px' }}
                                    >
                                        <img src={student.image || '/SRL.svg'} alt={displayName} className="w-full h-full object-cover" />
                                    </motion.div>

                                    {/* Podium Card */}
                                    <motion.div
                                        whileHover={{ y: -3 }}
                                        className={`w-full ${cfg.podiumH} bg-gradient-to-b ${cfg.gradient} rounded-xl border ${cfg.border} flex flex-col items-center justify-end pb-2 pt-8 px-1 shadow-sm group-hover:shadow-md transition-all duration-300 cursor-default`}
                                    >
                                        {/* Rank Number */}
                                        <div className={`${cfg.rankBg} ${cfg.rankText} w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mb-1 shadow-sm shrink-0`}>
                                            {rank}
                                        </div>
                                        {/* Name */}
                                        <div className="w-full px-0.5 mb-0.5 flex items-center justify-center flex-1">
                                            <p className={`font-bold text-gray-800 text-center leading-[1.1] line-clamp-2 break-words ${rank === 1 ? 'text-[11px] sm:text-[12px]' : 'text-[9px] sm:text-[10px]'}`} title={displayName}>
                                                {displayName}
                                            </p>
                                        </div>
                                        {/* Enrollment */}
                                        <p className="text-[7px] text-gray-500 font-semibold truncate w-full text-center leading-none mb-1 shrink-0">
                                            {student.enrollment}
                                        </p>
                                        {/* Score */}
                                        <span className={`${cfg.scoreSize} font-black ${cfg.textColor} leading-tight`}>
                                            {getValue(student)}
                                        </span>
                                        <span className="text-[6px] font-bold text-gray-400 uppercase text-center whitespace-pre-line">{valueLabel}</span>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-white min-h-screen">
            <style>{`
                .leaderboard-scroll::-webkit-scrollbar { width: 5px; }
                .leaderboard-scroll::-webkit-scrollbar-track { background: transparent; }
                .leaderboard-scroll::-webkit-scrollbar-thumb { background: #fde68a; border-radius: 10px; }
                .leaderboard-scroll::-webkit-scrollbar-thumb:hover { background: #fbbf24; }
            `}</style>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-[96px] lg:pt-[112px] pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans max-w-screen-2xl mx-auto"
            >
                {/* Background Accents */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none z-0"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[120px] pointer-events-none z-0"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none z-0"></div>

                {/* Rotating Watermarks */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                    className="fixed -top-[30vw] -left-[30vw] lg:-top-[400px] lg:-left-[400px] w-[120vw] h-[120vw] lg:w-[1000px] lg:h-[1000px] opacity-[0.25] pointer-events-none z-0"
                    style={{ backgroundImage: 'url("/watermark.svg")', backgroundPosition: 'center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                    className="fixed -bottom-[30vw] -right-[30vw] lg:-bottom-[400px] lg:-right-[400px] w-[120vw] h-[120vw] lg:w-[1000px] lg:h-[1000px] opacity-[0.25] pointer-events-none z-0"
                    style={{ backgroundImage: 'url("/watermark.svg")', backgroundPosition: 'center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                />

                {loading ? (
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Header Skeleton */}
                        <div className="flex flex-col items-center justify-center gap-4 mb-8 text-center animate-pulse">
                            <div className="w-32 h-8 bg-white/60 rounded-full border border-gray-200 mb-2"></div>
                            <div className="w-3/4 max-w-lg h-12 sm:h-16 bg-gray-200/60 rounded-xl"></div>
                            <div className="w-2/3 max-w-sm h-4 bg-gray-200/60 rounded-md mt-2"></div>
                        </div>

                        {/* Two-Column Dashboard Layout Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:items-stretch">
                            {/* LEFT COLUMN: Three Podium Sections Skeletons */}
                            <div className="flex flex-col gap-5">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white/60 rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                                            <div className="w-5 h-5 bg-gray-200/80 rounded-full"></div>
                                            <div className="w-32 h-4 bg-gray-200/80 rounded-md"></div>
                                        </div>
                                        <div className="px-3 pt-14 pb-4">
                                            <div className="flex items-end justify-center gap-1.5 sm:gap-2">
                                                {[110, 150, 180, 130, 110].map((h, j) => (
                                                    <div key={j} className="flex-1 flex flex-col items-center">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200/80 rounded-full mb-[-15px] relative z-10 border-[3px] border-white"></div>
                                                        <div className={`w-full bg-gray-100/80 rounded-xl`} style={{ height: `${h}px` }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT COLUMN: Full Member Rankings Skeleton */}
                            <div className="relative h-[600px] lg:h-auto lg:min-h-0">
                                <div className="lg:absolute lg:inset-0 w-full h-full bg-white/60 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0 animate-pulse">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 border-b border-gray-100 shrink-0">
                                        <div className="w-5 h-5 bg-gray-200/80 rounded-full"></div>
                                        <div className="w-40 h-4 bg-gray-200/80 rounded-md"></div>
                                    </div>
                                    <div className="flex-1 overflow-hidden p-3 space-y-2">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100/50">
                                                <div className="w-4 h-5 bg-gray-200/60 rounded-md shrink-0"></div>
                                                <div className="w-10 h-10 bg-gray-200/60 rounded-xl shrink-0"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-200/60 rounded-md w-1/3"></div>
                                                    <div className="h-3 bg-gray-200/60 rounded-md w-1/2"></div>
                                                </div>
                                                <div className="hidden sm:flex gap-4 shrink-0 px-2">
                                                    <div className="flex flex-col items-center gap-1"><div className="w-6 h-4 bg-gray-200/60 rounded"></div><div className="w-8 h-2 bg-gray-200/60 rounded"></div></div>
                                                    <div className="flex flex-col items-center gap-1"><div className="w-6 h-4 bg-gray-200/60 rounded"></div><div className="w-8 h-2 bg-gray-200/60 rounded"></div></div>
                                                    <div className="flex flex-col items-center gap-1"><div className="w-6 h-4 bg-gray-200/60 rounded"></div><div className="w-8 h-2 bg-gray-200/60 rounded"></div></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Header */}
                        <motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center justify-center gap-4 mb-8 text-center relative"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-2">
                                <TrendingUp size={16} className="text-amber-600" />
                                <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">Top Performers</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                                Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Leaderboard</span>
                            </h1>
                            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base font-medium mt-2 leading-relaxed">
                                Recognizing outstanding dedication, academic excellence, and continuous contribution to the research lab.
                            </p>
                        </motion.div>

                        {/* Two-Column Dashboard Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:items-stretch">

                            {/* LEFT COLUMN: Three Podium Sections */}
                            <div className="flex flex-col gap-5">
                                <PodiumSection
                                    title="Top 5 by Points"
                                    icon={Trophy}
                                    students={top5ByPoints}
                                    valueKey="score"
                                    valueLabel="PTS"
                                    accentColor="bg-amber-50 text-amber-800"
                                />
                                <PodiumSection
                                    title={`Monthly Top 5 — ${monthLabel}`}
                                    icon={Calendar}
                                    students={top5Monthly}
                                    valueKey="score"
                                    valueLabel="PTS"
                                    accentColor="bg-teal-50 text-teal-800"
                                />
                                <PodiumSection
                                    title="Top 5 by Hours — February 2026"
                                    icon={Timer}
                                    students={top5ByHours}
                                    valueKey="totalHours"
                                    valueLabel={"Hours\nDedicated"}
                                    accentColor="bg-violet-50 text-violet-800"
                                />
                            </div>

                            {/* RIGHT COLUMN: Full Member Rankings */}
                            <div className="relative h-[600px] lg:h-auto lg:min-h-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="lg:absolute lg:inset-0 w-full h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0"
                                >
                                    {/* Section Header */}
                                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-800 border-b border-gray-100 shrink-0">
                                        <Users size={18} />
                                        <h3 className="text-sm font-bold tracking-wide uppercase">All Member Rankings</h3>
                                        <span className="ml-auto text-xs text-gray-400 font-semibold">{allStudents.length} members</span>
                                    </div>
                                    {/* Member List */}
                                    <div className="flex-1 overflow-y-auto leaderboard-scroll p-3 space-y-2">
                                    {allStudents.map((student, idx) => {
                                        const displayName = (student.name || '').split('\n').join(' ');
                                        return (
                                            <motion.div
                                                key={student.enrollment + '-all-' + idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.03 * Math.min(idx, 15) }}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                                            >
                                                {/* Rank Number */}
                                                <div className="w-7 text-center shrink-0">
                                                    <span className={`text-sm font-black ${student.rank <= 3 ? 'text-amber-500' : student.rank <= 5 ? 'text-teal-500' : 'text-gray-400'}`}>
                                                        {student.rank}
                                                    </span>
                                                </div>
                                                {/* Profile Photo */}
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white ring-1 ring-gray-100 shadow-sm bg-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                                                    <img src={student.image || '/SRL.svg'} alt={displayName} className="w-full h-full object-cover" />
                                                </div>
                                                {/* Student Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="inline-block bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded">{student.batch}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                                                        {student.enrollment} <span className="mx-0.5">•</span> {student.dept} <span className="mx-0.5">•</span> {student.semester} Sem
                                                    </p>
                                                </div>
                                                {/* Stats */}
                                                <div className="hidden sm:flex items-center gap-3 shrink-0">
                                                    <div className="text-center">
                                                        <p className="text-xs font-black text-blue-500">{student.srlAttendance}%</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center">SRL<br/>Sessions</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-100"></div>
                                                    <div className="text-center">
                                                        <p className="text-xs font-black text-emerald-500">{student.attendance}%</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center">Hours<br/>Dedicated</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-100"></div>
                                                    <div className="text-center min-w-[36px]">
                                                        <p className="text-sm font-black text-gray-800">{student.score}</p>
                                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">PTS</p>
                                                    </div>
                                                </div>
                                                {/* Mobile stats (compact) */}
                                                <div className="flex sm:hidden flex-col items-end shrink-0">
                                                    <span className="text-sm font-black text-gray-800">{student.score} <span className="text-[8px] text-gray-400">PTS</span></span>
                                                    <span className="text-[10px] text-blue-500 font-bold">SRL Sessions: {student.srlAttendance}%</span>
                                                    <span className="text-[10px] text-emerald-500 font-bold">Hours Dedicated: {student.attendance}%</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default LeaderBoard;