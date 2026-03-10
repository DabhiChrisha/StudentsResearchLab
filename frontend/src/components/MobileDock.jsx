import { Home, LayoutGrid, TrendingUp, Users } from "lucide-react";

export default function MobileDock() {
    const mobileDockItems = [
        { id: "top", icon: Home, label: "Home" },
        { id: "objectives", icon: LayoutGrid, label: "Objectives" },
        { id: "timeline", icon: TrendingUp, label: "Timeline" },
        { id: "impact", icon: Users, label: "Impact" },
    ];

    const scrollToSection = (sectionId) => {
        const mainContent = document.getElementById("main-content");
        const section = document.getElementById(sectionId);
        
        if (mainContent && section) {
            const sectionTop = section.offsetTop;
            mainContent.scrollTo({
                top: sectionTop - 72, // Adjust for navbar height
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[360px] pointer-events-auto">
            <div className="relative rounded-[28px] border border-white/70 bg-[#f3f7f8]/95 backdrop-blur-md shadow-[0_16px_36px_rgba(15,23,42,0.18)] px-4 py-4">
                <div className="rounded-2xl bg-[#e8f2f4] border border-white/80 p-2 grid grid-cols-4 gap-2">
                    {mobileDockItems.map((item, index) => {
                        const Icon = item.icon;
                        const isPrimary = index === 0;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => scrollToSection(item.id)}
                                className={`h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isPrimary
                                    ? "bg-white text-secondary shadow-[0_6px_14px_rgba(0,136,123,0.18)]"
                                    : "text-secondary/70 hover:bg-white/70 hover:text-secondary"
                                    }`}
                                aria-label={item.label}
                            >
                                <Icon size={16} strokeWidth={2.4} />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
