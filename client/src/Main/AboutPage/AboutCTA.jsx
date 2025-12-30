import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, GraduationCap, BookOpen, ArrowRight,
  CheckCircle, Sparkles, Video, Award,
  Users, TrendingUp, Star, Heart, Zap
} from 'lucide-react';

const AboutCTA = () => {
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

  const ctaOptions = [
    {
      id: 1,
      icon: GraduationCap,
      title: 'Start Learning',
      subtitle: 'For Students',
      description: 'Unlock unlimited access to 1,500+ courses. Learn from industry experts and transform your career with cutting-edge skills.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      benefits: [
        'Access 1,500+ premium courses',
        'Learn from 250+ expert instructors',
        'Get industry-recognized certificates',
        'Join 50,000+ active learners'
      ],
      stats: [
        { icon: Video, value: '10K+', label: 'Video Lessons' },
        { icon: Award, value: '95%', label: 'Success Rate' },
        { icon: Users, value: '50K+', label: 'Students' }
      ],
      buttonText: 'Start Learning Now',
      buttonIcon: ArrowRight,
      tag: 'Most Popular'
    },
    {
      id: 2,
      icon: BookOpen,
      title: 'Become a Teacher',
      subtitle: 'For Educators',
      description: 'Share your knowledge with thousands of students globally. Create courses, earn income, and make a lasting impact on learners worldwide.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      benefits: [
        'Reach 50,000+ students globally',
        'Earn competitive income ($5K+/mo avg)',
        'Full course creation support',
        'Join 250+ expert instructors'
      ],
      stats: [
        { icon: TrendingUp, value: '$5K+', label: 'Avg Earning' },
        { icon: Star, value: '4.9/5', label: 'Rating' },
        { icon: Users, value: '250+', label: 'Teachers' }
      ],
      buttonText: 'Apply as Teacher',
      buttonIcon: Rocket,
      tag: 'High Earning'
    }
  ];

  const CTACard = ({ option, index }) => {
    const Icon = option.icon;
    const ButtonIcon = option.buttonIcon;
    const isActive = activeCard === option.id;

    return (
      <div
        className={`group relative transition-all duration-700 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'
          }`}
        style={{ animationDelay: `${index * 0.2}s` }}
        onMouseEnter={() => setActiveCard(option.id)}
        onMouseLeave={() => setActiveCard(null)}
      >
        <div
          className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 transform ${isActive
              ? 'scale-105 shadow-2xl border-transparent'
              : 'scale-100 shadow-xl border-gray-200 hover:shadow-2xl'
            }`}
        >
          {/* Tag Badge */}
          {option.tag && (
            <div className="absolute top-6 right-6 z-10">
              <div className={`px-4 py-2 bg-gradient-to-r ${option.color} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse`}>
                <Sparkles className="w-3.5 h-3.5" />
                {option.tag}
              </div>
            </div>
          )}

          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${option.color} transition-opacity duration-500 ${isActive ? 'opacity-10' : 'opacity-5'
            }`}></div>

          <div className="relative p-8 md:p-10">
            {/* Icon */}
            <div className="mb-6">
              <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${option.color} transform transition-all duration-500 shadow-2xl ${isActive ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                }`}>
                <Icon className="w-14 h-14 md:w-16 md:h-16 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-6">
              <p className={`text-sm font-bold ${option.color} bg-gradient-to-r bg-clip-text text-transparent mb-2 uppercase tracking-wide`}>
                {option.subtitle}
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {option.title}
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {option.description}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {option.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 transition-all duration-300 ${isActive ? 'translate-x-2' : 'translate-x-0'
                    }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <CheckCircle className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'
                    }`} style={{ color: option.color.includes('blue') ? '#3b82f6' : '#a855f7' }} />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {option.stats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`${option.bgColor} rounded-xl p-4 text-center transition-all duration-300 ${isActive ? 'transform scale-105' : ''
                      }`}
                  >
                    <StatIcon className="w-5 h-5 mx-auto mb-2" style={{ color: option.color.includes('blue') ? '#3b82f6' : '#a855f7' }} />
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              className={`w-full py-4 md:py-5 rounded-xl font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg ${isActive
                  ? `bg-gradient-to-r ${option.color} text-white transform scale-105 shadow-2xl`
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
            >
              {option.buttonText}
              <ButtonIcon className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${isActive ? 'translate-x-2' : ''
                }`} />
            </button>
          </div>

          {/* Decorative Elements */}
          <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${option.color} rounded-full blur-3xl transition-opacity duration-500 ${isActive ? 'opacity-20' : 'opacity-0'
            }`}></div>
          <div className={`absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br ${option.color} rounded-full blur-3xl transition-opacity duration-500 ${isActive ? 'opacity-20' : 'opacity-0'
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
            transform: scale(0.9) translateY(30px);
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
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
          }
          50% {
            box-shadow: 0 0 50px rgba(99, 102, 241, 0.8);
          }
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

        .animate-shimmer {
          animation: shimmer 3s infinite linear;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          background-size: 1000px 100%;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
            <Heart className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Join Our Community
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Transform Your Future?
            </span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're here to learn or teach, we have the perfect path for you. Choose your journey and start today.
          </p>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {ctaOptions.map((option, index) => (
            <CTACard key={option.id} option={option} index={index} />
          ))}
        </div>

        {/* Bottom Features */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Zap, text: 'Instant Access', color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { icon: CheckCircle, text: 'No Credit Card', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Award, text: 'Certificates', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Users, text: '24/7 Support', color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-3`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <p className="text-sm font-bold text-gray-900">{feature.text}</p>
              </div>
            );
          })}
        </div>

        {/* Final CTA Banner */}
        <div className={`${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden animate-pulse-glow">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10 text-center">
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white mx-auto mb-6 animate-float" />

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                Still Have Questions?
              </h3>

              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Our team is here to help you make the right decision. Schedule a free consultation or explore our platform risk-free.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                  Schedule Free Demo
                  <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>

                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-3">
                  <Star className="w-6 h-6 fill-white" />
                  View Success Stories
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Free 14-Day Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;