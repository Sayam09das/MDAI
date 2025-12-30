import React, { useState, useEffect, useRef } from 'react';
import {
    GraduationCap, BookOpen, Building2, Users, Target,
    TrendingUp, Award, Sparkles, CheckCircle, ArrowRight,
    Video, FileText, Calendar, DollarSign, BarChart, Globe
} from 'lucide-react';

const WhoWeServe = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
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

    const audiences = [
        {
            id: 1,
            icon: GraduationCap,
            title: 'Students',
            subtitle: 'Learn, Grow, Excel',
            description: 'Access world-class education from anywhere. Learn at your own pace with live classes, recorded lessons, and comprehensive resources.',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
            benefits: [
                { icon: Video, text: 'Live & recorded classes' },
                { icon: FileText, text: 'Study materials & PDFs' },
                { icon: Award, text: 'Certificates & achievements' },
                { icon: Users, text: 'Peer learning community' }
            ],
            stats: [
                { value: '50,000+', label: 'Active Learners' },
                { value: '95%', label: 'Success Rate' },
                { value: '1000+', label: 'Courses Available' }
            ],
            cta: 'Start Learning',
            features: [
                'Access 1000+ courses across multiple domains',
                'Learn from industry experts and certified teachers',
                'Flexible learning schedules that fit your lifestyle',
                'Get certified and boost your career prospects'
            ]
        },
        {
            id: 2,
            icon: BookOpen,
            title: 'Teachers',
            subtitle: 'Teach, Inspire, Earn',
            description: 'Share your expertise with thousands of students worldwide. Create courses, conduct live sessions, and build your teaching career.',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
            benefits: [
                { icon: Video, text: 'Easy course creation tools' },
                { icon: Calendar, text: 'Schedule management' },
                { icon: DollarSign, text: 'Competitive earnings' },
                { icon: BarChart, text: 'Analytics & insights' }
            ],
            stats: [
                { value: '100+', label: 'Expert Teachers' },
                { value: '$5K+', label: 'Avg Monthly Earning' },
                { value: '4.8/5', label: 'Teacher Rating' }
            ],
            cta: 'Become a Teacher',
            features: [
                'Powerful tools to create engaging video courses',
                'Reach thousands of students globally',
                'Earn competitive income from your expertise',
                'Full admin support and content assistance'
            ]
        },
        {
            id: 3,
            icon: Building2,
            title: 'Institutions & Coaches',
            subtitle: 'Scale, Manage, Succeed',
            description: 'Empower your institution or coaching center with our enterprise solutions. Manage multiple teachers, students, and courses seamlessly.',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop',
            benefits: [
                { icon: Users, text: 'Multi-user management' },
                { icon: BarChart, text: 'Advanced analytics' },
                { icon: Globe, text: 'White-label solutions' },
                { icon: Target, text: 'Custom branding' }
            ],
            stats: [
                { value: '50+', label: 'Partner Institutions' },
                { value: '10K+', label: 'Students Enrolled' },
                { value: '99.9%', label: 'Uptime SLA' }
            ],
            cta: 'Partner With Us',
            features: [
                'Enterprise-grade platform with scalability',
                'Manage unlimited teachers and students',
                'Advanced reporting and analytics dashboard',
                'Dedicated account manager and 24/7 support'
            ]
        }
    ];

    const AudienceCard = ({ audience, index }) => {
        const Icon = audience.icon;
        const isActive = activeCard === audience.id;

        return (
            <div
                className={`group relative transition-all duration-700 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'
                    }`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setActiveCard(audience.id)}
                onMouseLeave={() => setActiveCard(null)}
            >
                <div
                    className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 transform ${isActive
                            ? 'scale-105 shadow-2xl border-transparent'
                            : 'scale-100 shadow-xl border-gray-100 hover:shadow-2xl'
                        }`}
                >
                    {/* Image Section */}
                    <div className="relative h-64 md:h-72 overflow-hidden">
                        <img
                            src={audience.image}
                            alt={audience.title}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'scale-100'
                                }`}
                            loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-60'
                            }`}></div>

                        {/* Floating Icon */}
                        <div className={`absolute top-6 left-6 p-4 rounded-2xl bg-white/20 backdrop-blur-md transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                            }`}>
                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {audience.title}
                            </h3>
                            <p className="text-lg text-white/90 font-medium">
                                {audience.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                        {/* Description */}
                        <p className="text-base text-gray-600 mb-6 leading-relaxed">
                            {audience.description}
                        </p>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {audience.benefits.map((benefit, idx) => {
                                const BenefitIcon = benefit.icon;
                                return (
                                    <div
                                        key={idx}
                                        className={`${audience.bgColor} rounded-xl p-3 transition-all duration-300 ${isActive ? 'transform scale-105' : ''
                                            }`}
                                    >
                                        <BenefitIcon className={`w-5 h-5 ${audience.iconColor} mb-2`} />
                                        <p className="text-xs font-semibold text-gray-700 leading-tight">
                                            {benefit.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                            {audience.stats.map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 mb-6">
                            {audience.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 text-sm text-gray-700 transition-all duration-300 ${isActive ? 'translate-x-2' : 'translate-x-0'
                                        }`}
                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                >
                                    <CheckCircle className={`w-5 h-5 ${audience.iconColor} flex-shrink-0 mt-0.5`} />
                                    <span className="leading-relaxed">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${isActive
                                    ? `bg-gradient-to-r ${audience.color} text-white shadow-lg transform scale-105`
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {audience.cta}
                            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'translate-x-2' : ''
                                }`} />
                        </button>
                    </div>

                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${audience.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full`}></div>
                </div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
          background-size: 1000px 100%;
        }
      `}</style>

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            Who We Serve
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Built for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600">
                            Everyone
                        </span>
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Whether you're a student, teacher, or institution, our platform is designed to empower your learning and teaching journey
                    </p>
                </div>

                {/* Audience Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
                    {audiences.map((audience, index) => (
                        <AudienceCard key={audience.id} audience={audience} index={index} />
                    ))}
                </div>

                {/* Bottom Stats */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    {[
                        { icon: Users, value: '60K+', label: 'Total Users', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Video, value: '15K+', label: 'Total Courses', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { icon: TrendingUp, value: '95%', label: 'Satisfaction Rate', color: 'text-green-600', bg: 'bg-green-50' },
                        { icon: Award, value: '50K+', label: 'Certificates Issued', color: 'text-orange-600', bg: 'bg-orange-50' }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2 text-center"
                            >
                                <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-3`}>
                                    <Icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className={`text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-float">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>

                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                                Join Our Growing Community Today
                            </h3>

                            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Be part of a revolution in online education. Start your journey with us and unlock limitless possibilities.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    Get Started Now
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </button>

                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto">
                                    Schedule a Demo
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/90">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Free 14-day Trial</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">No Credit Card</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm md:text-base">24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoWeServe;