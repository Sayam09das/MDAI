import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, BookOpen, Video, Upload, 
  Settings, Users, Shield, CheckCircle, ArrowRight,
  Play, FileText, Calendar, Award, Sparkles, TrendingUp
} from 'lucide-react';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  // Auto-cycle through steps
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 4);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Students Browse & Enroll',
      description: 'Students explore our vast course catalog, read reviews, watch previews, and enroll in courses that match their learning goals.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      icon: Search,
      features: [
        { icon: Search, text: 'Browse 1000+ courses' },
        { icon: Play, text: 'Watch free previews' },
        { icon: ShoppingCart, text: 'Secure enrollment' },
        { icon: Award, text: 'Earn certificates' }
      ],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      stats: { value: '50K+', label: 'Active Students' }
    },
    {
      id: 2,
      title: 'Teachers Create Courses',
      number: '02',
      description: 'Expert instructors design comprehensive courses with video lessons, resources, assignments, and live sessions to deliver quality education.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      icon: Upload,
      features: [
        { icon: Upload, text: 'Upload video content' },
        { icon: FileText, text: 'Add PDF resources' },
        { icon: Calendar, text: 'Schedule live classes' },
        { icon: Settings, text: 'Customize curriculum' }
      ],
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
      stats: { value: '100+', label: 'Expert Teachers' }
    },
    {
      id: 3,
      title: 'Live & Recorded Learning',
      number: '03',
      description: 'Students attend interactive live sessions and access recorded lectures anytime. Real-time interaction with instructors and peers.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      icon: Video,
      features: [
        { icon: Video, text: 'HD live streaming' },
        { icon: Play, text: 'Recorded sessions' },
        { icon: Users, text: 'Interactive Q&A' },
        { icon: BookOpen, text: 'Study materials' }
      ],
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop',
      stats: { value: '10K+', label: 'Video Lessons' }
    },
    {
      id: 4,
      title: 'Admin Manages Everything',
      number: '04',
      description: 'Powerful admin dashboard to monitor platform activity, verify teachers, manage content, handle payments, and ensure quality.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      icon: Shield,
      features: [
        { icon: Shield, text: 'Teacher verification' },
        { icon: Settings, text: 'Content moderation' },
        { icon: TrendingUp, text: 'Analytics dashboard' },
        { icon: Users, text: 'User management' }
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      stats: { value: '24/7', label: 'Platform Support' }
    }
  ];

  const StepCard = ({ step, index, isActive }) => {
    const Icon = step.icon;

    return (
      <div
        className={`relative transition-all duration-700 ${
          isVisible ? 'animate-fadeInUp' : 'opacity-0'
        }`}
        style={{ animationDelay: `${index * 0.15}s` }}
        onMouseEnter={() => setActiveStep(index)}
      >
        <div
          className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 transform ${
            isActive
              ? 'scale-105 shadow-2xl border-transparent ring-4 ring-offset-4 ring-offset-white'
              : 'scale-100 shadow-lg border-gray-200 hover:border-gray-300 hover:shadow-xl'
          }`}
          style={{
            ringColor: isActive ? `rgba(${index === 0 ? '59, 130, 246' : index === 1 ? '168, 85, 247' : index === 2 ? '34, 197, 94' : '249, 115, 22'}, 0.3)` : 'transparent'
          }}
        >
          {/* Step Number Badge */}
          <div className={`absolute top-6 right-6 z-10 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform ${
            isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
          } transition-all duration-500`}>
            <span className="text-white font-bold text-xl">{step.number}</span>
          </div>

          {/* Image Section */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={step.image}
              alt={step.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
              isActive ? 'opacity-100' : 'opacity-80'
            }`}></div>

            {/* Floating Icon */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}>
              <div className={`w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ${
                isActive ? 'animate-pulse-ring' : ''
              }`}>
                <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Stats Badge */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">{step.stats.value}</div>
                <div className="text-xs text-gray-600">{step.stats.label}</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Icon Badge */}
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-5 transform transition-all duration-500 ${
              isActive ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
            } shadow-lg`}>
              <Icon className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-6">
              {step.features.map((feature, idx) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-sm md:text-base text-gray-700 group transition-all duration-300 ${
                      isActive ? 'translate-x-2' : 'translate-x-0'
                    }`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <div className={`${step.bgColor} p-2 rounded-lg`}>
                      <FeatureIcon className={`w-4 h-4 ${step.iconColor}`} />
                    </div>
                    <span className="font-medium">{feature.text}</span>
                    <CheckCircle className={`w-4 h-4 ${step.iconColor} ml-auto opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                );
              })}
            </div>

            {/* Learn More Button */}
            <button
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                isActive
                  ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Learn More
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                isActive ? 'translate-x-1' : ''
              }`} />
            </button>
          </div>

          {/* Hover Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-3xl`}></div>
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

        @keyframes drawLine {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .animate-drawLine {
          animation: drawLine 2s ease-out forwards;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              How It Works
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Simple, Powerful,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Effective
            </span>
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform brings together students, teachers, and administrators in a seamless learning ecosystem
          </p>
        </div>

        {/* Connection Line - Desktop Only */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 z-0 px-8">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <line
              x1="12.5%"
              y1="0"
              x2="87.5%"
              y2="0"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray="1000"
              className={isVisible ? 'animate-drawLine' : ''}
              style={{ strokeDashoffset: 1000 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="33%" stopColor="#a855f7" />
                <stop offset="66%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 relative z-10 mb-16">
          {steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              isActive={activeStep === index}
            />
          ))}
        </div>

        {/* Step Indicators */}
        <div className={`flex items-center justify-center gap-3 mb-16 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`transition-all duration-300 rounded-full ${
                activeStep === index
                  ? 'w-12 h-3 bg-gradient-to-r from-indigo-600 to-purple-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                Ready to Experience the Future of Learning?
              </h3>
              
              <p className="text-base md:text-lg lg:text-xl text-indigo-100 mb-8 md:mb-10 max-w-2xl mx-auto">
                Whether you're a student eager to learn or a teacher ready to inspire, our platform is built for you
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>

                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto">
                  Become a Teacher
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-8 md:mt-10 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Free Trial Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">No Setup Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Expert Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;