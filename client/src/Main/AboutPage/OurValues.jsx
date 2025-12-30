import React, { useState, useEffect, useRef } from 'react';
import {
    Eye, Award, Shield, Lightbulb, Users, Heart,
    CheckCircle, Sparkles, TrendingUp, Lock,
    Target, Zap, Star, ArrowRight
} from 'lucide-react';

const OurValues = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredValue, setHoveredValue] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const values = [
        {
            id: 1,
            icon: Eye,
            title: 'Transparency',
            description: 'We believe in complete openness with our students, teachers, and partners. Clear pricing, honest communication, and no hidden fees.',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            details: [
                'Clear and upfront pricing',
                'Open communication channels',
                'Regular progress updates',
                'Transparent teacher verification'
            ],
            stats: { value: '100%', label: 'Transparency Score' }
        },
        {
            id: 2,
            icon: Award,
            title: 'Quality Education',
            description: 'Excellence in education is our top priority. Every course is carefully curated, and every teacher is thoroughly vetted to ensure the highest standards.',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            details: [
                'Expert-created curriculum',
                'Industry-certified instructors',
                'Regular content updates',
                'Quality assurance checks'
            ],
            stats: { value: '4.8/5', label: 'Average Rating' }
        },
        {
            id: 3,
            icon: Shield,
            title: 'Security',
            description: 'Your data and privacy are sacred to us. We use industry-leading security measures to protect your information and ensure safe learning.',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            details: [
                'End-to-end encryption',
                'Secure payment processing',
                'GDPR compliant',
                'Regular security audits'
            ],
            stats: { value: '256-bit', label: 'SSL Encryption' }
        },
        {
            id: 4,
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We continuously evolve with technology to provide cutting-edge learning experiences. AI-powered recommendations, interactive tools, and more.',
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            details: [
                'AI-powered learning paths',
                'Interactive learning tools',
                'Latest tech integration',
                'Continuous platform updates'
            ],
            stats: { value: 'Weekly', label: 'Feature Updates' }
        },
        {
            id: 5,
            icon: Users,
            title: 'Community',
            description: 'Learning is better together. We foster a supportive community where students, teachers, and mentors connect, collaborate, and grow.',
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            details: [
                'Active discussion forums',
                'Peer learning groups',
                'Networking opportunities',
                'Community events'
            ],
            stats: { value: '60K+', label: 'Community Members' }
        }
    ];

    const ValueCard = ({ value, index }) => {
        const Icon = value.icon;
        const isHovered = hoveredValue === value.id;

        return (
            <div
                className={`group relative transition-all duration-700 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'
                    }`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredValue(value.id)}
                onMouseLeave={() => setHoveredValue(null)}
            >
                <div
                    className={`relative bg-white rounded-3xl shadow-lg border-2 overflow-hidden transition-all duration-500 transform ${isHovered
                            ? 'scale-105 shadow-2xl border-transparent'
                            : 'scale-100 border-gray-100 hover:shadow-xl'
                        }`}
                >
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} transition-opacity duration-500 ${isHovered ? 'opacity-5' : 'opacity-0'
                        }`}></div>

                    <div className="relative p-8 md:p-10">
                        {/* Icon Container */}
                        <div className="mb-6">
                            <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${value.color} transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                                } shadow-xl`}>
                                <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            {value.title}
                        </h3>

                        {/* Description */}
                        <p className="text-base text-gray-600 mb-6 leading-relaxed">
                            {value.description}
                        </p>

                        {/* Details List */}
                        <div className="space-y-3 mb-6">
                            {value.details.map((detail, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 text-sm text-gray-700 transition-all duration-300 ${isHovered ? 'translate-x-2' : 'translate-x-0'
                                        }`}
                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                >
                                    <CheckCircle className={`w-5 h-5 ${value.iconColor} flex-shrink-0 mt-0.5 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'
                                        }`} />
                                    <span className="leading-relaxed">{detail}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats Badge */}
                        <div className={`${value.bgColor} rounded-2xl p-5 text-center transition-all duration-300 ${isHovered ? 'transform scale-105' : ''
                            }`}>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {value.stats.value}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {value.stats.label}
                            </div>
                        </div>
                    </div>

                    {/* Shine Effect */}
                    <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine"></div>
                    </div>

                    {/* Corner Decoration */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${value.color} rounded-full blur-3xl transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'
                        }`}></div>
                </div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                        <Heart className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            Our Values
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        What We{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                            Stand For
                        </span>
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Our core values guide everything we do. They're not just words on a page – they're the foundation of our platform and community.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
                    {values.map((value, index) => (
                        <ValueCard key={value.id} value={value} index={index} />
                    ))}
                </div>

                {/* Bottom Features Bar */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    {[
                        { icon: Star, value: '4.9/5', label: 'Platform Rating', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                        { icon: TrendingUp, value: '98%', label: 'Student Success', color: 'text-green-600', bg: 'bg-green-50' },
                        { icon: Lock, value: '100%', label: 'Data Secure', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Zap, value: '24/7', label: 'Support', color: 'text-purple-600', bg: 'bg-purple-50' }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2 text-center"
                            >
                                <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-3`}>
                                    <Icon className={`w-7 h-7 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className={`text-center ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-pulse-glow">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>

                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                                Experience These Values in Action
                            </h3>

                            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Join a platform where values aren't just promises – they're lived experiences that shape every interaction.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    Join Our Community
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </button>

                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto">
                                    Learn More
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/90">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Trusted by 60K+ Users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Award-Winning Platform</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">ISO Certified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Quote */}
                <div className={`mt-16 text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                        <div className="flex items-center justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                            "These values aren't just marketing speak – they're genuinely reflected in every aspect of the platform. The transparency, quality, and community support are unmatched."
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <img
                                src="https://i.pravatar.cc/150?img=33"
                                alt="User"
                                className="w-14 h-14 rounded-full border-2 border-indigo-100"
                            />
                            <div className="text-left">
                                <div className="font-bold text-gray-900">Sarah Johnson</div>
                                <div className="text-sm text-gray-600">Student & Community Member</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurValues;