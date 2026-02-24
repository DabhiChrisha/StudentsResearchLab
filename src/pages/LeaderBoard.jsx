import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Target, Zap, TrendingUp, Users, Award, BookOpen, Crown, Search } from "lucide-react";

const topPerformers = [
    {
        rank: 1,
        points: 84,
        students: [
            { id: 1, name: "Kandarp\nDipakkumar\nGajjar", image: encodeURI("/students/Kandarp Gajjar.jpeg"), enrollment: "22BECE30091", dept: "CE", semester: "8th", attendance: 11 },
            { id: 2, name: "Nancy Rajesh\nPatel", image: encodeURI("/students/Nancy.jpeg"), enrollment: "22BEIT30123", dept: "IT", semester: "8th", attendance: 8 }
        ]
    },
    {
        rank: 2,
        points: 58,
        students: [
            { id: 3, name: "Pande Hemant\nRameshwarkumar", image: encodeURI("/students/Pande Hemant Rameshwarkumar.jpeg"), enrollment: "23BECE30493", dept: "CE", semester: "6th", attendance: 12 }
        ]
    },
    {
        rank: 3,
        points: 54,
        students: [
            { id: 4, name: "Patel Krish\nHimanshu", image: encodeURI("/students/Patel Krish Himanshu.jpeg"), enrollment: "23BECE30532", dept: "CE", semester: "6th", attendance: 12 }
        ]
    },
    {
        rank: 4,
        points: 54,
        students: [
            { id: 5, name: "Patel Banshari\nRahulkumar", image: encodeURI("/students/Patel Banshari Rahulkumar.jpg"), enrollment: "23BECE30168", dept: "CE", semester: "6th", attendance: 9 }
        ]
    }
];

const studentsList = [
    { name: "Jenish Sorathiya", enrollment: "23BEIT54020", dept: "IT", semester: "6th", div: "-", batch: "2023-2027", image: "Jenish Sorathiya.jpeg", score: 50, attendance: 11 },
    { name: "Patel Jainee Hasmukhbhai", enrollment: "23BECE30203", dept: "CE", semester: "6th", div: "C", batch: "2023-2027", image: "Patel Jainee Hasmukhbhai.jpeg", score: 46, attendance: 10 },
    { name: "Dabhi Chrisha Manish", enrollment: "24BECE30489", dept: "CE", semester: "4th", div: "G", batch: "2024-2028", image: "Dabhi Chrisha Manish.png", score: 36, attendance: 11 },
    { name: "Kansara Dev Dharmeshkumar", enrollment: "24BECE30114", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: "Kansara Dev Dharmeshkumar.jpeg", score: 35, attendance: 10 },
    { name: "Yash Kumavat", enrollment: "24BECE30122", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: "Yash Kumavat.jpeg", score: 35, attendance: 10 },
    { name: "Halvdadiya Rudr", enrollment: "24BECE30094", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: "Halvdadiya Rudr.jpeg", score: 35, attendance: 10 },
    { name: "Gajjar Antra Ashvinkumar", enrollment: "24BECE30081", dept: "CE", semester: "4th", div: "B", batch: "2024-2028", image: "Gajjar Antra Ashvinkumar.jpeg", score: 34, attendance: 10 },
    { name: "Chavda Yashvi Surendrasinh", enrollment: "23BECE30036", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: "Chavda Yashvi Surendrasinh.jpeg", score: 33, attendance: 3 },
    { name: "Devda Rachita Bharatsinh", enrollment: "23BECE30059", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: "Devda Rachita Bharatsinh.jpeg", score: 32, attendance: 2 },
    { name: "Ghetiya Poojan Rahulbhai", enrollment: "25MECE30003", dept: "CE", semester: "1st", div: "J", batch: "2025-2027", image: "Ghetiya Poojan Rahulbhai.jpeg", score: 32, attendance: 2 },
    { name: "Heny Patel", enrollment: "23BECE30521", dept: "CE", semester: "6th", div: "P", batch: "2023-2027", image: "Heny Patel.jpeg", score: 31, attendance: 6 },
    { name: "Hetvi Hinsu", enrollment: "23BECE30449", dept: "CE", semester: "6th", div: "G", batch: "2023-2027", image: "Hetvi Hinsu.jpeg", score: 30, attendance: 5 },
    { name: "Honey Modha", enrollment: "224SBECE30016", dept: "CE", semester: "6th", div: "B", batch: "2023-2027", image: "Honey Modha.jpeg", score: 30, attendance: 3 },
    { name: "Janki Chitroda", enrollment: "23BECE30040", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: "Janki Chitroda.jpeg", score: 28, attendance: 3 },
    { name: "Kanksha Keyur Buch", enrollment: "23BECE30029", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: "Kanksha Keyur Buch.jpeg", score: 28, attendance: 4 },
    { name: "Kanudawala Zeel PareshKumar", enrollment: "23BECE30101", dept: "CE", semester: "6th", div: "B", batch: "2023-2027", image: "Kanudawala Zeel PareshKumar.jpeg", score: 27, attendance: 7 },
    { name: "Krishna Bhatt", enrollment: "23BECE30023", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: "Krishna Bhatt.jpeg", score: 26, attendance: 2 },
    { name: "Krutika Vijaybhai Patel", enrollment: "22BEIT30118", dept: "IT", semester: "8th", div: "J", batch: "2022-2026", image: "Krutika Vijaybhai Patel.jpeg", score: 25, attendance: 1 },
    { name: "Mihir Patel", enrollment: "23BECE30542", dept: "CE", semester: "6th", div: "P", batch: "2023-2027", image: "Mihir Patel.png", score: 25, attendance: 8 },
    { name: "Padh Charmi Ketankumar", enrollment: "23BECE30144", dept: "CE", semester: "6th", div: "C", batch: "2023-2027", image: "Padh Charmi Ketankumar.jpeg", score: 24, attendance: 3 },
    { name: "Panchal Henit Shaileshbhai", enrollment: "23BECE30490", dept: "CE", semester: "6th", div: "P", batch: "2023-2027", image: "Panchal Henit Shaileshbhai.jpeg", score: 23, attendance: 8 },
    { name: "Pandya Aayush Viral", enrollment: "24BECE30541", dept: "CE", semester: "4th", div: "P", batch: "2024-2028", image: "Pandya Aayush Viral.jpeg", score: 22, attendance: 11 },
    { name: "Parmar Mahi Nitinchandra", enrollment: "24BECE30548", dept: "CE", semester: "4th", div: "P", batch: "2024-2028", image: "Parmar Mahi Nitinchandra.JPG", score: 22, attendance: 11 },
    { name: "Parva Kumar", enrollment: "22BECE30153", dept: "CE", semester: "8th", div: "C", batch: "2022-2026", image: "Parva Kumar.jpeg", score: 21, attendance: 1 },
    { name: "Pragati Varu", enrollment: "24BECE30436", dept: "CE", semester: "4th", div: "F", batch: "2024-2028", image: "Pragati Varu.jpeg", score: 20, attendance: 9 },
    { name: "Prem Raichura", enrollment: "224SBECE30059", dept: "CE", semester: "6th", div: "F", batch: "2023-2027", image: "Prem Raichura.jpeg", score: 18, attendance: 3 },
    { name: "Ridham Patel", enrollment: "22BEIT30133", dept: "IT", semester: "8th", div: "J", batch: "2022-2026", image: "Ridham Patel.png", score: 18, attendance: 1 },
    { name: "Rohan Thakar", enrollment: "23BECE30364", dept: "CE", semester: "6th", div: "F", batch: "2023-2027", image: "Rohan Thakar.png", score: 17, attendance: 7 },
    { name: "Yajurshi Velani", enrollment: "24BECE30094", dept: "CE", semester: "4th", div: "F", batch: "2024-2028", image: "Yajurshi Velani.png", score: 15, attendance: 7 },
    { name: "Zenisha Devani", enrollment: "23BECE30058", dept: "CE", semester: "6th", div: "A", batch: "2023-2027", image: "Zenisha Devani.jpeg", score: 10, attendance: 3 },
];

const sortedOtherStudents = studentsList
    .filter(s => !topPerformers.some(tp => tp.students.some(tps => tps.name === s.name)))
    .sort((a, b) => b.score - a.score);

let currentRank = 4;
let lastScore = null;

const regularPerformers = sortedOtherStudents.map((student) => {
    if (student.score !== lastScore) {
        currentRank++;
        lastScore = student.score;
    }
    return {
        ...student,
        rank: currentRank,
        image: encodeURI(`/students/${student.image}`),
    };
});

const LeaderBoard = () => {
    const rankStyles = {
        1: {
            card: "bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-300 border-yellow-500 border-3 shadow-yellow-200/50 lg:col-span-2",
            badge: "bg-gradient-to-tr from-yellow-400 to-amber-500",
            glow: "bg-yellow-200/40",
            pts: "bg-yellow-500/10 text-yellow-800 border-yellow-200/50"
        },
        2: {
            card: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-slate-400 shadow-slate-400/40",
            badge: "bg-gradient-to-tr from-slate-500 to-slate-700",
            glow: "bg-slate-300/50",
            pts: "bg-white/40 text-slate-900 border-white/50"
        },
        3: {
            card: "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border-orange-200 shadow-orange-100/30",
            badge: "bg-gradient-to-tr from-orange-400 to-orange-500",
            glow: "bg-orange-200/30",
            pts: "bg-orange-500/10 text-orange-800 border-orange-200/50"
        },
        4: {
            card: "bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 border-sky-200 shadow-sky-100/30",
            badge: "bg-gradient-to-tr from-sky-400 to-sky-500",
            glow: "bg-sky-200/30",
            pts: "bg-sky-500/10 text-sky-800 border-sky-200/50"
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen relative overflow-hidden"
        >
            {/* Animated Rotating Watermarks */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="fixed -top-[30vw] -left-[30vw] lg:-top-[400px] lg:-left-[400px] w-[120vw] h-[120vw] lg:w-[1000px] lg:h-[1000px] opacity-[0.35] pointer-events-none z-0"
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
                className="fixed -bottom-[30vw] -right-[30vw] lg:-bottom-[400px] lg:-right-[400px] w-[120vw] h-[120vw] lg:w-[1000px] lg:h-[1000px] opacity-[0.35] pointer-events-none z-0"
                style={{
                    backgroundImage: 'url("/watermark.png")',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Header Section */}
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-3 mb-12 text-center"
                >
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-amber-500 border border-amber-100">
                        <Trophy size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Research Leaderboard</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm font-medium">Recognizing excellence in contribution, innovation, and academic performance.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Top Performer Cards: Rank 1-4 (Static) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-12 px-4">
                        {topPerformers.map((performer, idx) => (
                            <motion.div
                                key={performer.rank}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative ${rankStyles[performer.rank].card} rounded-[2rem] p-6 flex flex-col items-center border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30 group overflow-hidden`}
                            >
                                {/* Continuous Shiny effect overlay */}
                                <motion.div
                                    className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[15deg] z-30 pointer-events-none"
                                    animate={{ left: ['auto', '150%'] }}
                                    initial={{ left: '-150%' }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                                />

                                <div className={`absolute top-5 right-5 w-8 h-8 ${rankStyles[performer.rank].badge} rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-lg ring-4 ring-white/50 z-20`}>
                                    #{performer.rank}
                                </div>

                                <div className={`flex ${performer.rank === 1 ? 'gap-8' : 'flex-col'} items-center justify-center w-full relative z-10`}>
                                    {performer.students.map((student) => (
                                        <div key={student.id} className="flex flex-col items-center">
                                            <div className="relative mt-2 mb-4">
                                                <div className={`absolute inset-0 rounded-full ${rankStyles[performer.rank].glow} blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl relative z-10 overflow-hidden bg-white/50 backdrop-blur-sm transform transition-transform duration-500 group-hover:scale-105">
                                                    <img src={student.image} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                            </div>

                                            <div className="text-center mb-4">
                                                <h3 className="text-sm font-black text-gray-900 leading-tight mb-1 whitespace-pre-line">{student.name}</h3>
                                                <div className="flex flex-col items-center">
                                                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{student.enrollment}</p>
                                                    <p className="text-[10px] font-black text-gray-900 mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">{student.dept} • {student.semester} Sem</p>
                                                    <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-sm backdrop-blur-md">
                                                        <img src="/Attendance1.png" alt="Attendance" className="w-3.5 h-3.5 object-contain intensity-high" style={{ filter: 'brightness(0.8) sepia(1) hue-rotate(70deg) saturate(500%)' }} />
                                                        <span className="text-[9px] font-black text-emerald-900 tracking-wider">
                                                            {student.attendance} ATTENDANCE
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`mt-auto ${rankStyles[performer.rank].pts} px-5 py-1.5 rounded-xl text-xs font-black border backdrop-blur-md shadow-sm`}>
                                    {performer.points} PTS
                                </div>
                            </motion.div>
                        ))}
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
                                    {regularPerformers.filter(s => s.rank >= 5).map((student, idx) => (
                                        <motion.div
                                            key={student.name}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (idx * 0.05) }}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/85 hover:bg-gradient-to-r hover:from-white/90 hover:to-amber-50/90 border border-gray-100/80 rounded-[1.5rem] transition-all duration-400 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 group relative overflow-hidden backdrop-blur-sm"
                                        >


                                            {/* Shiny effect on hover for the list items */}
                                            <div className="absolute top-0 bottom-0 left-[-100%] w-[100%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[10deg] transition-all duration-700 ease-in-out group-hover:left-[200%] z-0 pointer-events-none"></div>

                                            <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full">
                                                <div className="w-[40px] text-center font-black text-gray-400 group-hover:text-amber-500 transition-colors text-md sm:text-lg">
                                                    #{student.rank}
                                                </div>

                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gray-100 flex-shrink-0 group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                                        <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                                    </div>

                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-[13px] sm:text-[15px] font-bold text-gray-800 group-hover:text-amber-900 transition-colors truncate">{student.name}</h4>
                                                            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-100/50 text-amber-700 text-[9px] font-black uppercase tracking-wider">{student.batch}</span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 group-hover:text-gray-600">
                                                                {student.enrollment} • {student.dept}
                                                            </span>
                                                            <span className="text-[9px] sm:text-[10px] bg-gray-100 group-hover:bg-amber-100/50 group-hover:text-amber-700 text-gray-500 px-2 py-0.5 rounded-md font-bold transition-colors">
                                                                {student.semester} Sem
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 pr-2 sm:pr-4 shrink-0 mt-2 sm:mt-0">
                                                    {/* New Attendance Column at the marked blue dot position */}
                                                    <div className="flex flex-col items-center justify-center min-w-[70px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <img src="/Attendance1.png" alt="Attendance" className="w-8 h-8 object-contain" style={{ filter: 'brightness(0.8) sepia(1) hue-rotate(70deg) saturate(500%)' }} />
                                                            <span className="text-lg sm:text-xl font-black text-emerald-600 drop-shadow-sm">
                                                                {student.attendance}
                                                            </span>
                                                        </div>
                                                        <div className="text-[8px] sm:text-[9px] font-bold text-gray-400 tracking-widest uppercase">Attendance</div>
                                                    </div>

                                                    <div className="text-right border-l border-gray-100 pl-6">
                                                        <div className="text-lg sm:text-xl font-black text-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-500 drop-shadow-sm">
                                                            {student.score}
                                                        </div>
                                                        <div className="text-[8px] sm:text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">PTS</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div >
        </motion.div >
    );
};

export default LeaderBoard;