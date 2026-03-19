import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Target, Zap, Clock, TrendingUp, Users, Award, BookOpen, Crown, Search, Calendar, Timer } from "lucide-react";
import React, { useState, useEffect } from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-red-500 font-bold"><h1>Something went wrong.</h1><pre>{this.state.error.toString()}</pre></div>;
    }
    return this.props.children; 
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://studentsresearchlab-1.onrender.com';
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Pass-through parser for newly formatted backend objects
const IMAGE_MAP = {
    "22BECE30091": encodeURI("/students/Kandarp Gajjar.jpeg"),
    "22BEIT30123": encodeURI("/students/Nancy.jpeg"),
    "23BECE30493": encodeURI("/students/Pande Hemant Rameshwarkumar.jpeg"),
    "23BECE30532": encodeURI("/students/Patel Krish Himanshu.jpeg"),
    "23BECE30168": encodeURI("/students/Patel Banshari Rahulkumar.jpg"),
    "23BEIT54020": encodeURI("/students/Jenish Sorathiya.jpeg"),
    "23BECE30203": encodeURI("/students/Patel Jainee Hasmukhbhai.jpeg"),
    "24BECE30489": encodeURI("/students/Dabhi Chrisha Manish.png"),
    "24BECE30114": encodeURI("/students/Kansara Dev Dharmeshkumar.jpeg"),
    "24BECE30122": encodeURI("/students/Yash Kumavat.jpeg"),
    "24BECE30094": encodeURI("/students/Halvdadiya Rudr.jpeg"),
    "24BECE30081": encodeURI("/students/Gajjar Antra Ashvinkumar.jpeg"),
    "24BECE30099": encodeURI("/students/Jadeja Bhagyashree.jpeg"),
    "23BECE30036": encodeURI("/students/Chavda Yashvi Surendrasinh.jpeg"),
    "23BECE30059": encodeURI("/students/Devda Rachita Bharatsinh.jpeg"),
    "25MECE30003": encodeURI("/students/Ghetiya Poojan Rahulbhai.jpeg"),
    "23BECE30521": encodeURI("/students/Heny Patel.jpeg"),
    "23BECE30449": encodeURI("/students/Hetvi Hinsu.jpeg"),
    "224SBECE30016": encodeURI("/students/Honey Modha.jpeg"),
    "23BECE30040": encodeURI("/students/Janki Chitroda.jpeg"),
    "23BECE30029": encodeURI("/students/Kanksha Keyur Buch.jpeg"),
    "23BECE30101": encodeURI("/students/Kanudawala Zeel PareshKumar.jpeg"),
    "23BECE30023": encodeURI("/students/Krishna Bhatt.jpeg"),
    "22BEIT30118": encodeURI("/students/Krutika Vijaybhai Patel.jpeg"),
    "23BECE30542": encodeURI("/students/Mihir Patel.png"),
    "23BECE30144": encodeURI("/students/Padh Charmi Ketankumar.jpeg"),
    "23BECE30490": encodeURI("/students/Panchal Henit Shaileshbhai.jpeg"),
    "24BECE30541": encodeURI("/students/Pandya Aayush Viral.jpeg"),
    "24BECE30548": encodeURI("/students/Parmar Mahi Nitinchandra.jpeg"),
    "22BECE30153": encodeURI("/students/Parva Kumar.jpeg"),
    "24BECE30436": encodeURI("/students/Pragati Varu.jpeg"),
    "224SBECE30059": encodeURI("/students/Prem Raichura.jpeg"),
    "22BEIT30133": encodeURI("/students/Ridham Patel.png"),
    "23BECE30364": encodeURI("/students/Rohan Thakar.png"),
    "24BECE30441": encodeURI("/students/Yajurshi Velani.png"),
    "23BECE30058": encodeURI("/students/Zenisha Devani.jpeg"),
};

const parseBackendStudent = (student, index) => {
    const en = student.enrollment_no ? student.enrollment_no.trim().toUpperCase() : "";
    const rawAtt = student.attendance_percentage || "0%";
    const numAtt = parseFloat(rawAtt) || 0;

    return {
        ...student,
        id: index + 1,
        enrollment: student.enrollment_no,
        name: student.name || "Unknown Student",
        image: student.image || IMAGE_MAP[en] || "/SRL.svg",
        score: student.total_score || 0,
        srlAttendance: rawAtt,
        srlAttendanceNum: numAtt,
        totalHours: student.total_hours || "0 Hrs",
        rank: student.rank,
        dept: student.dept || "CE",
        semester: student.semester || "6th",
        div: student.div || "-",
        batch: student.batch || "-",
    };
};

const LeaderBoard = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [monthlyStudents, setMonthlyStudents] = useState([]);
    const [top5ByHours, setTop5ByHours] = useState([]);
    const [monthLabel, setMonthLabel] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [activeTab, setActiveTab] = useState('overall'); // 'overall', 'monthly', 'hours'

    useEffect(() => {
        let retryCount = 0;
        let isActive = true;

        const fetchLeaderboard = async () => {
            try {
                if (retryCount > 0 && isActive) {
                    setLoadingMessage("Waking up server...");
                }

                const [overallRes, monthlyRes, hoursRes] = await Promise.all([
                    fetch(`${API_BASE}/api/leaderboard`),
                    fetch(`${API_BASE}/api/leaderboard/monthly`),
                    fetch(`${API_BASE}/api/leaderboard/top-hours`),
                ]);

                if (!overallRes.ok) throw new Error("Backend not ready or failed to fetch");

                const { leaderboard: overallData } = await overallRes.json();
                const parsedOverall = overallData.map(parseBackendStudent).filter(s => s.name !== 'SRL Admin');
                if (isActive) setAllStudents(parsedOverall);

                if (monthlyRes.ok) {
                    const monthlyJson = await monthlyRes.json();
                    const parsedMonthly = monthlyJson.leaderboard.map(parseBackendStudent).filter(s => s.name !== 'SRL Admin');
                    if (isActive) {
                        setMonthlyStudents(parsedMonthly);
                        setMonthLabel((monthlyJson.monthName || MONTH_NAMES[(monthlyJson.month || 1) - 1]) + ' ' + monthlyJson.year);
                    }
                } else if (isActive) {
                    // Fallback: use overall data for monthly
                    setMonthlyStudents(parsedOverall);
                    setMonthLabel(MONTH_NAMES[new Date().getMonth()] + ' ' + new Date().getFullYear());
                }

                if (hoursRes.ok) {
                    const hoursJson = await hoursRes.json();
                    if (isActive) setTop5ByHours(hoursJson.leaderboard.map(parseBackendStudent).filter(s => s.name !== 'SRL Admin'));
                } else if (isActive) {
                    setTop5ByHours([]);
                }

                if (isActive) {
                    setLoading(false);
                    setLoadingMessage("");
                }
            } catch (error) {
                console.warn("Backend unavailable, retrying...", error);
                retryCount++;
                
                if (retryCount >= 5) {
                    if (isActive) {
                        setLoadingMessage("Taking longer than expected... Reloading");
                        setTimeout(() => {
                            if (isActive) window.location.reload();
                        }, 2000);
                    }
                } else {
                    if (isActive) {
                        setTimeout(fetchLeaderboard, 3000); // Retry every 3 seconds
                    }
                }
            }
        };

        fetchLeaderboard();

        return () => { isActive = false; };
    }, []);

    // Determine current leaderboard array
    let currentLeaderboard = allStudents;
    let mainMetricLabel = "pts";
    let mainMetricKey = "score";
    if (activeTab === 'monthly') {
        currentLeaderboard = monthlyStudents;
    } else if (activeTab === 'hours') {
        currentLeaderboard = top5ByHours;
        mainMetricLabel = "";
        mainMetricKey = "totalHours";
    }

    // Safely assign the top 5 elements matching to their strict structural rank
    const top5Display = [
        { student: currentLeaderboard[3] || null, expectedRank: 4 },
        { student: currentLeaderboard[1] || null, expectedRank: 2 },
        { student: currentLeaderboard[0] || null, expectedRank: 1 },
        { student: currentLeaderboard[2] || null, expectedRank: 3 },
        { student: currentLeaderboard[4] || null, expectedRank: 5 }
    ];

    // Show ALL members in the rankings table (top 5 will be highlighted)
    const allRankedStudents = currentLeaderboard;

    const PodiumCard = ({ item, extraClasses = "" }) => {
        const { student, expectedRank } = item;

        const styles = {
            1: { 
                theme: "text-amber-900", border: "border-[#ffd700]", glow: "shadow-[0_0_20px_rgba(255,215,0,0.6)]", 
                badgeBg: "bg-[#b8860b]", blockGrad: "from-[#fef08a] via-white to-[#f59e0b]", topBar: "bg-[#ffd700] shadow-[0_0_15px_#ffd700]",
                avatarSize: "w-16 h-16 md:w-24 md:h-24", blockClasses: "h-[50px] md:h-[80px]", wrapperWidth: "w-20 md:w-44", badgeBottom: "bottom-[38px] md:bottom-[66px]",
                spotlight: "from-amber-400/40 via-amber-500/10 to-transparent", lightColor: "#fbbf24",
                crownGlow: "drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]"
            },
            2: { 
                theme: "text-emerald-900", border: "border-[#00e676]", glow: "shadow-[0_0_20px_rgba(0,230,118,0.6)]", 
                badgeBg: "bg-[#008c4a]", blockGrad: "from-[#e2e8f0] via-white to-[#a7f3d0]", topBar: "bg-[#00e676] shadow-[0_0_15px_#00e676]",
                avatarSize: "w-14 h-14 md:w-20 md:h-20", blockClasses: "h-[45px] md:h-[64px]", wrapperWidth: "w-[70px] md:w-36", badgeBottom: "bottom-[35px] md:bottom-[50px]",
                spotlight: "from-emerald-400/40 via-emerald-500/10 to-transparent", lightColor: "#34d399",
                crownGlow: "drop-shadow-[0_0_12px_rgba(192,192,192,0.8)]"
            },
            3: { 
                theme: "text-cyan-900", border: "border-[#00b8d4]", glow: "shadow-[0_0_20px_rgba(0,184,212,0.6)]", 
                badgeBg: "bg-[#007b8c]", blockGrad: "from-[#fed7aa] via-white to-[#a5f3fc]", topBar: "bg-[#00b8d4] shadow-[0_0_15px_#00b8d4]",
                avatarSize: "w-14 h-14 md:w-20 md:h-20", blockClasses: "h-[45px] md:h-[64px]", wrapperWidth: "w-[70px] md:w-36", badgeBottom: "bottom-[35px] md:bottom-[50px]",
                spotlight: "from-cyan-400/40 via-cyan-500/10 to-transparent", lightColor: "#22d3ee",
                crownGlow: "drop-shadow-[0_0_12px_rgba(205,127,50,0.8)]"
            },
            4: { 
                theme: "text-orange-900", border: "border-[#ff6d00]", glow: "shadow-[0_0_20px_rgba(255,109,0,0.6)]", 
                badgeBg: "bg-[#a64700]", blockGrad: "from-[#ffedd5] via-white to-[#fdba74]", topBar: "bg-[#ff6d00] shadow-[0_0_15px_#ff6d00]",
                avatarSize: "w-12 h-12 md:w-16 md:h-16", blockClasses: "h-[40px] md:h-[54px]", wrapperWidth: "w-[60px] md:w-32", badgeBottom: "bottom-[30px] md:bottom-[40px]",
                spotlight: "from-orange-400/40 via-orange-500/10 to-transparent", lightColor: "#fb923c",
                crownGlow: "drop-shadow-[0_0_12px_rgba(255,109,0,0.8)]"
            },
            5: { 
                theme: "text-blue-900", border: "border-[#2962ff]", glow: "shadow-[0_0_20px_rgba(41,98,255,0.6)]", 
                badgeBg: "bg-[#143eb8]", blockGrad: "from-[#e0f2fe] via-white to-[#93c5fd]", topBar: "bg-[#2962ff] shadow-[0_0_15px_#2962ff]",
                avatarSize: "w-12 h-12 md:w-16 md:h-16", blockClasses: "h-[40px] md:h-[54px]", wrapperWidth: "w-[60px] md:w-32", badgeBottom: "bottom-[30px] md:bottom-[40px]",
                spotlight: "from-blue-400/40 via-blue-500/10 to-transparent", lightColor: "#60a5fa",
                crownGlow: "drop-shadow-[0_0_12px_rgba(41,98,255,0.8)]"
            },
        };

        const rankToUse = student ? (student.displayRank || student.rank || expectedRank) : expectedRank;
        const s = styles[rankToUse] || styles[5];

        // Ensure perfect symmetric widths even if a student is missing
        if (!student) return <div className={`shrink-0 ${s.wrapperWidth} ${extraClasses}`} />;

        const displayName = (student.name || '').split('\n').map(l => l.trim()).join(' ');
        const val = student[mainMetricKey] || 0;

        return (
            <motion.div 
                whileHover={{ y: -5 }}
                className={`flex flex-col items-center justify-end relative h-[180px] md:h-[300px] shrink-0 ${s.wrapperWidth} ${extraClasses}`}
            >
                {/* Elegant Ambient Glow (Soft and Seeping) */}
                <div 
                    className="absolute top-[-60px] md:top-[-120px] left-1/2 -translate-x-1/2 w-[200px] md:w-[350px] h-[350px] md:h-[500px] pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(ellipse 50% 80% at 50% 20%, ${s.lightColor}20 0%, transparent 100%)`,
                        filter: "blur(40px)"
                    }}
                />
                {/* Soft Vertical Core */}
                <div 
                    className="absolute top-[-40px] md:top-[-80px] left-1/2 -translate-x-1/2 w-[80px] md:w-[150px] h-[250px] md:h-[400px] pointer-events-none z-0"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${s.lightColor}25 30%, ${s.lightColor}10 70%, transparent 100%)`,
                        filter: "blur(35px)"
                    }}
                />

                {/* Crown Icon */}
                <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: expectedRank * 0.4 }}
                    className={`z-30 mb-1 ${s.crownGlow}`}
                >
                    <svg 
                        className="w-6 h-6 md:w-10 md:h-10 transition-transform hover:scale-110" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Define metallic gradients matching the ranks */}
                        <defs>
                            <linearGradient id="crown-1" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#b8860b" />
                                <stop offset="40%" stopColor="#ffd700" />
                                <stop offset="50%" stopColor="#fff" />
                                <stop offset="60%" stopColor="#ffd700" />
                                <stop offset="100%" stopColor="#b8860b" />
                            </linearGradient>
                            <linearGradient id="crown-2" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a0a0a0" />
                                <stop offset="40%" stopColor="#e0e0e0" />
                                <stop offset="50%" stopColor="#fff" />
                                <stop offset="60%" stopColor="#e0e0e0" />
                                <stop offset="100%" stopColor="#a0a0a0" />
                            </linearGradient>
                            <linearGradient id="crown-3" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8d5524" />
                                <stop offset="40%" stopColor="#cd7f32" />
                                <stop offset="50%" stopColor="#ffcc99" />
                                <stop offset="60%" stopColor="#cd7f32" />
                                <stop offset="100%" stopColor="#8d5524" />
                            </linearGradient>
                            <linearGradient id="crown-4" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#d84315" />
                                <stop offset="45%" stopColor="#ff6d00" />
                                <stop offset="55%" stopColor="#ffab40" />
                                <stop offset="100%" stopColor="#d84315" />
                            </linearGradient>
                            <linearGradient id="crown-5" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0d47a1" />
                                <stop offset="45%" stopColor="#2962ff" />
                                <stop offset="55%" stopColor="#82b1ff" />
                                <stop offset="100%" stopColor="#0d47a1" />
                            </linearGradient>
                        </defs>
                        
                        {/* Crown path filled with the matching gradient */}
                        <path 
                            d="M2 21h20v-2H2v2zm19-15l-4.5 4L12 3 7.5 10 3 6l2 11h14l2-11z" 
                            fill={`url(#crown-${rankToUse})`}
                        />
                        
                        {/* Sparkle details overlaid purely for metallic look */}
                        <path d="M12 5l1 2h-2z M6 8l1 1H5z M18 8l1 1h-2z" fill="#ffffff" opacity="0.8"/>
                    </svg>
                </motion.div>

                {/* Avatar */}
                <div className={`relative mb-2 md:mb-3 rounded-full border-[2px] md:border-[3px] ${s.border} ${s.glow} ${s.avatarSize} shrink-0 bg-white z-20 overflow-hidden`}>
                    <img src={student.image || '/SRL.svg'} alt={student.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Name */}
                <div className={`text-center z-20 mb-5 md:mb-8 font-black text-[10px] md:text-sm leading-tight line-clamp-2 px-1 text-gray-900 w-full`}>
                    {displayName}
                </div>

                {/* Rank Badge */}
                <div className={`absolute ${s.badgeBottom} left-1/2 -translate-x-1/2 z-30 w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center font-black text-[10px] md:text-[13px] text-white ${s.border} border-2 ${s.badgeBg} shadow-[0_4px_10px_rgba(0,0,0,0.8)]`}>
                    {rankToUse}
                </div>

                {/* Base Block */}
                <motion.div 
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: expectedRank * 0.2 }}
                    className={`relative w-full ${s.blockClasses} rounded-lg md:rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] bg-gradient-to-r bg-[length:200%_auto] ${s.blockGrad} flex items-center justify-center z-10 border border-t-0 border-white/5`}
                >
                    {/* Glowing neon top line */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-full ${s.topBar}`} />
                    <span className={`font-black text-[10px] md:text-[17px] tracking-tight drop-shadow-md ${s.theme}`}>{val} {mainMetricLabel}</span>
                </motion.div>
            </motion.div>
        );
    };

    const CircularProgress = ({ percentage }) => {
        const radius = 8;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        return (
            <svg viewBox="0 0 20 20" className="w-6 h-6 transform -rotate-90 shrink-0">
                <circle cx="10" cy="10" r="8" stroke="#fef08a" strokeWidth="3" fill="none" />
                <circle cx="10" cy="10" r="8" stroke="#d97706" strokeWidth="3" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </svg>
        );
    };

    const getTitle = () => {
        if (activeTab === 'overall') return "Cumulative Top Researchers";
        if (activeTab === 'monthly') return `Monthly Top Scores: ${monthLabel}`;
        return `Top Hours Dedicated: March 2026`;
    };

    return (
        <div className="bg-[#fdf9ee] min-h-screen pt-6 lg:pt-10 pb-24 px-4 md:px-8 font-sans overflow-hidden relative">
            {/* Rotating watermark backgrounds — fixed, partial arc from corners */}
            <style>{`
                @keyframes rotateClockwise { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes rotateAntiClockwise { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
            `}</style>
            <img
                src="/watermark.svg"
                alt=""
                className="fixed w-[600px] md:w-[780px] pointer-events-none select-none"
                style={{ opacity: 0.15, zIndex: 0, top: '-230px', left: '-300px', animation: 'rotateClockwise 30s linear infinite' }}
            />
            <img
                src="/watermark.svg"
                alt=""
                className="fixed w-[600px] md:w-[780px] pointer-events-none select-none"
                style={{ opacity: 0.15, zIndex: 0, bottom: '-230px', right: '-300px', animation: 'rotateAntiClockwise 30s linear infinite' }}
            />

            {/* Soft decorative blur */}
            <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-[#fdf0cf]/60 to-transparent pointer-events-none left-0 right-0 z-0"></div>

            <div className="max-w-[1100px] mx-auto relative z-10">
                {loading ? (
                    <div className="animate-pulse w-full">
                        {/* Waking Up Message */}
                        <AnimatePresence>
                            {loadingMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center mb-6 text-amber-600 font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                                    {loadingMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header Skeleton */}
                        <div className="flex flex-col items-center justify-center mb-4 md:mb-6 gap-4">
                            <div className="flex flex-row items-center justify-center gap-3 md:gap-4 w-full flex-wrap md:flex-nowrap">
                                <div className="h-10 md:h-11 bg-amber-100 rounded-full w-48 border-2 border-amber-200/60"></div>
                                <div className="h-10 md:h-11 bg-amber-100 rounded-full w-40 border-2 border-amber-200/60"></div>
                                <div className="h-10 md:h-11 bg-amber-100 rounded-full w-44 border-2 border-amber-200/60"></div>
                            </div>
                            <div className="h-10 md:h-14 bg-gray-200 rounded-lg w-3/4 max-w-md mt-2"></div>
                        </div>

                        {/* Podium Skeleton */}
                        <div className="relative mt-2 md:mt-4 mb-8">
                            <div className="flex flex-row items-end justify-center gap-2 sm:gap-4 md:gap-6 min-h-[220px] md:min-h-[320px] pb-4 md:pb-6 pt-6 md:pt-10 relative z-10 px-2 lg:px-8">
                                {[
                                    { height: 'h-[40px] md:h-[54px]', avatar: 'w-12 h-12 md:w-16 md:h-16', marginBottom: 'mb-0', width: 'w-[60px] md:w-32' },
                                    { height: 'h-[45px] md:h-[64px]', avatar: 'w-14 h-14 md:w-20 md:h-20', marginBottom: 'mb-4 md:mb-10', width: 'w-[70px] md:w-36' },
                                    { height: 'h-[50px] md:h-[80px]', avatar: 'w-16 h-16 md:w-24 md:h-24', marginBottom: 'mb-8 md:mb-16', width: 'w-20 md:w-44' },
                                    { height: 'h-[45px] md:h-[64px]', avatar: 'w-14 h-14 md:w-20 md:h-20', marginBottom: 'mb-4 md:mb-10', width: 'w-[70px] md:w-36' },
                                    { height: 'h-[40px] md:h-[54px]', avatar: 'w-12 h-12 md:w-16 md:h-16', marginBottom: 'mb-0', width: 'w-[60px] md:w-32' }
                                ].map((p, i) => (
                                    <div key={i} className={`flex flex-col items-center justify-end relative h-[180px] md:h-[300px] shrink-0 ${p.width} ${p.marginBottom}`}>
                                        <div className={`mb-2 md:mb-3 rounded-full bg-gray-300 border-2 md:border-4 border-gray-200 ${p.avatar}`}></div>
                                        <div className="h-3 md:h-4 bg-gray-300 rounded w-3/4 mb-5 md:mb-8"></div>
                                        <div className={`w-full ${p.height} rounded-lg md:rounded-xl shadow-lg bg-gray-200 border border-t-0 border-white/30`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List Skeleton */}
                        <div className="mt-16 sm:mt-24">
                            <div className="h-4 bg-gray-300 w-64 mx-auto mb-6 rounded"></div>
                            <div className="bg-gradient-to-b from-[#f6ead0]/50 to-white/50 p-2 md:p-3 rounded-2xl md:rounded-[32px] border border-[#e8dcb8]/50">
                                <div className="bg-white rounded-xl md:rounded-[24px] overflow-hidden">
                                    <div className="flex items-center bg-[#faeed1]/50 px-4 md:px-6 py-4 border-b border-[#ebdcae]/50">
                                        <div className="h-4 bg-gray-200 w-full rounded"></div>
                                    </div>
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center px-4 md:px-6 py-3">
                                                <div className="w-12 md:w-16 h-6 bg-gray-200 rounded shrink-0 flex flex-col items-center"></div>
                                                <div className="w-16 md:w-20 justify-center shrink-0 hidden sm:flex">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200"></div>
                                                </div>
                                                <div className="flex-1 ml-2 md:ml-4 flex flex-col gap-2 min-w-0 pr-2 md:pr-4">
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                                </div>
                                                <div className="hidden lg:flex w-48 justify-center items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0"></div>
                                                    <div className="h-4 w-12 bg-gray-200 rounded shrink-0"></div>
                                                </div>
                                                <div className="hidden md:flex w-40 justify-center items-center gap-2">
                                                    <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                                                </div>
                                                <div className="w-20 md:w-28 flex flex-col items-center justify-center shrink-0">
                                                    <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center mb-4 md:mb-6 gap-4"
                        >
                            <div className="flex flex-row items-center justify-center gap-3 md:gap-4 w-full flex-wrap md:flex-nowrap">
                                <button 
                                    onClick={() => setActiveTab('overall')}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] md:text-sm font-extrabold border-2 transition-all ${activeTab === 'overall' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-transparent border-amber-200/60 text-gray-500 hover:bg-white hover:border-amber-300 hover:text-amber-600'}`}
                                >
                                    Cumulative Top Researchers
                                </button>
                                <button 
                                    onClick={() => setActiveTab('monthly')}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] md:text-sm font-extrabold border-2 transition-all ${activeTab === 'monthly' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-transparent border-amber-200/60 text-gray-500 hover:bg-white hover:border-amber-300 hover:text-amber-600'}`}
                                >
                                    Monthly Top Scores
                                </button>
                                <button 
                                    onClick={() => setActiveTab('hours')}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] md:text-sm font-extrabold border-2 transition-all ${activeTab === 'hours' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-transparent border-amber-200/60 text-gray-500 hover:bg-white hover:border-amber-300 hover:text-amber-600'}`}
                                >
                                    Top Hours Dedicated
                                </button>
                            </div>

                            <motion.h1 
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-center mt-2 bg-gradient-to-r from-[#8B6508] via-[#525252] to-[#9A7B4F] drop-shadow-md bg-[length:200%_auto] text-transparent bg-clip-text min-h-[48px] md:min-h-[60px]"
                            >
                                {getTitle()}
                            </motion.h1>
                        </motion.div>

                        {/* Top 5 Podiums */}
                        <div className="relative mt-2 md:mt-4 mb-8">
                            {/* Spotlights and Podiums container */}
                            <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 min-h-[220px] md:min-h-[320px] pb-4 md:pb-6 pt-6 md:pt-10 relative z-10 px-2 lg:px-8">
                                {top5Display[0] && <PodiumCard item={top5Display[0]} extraClasses="mb-0" />}
                                {top5Display[1] && <PodiumCard item={top5Display[1]} extraClasses="mb-4 md:mb-10" />}
                                {top5Display[2] && <PodiumCard item={top5Display[2]} extraClasses="mb-8 md:mb-16 z-30" />}
                                {top5Display[3] && <PodiumCard item={top5Display[3]} extraClasses="mb-4 md:mb-10" />}
                                {top5Display[4] && <PodiumCard item={top5Display[4]} extraClasses="mb-0" />}
                            </div>
                        </div>

                        {/* All Member Rankings Table */}
                        {allRankedStudents.length > 0 && (
                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="mt-16 sm:mt-24"
                            >
                                <h3 className="text-center text-sm md:text-base font-black tracking-widest uppercase text-gray-800 mb-6">
                                    ALL MEMBER RANKINGS (1st - {currentLeaderboard.length}th)
                                </h3>

                                <div className="bg-gradient-to-b from-[#f6ead0] to-[#fcfaf5] p-2 md:p-3 rounded-2xl md:rounded-[32px] border border-[#e8dcb8] shadow-xl">
                                    <div className="bg-white rounded-xl md:rounded-[24px] overflow-hidden shadow-sm">
                                        
                                        {/* Table Header */}
                                        <div className="flex items-center bg-[#faeed1] px-4 md:px-6 py-4 font-bold text-gray-800 border-b border-[#ebdcae] text-[11px] md:text-sm tracking-wide">
                                            <div className="w-12 md:w-16 text-center shrink-0">Rank</div>
                                            <div className="w-16 md:w-20 text-center shrink-0 hidden sm:block">Profile</div>
                                            <div className="flex-1 ml-2 md:ml-4 text-center sm:text-left">Member Details</div>
                                            <div className="w-32 md:w-48 text-center shrink-0 hidden lg:block">SRL Sessions Attended</div>
                                            <div className="w-32 md:w-40 text-center shrink-0 hidden md:block">Hours Dedicated</div>
                                            <div className="w-20 md:w-28 text-center shrink-0">Total Score</div>
                                        </div>

                                        {/* Table Rows — scrollable container */}
                                        <div className="divide-y divide-gray-100 bg-white max-h-[600px] overflow-y-auto">
                                            {allRankedStudents.map((st, idx) => {
                                                const displayName = (st.name || '').split('\n').map(l => l.trim()).join(' ');
                                                const val = st[mainMetricKey] || 0;
                                                const isTop5 = st.rank >= 1 && st.rank <= 5;
                                                return (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, margin: "-50px" }}
                                                        transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                                                        key={st.enrollment} 
                                                        className={`flex items-center px-4 md:px-6 py-3 transition-colors group ${
                                                            isTop5
                                                                ? 'bg-gradient-to-r from-amber-50 via-yellow-50/60 to-white border-l-4 border-l-amber-400 hover:from-amber-100/80 hover:via-yellow-50 hover:to-white'
                                                                : 'hover:bg-[#faf8f2]'
                                                        }`}
                                                    >
                                                        {/* Rank */}
                                                        <div className={`w-12 md:w-16 text-center font-bold text-lg md:text-xl shrink-0 flex flex-col items-center gap-0.5 ${
                                                            isTop5 ? 'text-amber-700' : 'text-gray-700'
                                                        }`}>
                                                            {st.rank}
                                                            {isTop5 && (() => {
                                                                const crownColors = {
                                                                    1: { from: '#b8860b', mid: '#ffd700', to: '#b8860b', glow: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' },
                                                                    2: { from: '#a0a0a0', mid: '#e0e0e0', to: '#a0a0a0', glow: 'drop-shadow(0 0 4px rgba(192,192,192,0.6))' },
                                                                    3: { from: '#8d5524', mid: '#cd7f32', to: '#8d5524', glow: 'drop-shadow(0 0 4px rgba(205,127,50,0.6))' },
                                                                    4: { from: '#d84315', mid: '#ff6d00', to: '#d84315', glow: 'drop-shadow(0 0 4px rgba(255,109,0,0.6))' },
                                                                    5: { from: '#0d47a1', mid: '#2962ff', to: '#0d47a1', glow: 'drop-shadow(0 0 4px rgba(41,98,255,0.6))' },
                                                                };
                                                                const cc = crownColors[st.rank] || crownColors[5];
                                                                const gradId = `table-crown-${st.rank}`;
                                                                return (
                                                                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ filter: cc.glow }}>
                                                                        <defs>
                                                                            <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
                                                                                <stop offset="0%" stopColor={cc.from} />
                                                                                <stop offset="50%" stopColor={cc.mid} />
                                                                                <stop offset="100%" stopColor={cc.to} />
                                                                            </linearGradient>
                                                                        </defs>
                                                                        <path d="M2 21h20v-2H2v2zm19-15l-4.5 4L12 3 7.5 10 3 6l2 11h14l2-11z" fill={`url(#${gradId})`} />
                                                                        <path d="M12 5l1 2h-2z M6 8l1 1H5z M18 8l1 1h-2z" fill="#ffffff" opacity="0.8"/>
                                                                    </svg>
                                                                );
                                                            })()}
                                                        </div>
                                                        
                                                        {/* Profile Image - hidden on small mobile */}
                                                        <div className="w-16 md:w-20 justify-center shrink-0 hidden sm:flex">
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm group-hover:border-amber-300 transition-colors">
                                                                <img src={st.image || '/SRL.svg'} alt={st.name} className="w-full h-full object-cover" />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Member Details */}
                                                        <div className="flex-1 ml-2 md:ml-4 flex flex-col md:flex-row md:items-center justify-between min-w-0 pr-2 md:pr-4">
                                                            <div className="min-w-0 pr-2">
                                                                <div className="font-bold text-sm md:text-base text-gray-900 truncate">{displayName}</div>
                                                                <div className="text-[10px] md:text-[11px] font-semibold text-gray-500 mt-0.5 md:mt-1 truncate">
                                                                    {st.enrollment}, {st.dept}, {st.semester} Sem
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Desktop Stats columns */}
                                                        <div className="hidden lg:flex w-48 justify-center items-center gap-2">
                                                            <CircularProgress percentage={st.srlAttendanceNum || 0} />
                                                            <span className="text-sm font-extrabold text-[#d97706] whitespace-nowrap">{st.srlAttendance}</span>
                                                        </div>
                                                        <div className="hidden md:flex w-40 justify-center items-center gap-2">
                                                            <div className="flex items-center gap-1.5 bg-amber-100/50 px-3 py-1.5 rounded-full border border-amber-200">
                                                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                                <span className="text-[13px] font-extrabold text-amber-700 whitespace-nowrap">
                                                                    {st.totalHours}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Score and Mobile Stats */}
                                                        <div className="w-20 md:w-28 flex flex-col items-center justify-center shrink-0 gap-1">
                                                            <span className="font-black text-lg md:text-xl text-gray-900">{st.score || 0}</span>
                                                            
                                                            {/* Mobile-only stats layout */}
                                                            <div className="flex flex-col text-[9px] font-bold text-gray-500 md:hidden pb-1 text-center">
                                                            <span className="text-amber-600">SRL: {st.srlAttendance}</span>
                                                            <span className="text-emerald-600">{st.totalHours}</span>
                                                        </div>
                                                        </div>
                                                        
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default function LeaderBoardWithErrorBoundary(props) {
    return (
        <ErrorBoundary>
            <LeaderBoard {...props} />
        </ErrorBoundary>
    );
}