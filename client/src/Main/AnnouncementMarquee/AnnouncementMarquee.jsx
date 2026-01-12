import { Sparkles, ChevronRight, Megaphone } from "lucide-react";

const AnnouncementMarquee = () => {
    const teacherFormUrl = import.meta.env.VITE_TEACHER_FORM_URL;

    return (
        <div className="relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white py-2.5 md:py-3 overflow-hidden shadow-lg">

            {/* Animated background shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-shimmer" />

            {/* Inline CSS for animations */}
            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 35s linear infinite;
                }
                
                .animate-shimmer {
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                .pause-animation:hover {
                    animation-play-state: paused;
                }
                
                @media (max-width: 768px) {
                    .animate-scroll {
                        animation: scroll 25s linear infinite;
                    }
                }
            `}</style>

            <div className="relative flex items-center">
                <div className="flex items-center gap-6 md:gap-12 animate-scroll pause-animation whitespace-nowrap">

                    {/* First copy */}
                    <div className="flex items-center gap-2 md:gap-3 px-4">
                        <Megaphone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse" />
                        <span className="text-sm md:text-base font-medium">
                            🚀 We are hiring teachers! Interested in becoming a teacher?
                        </span>
                        <a
                            href={teacherFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-white text-purple-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        >
                            Apply here
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                    </div>

                    <div className="w-px h-6 bg-white opacity-30" />

                    {/* Second copy */}
                    <div className="flex items-center gap-2 md:gap-3 px-4">
                        <Megaphone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse" />
                        <span className="text-sm md:text-base font-medium">
                            🚀 We are hiring teachers! Interested in becoming a teacher?
                        </span>
                        <a
                            href={teacherFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-white text-purple-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        >
                            Apply here
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                    </div>

                    <div className="w-px h-6 bg-white opacity-30" />

                    {/* Third copy */}
                    <div className="flex items-center gap-2 md:gap-3 px-4">
                        <Megaphone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse" />
                        <span className="text-sm md:text-base font-medium">
                            🚀 We are hiring teachers! Interested in becoming a teacher?
                        </span>
                        <a
                            href={teacherFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-white text-purple-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        >
                            Apply here
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                    </div>

                    <div className="w-px h-6 bg-white opacity-30" />

                    {/* Fourth copy for seamless loop */}
                    <div className="flex items-center gap-2 md:gap-3 px-4">
                        <Megaphone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse" />
                        <span className="text-sm md:text-base font-medium">
                            🚀 We are hiring teachers! Interested in becoming a teacher?
                        </span>
                        <a
                            href={teacherFormUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-white text-purple-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                        >
                            Apply here
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnnouncementMarquee;