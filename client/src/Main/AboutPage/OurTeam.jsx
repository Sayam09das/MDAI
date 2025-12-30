import React, { useState, useEffect, useRef } from 'react';
import {
    Linkedin, Twitter, Mail, Heart, Users,
    Award, Sparkles, MessageCircle, ExternalLink
} from 'lucide-react';

const OurTeam = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredMember, setHoveredMember] = useState(null);
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

    const teamMembers = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            photo: 'https://i.pravatar.cc/400?img=5',
            bio: 'Visionary leader with 15+ years in EdTech',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'sarah@example.com',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Chief Technology Officer',
            photo: 'https://i.pravatar.cc/400?img=12',
            bio: 'Tech innovator passionate about scalable solutions',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'michael@example.com',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Head of Education',
            photo: 'https://i.pravatar.cc/400?img=9',
            bio: 'Curriculum expert dedicated to quality learning',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'emily@example.com',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50'
        },
        {
            id: 4,
            name: 'David Kim',
            role: 'Head of Product',
            photo: 'https://i.pravatar.cc/400?img=33',
            bio: 'Product visionary building the future of learning',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'david@example.com',
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-50'
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            role: 'Head of Marketing',
            photo: 'https://i.pravatar.cc/400?img=20',
            bio: 'Brand storyteller connecting learners worldwide',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'lisa@example.com',
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-50'
        },
        {
            id: 6,
            name: 'James Wilson',
            role: 'Head of Operations',
            photo: 'https://i.pravatar.cc/400?img=14',
            bio: 'Operations expert ensuring seamless experiences',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            email: 'james@example.com',
            color: 'from-indigo-500 to-blue-500',
            bgColor: 'bg-indigo-50'
        }
    ];

    const TeamMemberCard = ({ member, index }) => {
        const isHovered = hoveredMember === member.id;

        return (
            <div
                className={`group relative transition-all duration-700 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'
                    }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
            >
                <div
                    className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 transform ${isHovered
                            ? 'scale-105 shadow-2xl border-transparent'
                            : 'scale-100 shadow-lg border-gray-100'
                        }`}
                >
                    {/* Photo Section */}
                    <div className="relative h-80 overflow-hidden">
                        <img
                            src={member.photo}
                            alt={member.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                                }`}
                            loading="lazy"
                        />

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-60'
                            }`}></div>

                        {/* Social Links - Show on Hover */}
                        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                            }`}>
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110"
                            >
                                <Linkedin className="w-5 h-5 text-white" />
                            </a>
                            <a
                                href={member.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110"
                            >
                                <Twitter className="w-5 h-5 text-white" />
                            </a>
                            <a
                                href={`mailto:${member.email}`}
                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-110"
                            >
                                <Mail className="w-5 h-5 text-white" />
                            </a>
                        </div>

                        {/* Name & Role Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {member.name}
                            </h3>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${member.color} shadow-lg`}>
                                <span className="text-sm font-semibold text-white">
                                    {member.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="p-6">
                        <p className={`text-base text-gray-600 leading-relaxed transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'
                            }`}>
                            {member.bio}
                        </p>
                    </div>

                    {/* Decorative Corner */}
                    <div className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${member.color} rounded-full blur-3xl transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'
                        }`}></div>
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
            transform: scale(0.9) translateY(20px);
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute top-1/3 right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            Our Team
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Meet the Minds Behind{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                            Our Success
                        </span>
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        A passionate team of educators, innovators, and dreamers working together to revolutionize online learning
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={member.id} member={member} index={index} />
                    ))}
                </div>

                {/* Stats Bar */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    {[
                        { icon: Users, value: '50+', label: 'Team Members', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Award, value: '20+', label: 'Years Combined Exp', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { icon: Heart, value: '60K+', label: 'Happy Students', color: 'text-pink-600', bg: 'bg-pink-50' },
                        { icon: Sparkles, value: '100%', label: 'Dedicated', color: 'text-amber-600', bg: 'bg-amber-50' }
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

                {/* Join Team CTA */}
                <div className={`text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-6 animate-pulse-scale">
                                <Heart className="w-10 h-10 text-white" />
                            </div>

                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                                Want to Join Our Team?
                            </h3>

                            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                We're always looking for talented individuals who share our passion for education and innovation
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    View Open Positions
                                    <ExternalLink className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </button>

                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-3">
                                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                                    Contact Us
                                </button>
                            </div>

                            {/* Perks */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Remote Friendly</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Competitive Benefits</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-sm md:text-base">Growth Opportunities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Values */}
                <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
                    {[
                        {
                            title: 'Collaborative Spirit',
                            description: 'We believe in the power of teamwork and collective intelligence',
                            icon: Users,
                            color: 'from-blue-500 to-cyan-500'
                        },
                        {
                            title: 'Innovation First',
                            description: 'We constantly push boundaries to create better learning experiences',
                            icon: Sparkles,
                            color: 'from-purple-500 to-pink-500'
                        },
                        {
                            title: 'Student-Centric',
                            description: 'Every decision we make is driven by what\'s best for our learners',
                            icon: Heart,
                            color: 'from-pink-500 to-rose-500'
                        }
                    ].map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} mb-4 shadow-lg`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OurTeam;