import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle, Target, BookOpen, Users, Lightbulb,
    Award, Clock, TrendingUp, Sparkles, Star, Play,
    AlertCircle, Zap, Code, Brain, Rocket
} from 'lucide-react';

const OverviewSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);
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

    const courseData = {
        title: "Complete Machine Learning & AI Masterclass",
        subtitle: "From Beginner to Advanced: Master Machine Learning, Deep Learning, and AI",

        whatYouLearn: [
            {
                icon: Brain,
                title: "Master Core ML Algorithms",
                description: "Understand supervised and unsupervised learning, from linear regression to advanced neural networks"
            },
            {
                icon: Code,
                title: "Python for Data Science",
                description: "Build expertise in NumPy, Pandas, Scikit-learn, TensorFlow, and PyTorch libraries"
            },
            {
                icon: Target,
                title: "Real-World Projects",
                description: "Complete 10+ hands-on projects including image recognition, NLP, and recommendation systems"
            },
            {
                icon: Zap,
                title: "Deep Learning & Neural Networks",
                description: "Build CNNs, RNNs, GANs, and Transformers from scratch and understand their applications"
            },
            {
                icon: TrendingUp,
                title: "Model Deployment",
                description: "Deploy your ML models to production using Flask, Docker, and cloud platforms (AWS, GCP)"
            },
            {
                icon: Rocket,
                title: "Industry Best Practices",
                description: "Learn MLOps, version control, testing, and optimization techniques used by top companies"
            }
        ],

        description: {
            intro: "Welcome to the most comprehensive Machine Learning and AI course on the internet! This course is designed to take you from a complete beginner to an advanced practitioner capable of building and deploying production-ready ML systems.",

            highlights: [
                "Over 90 hours of high-quality video content with lifetime access",
                "100+ coding exercises and quizzes to test your knowledge",
                "10+ real-world capstone projects for your portfolio",
                "Certificate of completion recognized by industry leaders",
                "Active community with 50,000+ students and instructors",
                "Regular updates with latest ML techniques and frameworks"
            ],

            methodology: "Our teaching approach combines theoretical foundations with practical implementation. Each concept is explained clearly with visual aids, followed by hands-on coding sessions. You'll work on progressively challenging projects that simulate real-world scenarios, ensuring you're job-ready by the end of the course.",

            outcomes: "By completing this course, you'll be able to design, develop, and deploy machine learning solutions for various domains including computer vision, natural language processing, recommendation systems, and predictive analytics. You'll also build a strong portfolio that demonstrates your skills to potential employers."
        },

        requirements: [
            {
                icon: Code,
                title: "Basic Programming Knowledge",
                description: "Familiarity with any programming language (Python preferred)",
                level: "essential"
            },
            {
                icon: BookOpen,
                title: "High School Mathematics",
                description: "Basic algebra, statistics, and probability concepts",
                level: "essential"
            },
            {
                icon: Lightbulb,
                title: "Problem-Solving Mindset",
                description: "Curiosity and willingness to tackle complex challenges",
                level: "recommended"
            },
            {
                icon: Clock,
                title: "Time Commitment",
                description: "10-15 hours per week for 12 weeks",
                level: "recommended"
            }
        ],

        targetAudience: [
            {
                icon: Users,
                title: "Aspiring Data Scientists",
                description: "Looking to break into the field of machine learning and AI",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50"
            },
            {
                icon: Code,
                title: "Software Developers",
                description: "Want to add ML/AI skills to their development toolkit",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50"
            },
            {
                icon: TrendingUp,
                title: "Business Analysts",
                description: "Seeking to leverage AI for data-driven decision making",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50"
            },
            {
                icon: Award,
                title: "Students & Graduates",
                description: "Computer Science or related field students wanting practical ML experience",
                color: "from-amber-500 to-orange-500",
                bgColor: "bg-amber-50"
            },
            {
                icon: Rocket,
                title: "Entrepreneurs",
                description: "Building AI-powered products or services",
                color: "from-indigo-500 to-purple-500",
                bgColor: "bg-indigo-50"
            },
            {
                icon: Brain,
                title: "Career Switchers",
                description: "Professionals transitioning into AI and machine learning roles",
                color: "from-rose-500 to-pink-500",
                bgColor: "bg-rose-50"
            }
        ],

        stats: [
            { icon: Users, value: "50,000+", label: "Students Enrolled" },
            { icon: Star, value: "4.9/5", label: "Average Rating" },
            { icon: Play, value: "90+", label: "Hours Content" },
            { icon: Award, value: "100%", label: "Job Ready" }
        ]
    };

    return (
        <section ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
          background-size: 1000px 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`text-center mb-12 md:mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
                            Course Overview
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        {courseData.title}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
                        {courseData.subtitle}
                    </p>
                </div>

                {/* Stats Bar */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    {courseData.stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 mb-3 mx-auto" />
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* What You'll Learn */}
                <div className={`mb-12 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                    What You'll Learn
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {courseData.whatYouLearn.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-white rounded-xl shadow-lg flex-shrink-0">
                                                    <Icon className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm md:text-base text-indigo-100 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Description */}
                <div className={`mb-12 md:mb-20 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-7 h-7 text-indigo-600" />
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Course Description
                                </h2>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            {/* Intro */}
                            <div>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    {courseData.description.intro}
                                </p>
                            </div>

                            {/* Highlights */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 border border-green-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    Course Highlights
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    {courseData.description.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start gap-3 group">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                                {highlight}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Methodology */}
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-indigo-600" />
                                    Our Teaching Methodology
                                </h3>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    {courseData.description.methodology}
                                </p>
                            </div>

                            {/* Outcomes */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-indigo-100">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-indigo-600" />
                                    What You'll Achieve
                                </h3>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                    {courseData.description.outcomes}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <div className={`mb-12 md:mb-20 ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 md:p-8 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-7 h-7 text-amber-600" />
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Requirements
                                </h2>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {courseData.requirements.map((req, index) => {
                                    const Icon = req.icon;
                                    return (
                                        <div
                                            key={index}
                                            className={`rounded-2xl p-5 md:p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${req.level === 'essential'
                                                    ? 'bg-red-50 border-red-200 hover:border-red-300'
                                                    : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl shadow-md ${req.level === 'essential' ? 'bg-red-500' : 'bg-blue-500'
                                                    }`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                                            {req.title}
                                                        </h3>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.level === 'essential'
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-blue-500 text-white'
                                                            }`}>
                                                            {req.level.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm md:text-base text-gray-700">
                                                        {req.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Target Audience */}
                <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Who This Course Is <span className="gradient-text">Perfect For</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                            This course is designed for anyone passionate about AI and machine learning, regardless of their background
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {courseData.targetAudience.map((audience, index) => {
                            const Icon = audience.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${audience.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                    <div className="relative z-10 p-6 md:p-8">
                                        {/* Icon */}
                                        <div className={`${audience.bgColor} w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-5 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                            <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${audience.color} flex items-center justify-center shadow-lg`}>
                                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-300">
                                            {audience.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                            {audience.description}
                                        </p>
                                    </div>

                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <div className={`mt-12 md:mt-20 text-center ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                                Ready to Start Your AI Journey?
                            </h3>
                            <p className="text-base md:text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
                                Join 50,000+ students who are already mastering machine learning and transforming their careers
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                                    Enroll Now
                                    <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer w-full sm:w-auto">
                                    <Play className="w-5 h-5 fill-white" />
                                    Watch Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OverviewSection;