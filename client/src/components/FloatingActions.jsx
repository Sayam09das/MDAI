import { MessageCircle, Mail, UserPlus, X } from "lucide-react";
import { useState } from "react";

const FloatingActions = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;
    const teacherFormUrl = import.meta.env.VITE_TEACHER_FORM_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const actions = [
        {
            icon: MessageCircle,
            label: "Chat on WhatsApp",
            href: `https://wa.me/${whatsappNumber}`,
            color: "from-green-400 to-green-600",
            hoverColor: "from-green-500 to-green-700",
            external: true
        },
        {
            icon: Mail,
            label: "Email us",
            href: `mailto:${supportEmail}`,
            color: "from-indigo-500 to-indigo-700",
            hoverColor: "from-indigo-600 to-indigo-800",
            external: false
        },
        {
            icon: UserPlus,
            label: "Apply as Teacher",
            href: teacherFormUrl,
            color: "from-purple-500 to-purple-700",
            hoverColor: "from-purple-600 to-purple-800",
            external: true
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Main Toggle Button - Mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Toggle actions menu"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Action Buttons Container */}
            <div className={`flex flex-col gap-3 ${isOpen ? 'block' : 'hidden md:flex'} absolute bottom-16 md:bottom-0 right-0 md:relative`}>
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    const isHovered = hoveredIndex === index;

                    return (
                        <a
                            key={index}
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            rel={action.external ? "noopener noreferrer" : undefined}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative flex items-center justify-end"
                            aria-label={action.label}
                        >
                            {/* Desktop Label */}
                            <div
                                className={`hidden md:flex items-center overflow-hidden transition-all duration-300 ease-out ${isHovered ? 'max-w-xs opacity-100 mr-3' : 'max-w-0 opacity-0'
                                    }`}
                            >
                                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap border border-gray-100">
                                    {action.label}
                                </span>
                            </div>

                            {/* Icon Button */}
                            <div
                                className={`relative flex items-center justify-center w-14 h-14 bg-gradient-to-br ${isHovered ? action.hoverColor : action.color
                                    } text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95`}
                            >
                                <Icon size={22} className="relative z-10" />

                                {/* Animated Ring */}
                                <div className={`absolute inset-0 rounded-full bg-white transition-all duration-300 ${isHovered ? 'opacity-20 scale-110' : 'opacity-0 scale-100'
                                    }`} />
                            </div>

                            {/* Mobile Label */}
                            <div
                                className={`md:hidden absolute right-16 top-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                    }`}
                            >
                                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap border border-gray-100">
                                    {action.label}
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-20 -z-10"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default FloatingActions;