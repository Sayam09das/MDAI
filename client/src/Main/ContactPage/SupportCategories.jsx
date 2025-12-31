import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  CreditCard,
  BookOpen,
  Users,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const SupportCategories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
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

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const categories = [
    {
      id: 'technical',
      icon: Wrench,
      title: 'Technical Support',
      description: 'Having trouble accessing the platform? Issues with video playback or downloads?',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      responseTime: '< 1 hour',
      examples: [
        'Login or access issues',
        'Video playback problems',
        'Download errors',
        'Browser compatibility',
      ],
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payments & Billing',
      description: 'Questions about pricing, refunds, payment methods, or billing issues?',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      responseTime: '< 2 hours',
      examples: [
        'Payment processing',
        'Refund requests',
        'Subscription changes',
        'Invoice inquiries',
      ],
    },
    {
      id: 'courses',
      icon: BookOpen,
      title: 'Course Issues',
      description: 'Problems with course content, lessons, certificates, or progress tracking?',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      responseTime: '< 3 hours',
      examples: [
        'Missing course content',
        'Certificate problems',
        'Progress not saving',
        'Quiz or assignment issues',
      ],
    },
    {
      id: 'teacher',
      icon: Users,
      title: 'Teacher Support',
      description: 'For instructors: help with course creation, student management, or earnings?',
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      responseTime: '< 2 hours',
      examples: [
        'Course upload issues',
        'Student communications',
        'Payment/earnings queries',
        'Profile settings',
      ],
    },
    {
      id: 'general',
      icon: MessageCircle,
      title: 'General Inquiry',
      description: 'Any other questions? Feedback, suggestions, or general information?',
      gradient: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      responseTime: '< 4 hours',
      examples: [
        'Platform features',
        'Account settings',
        'Feedback & suggestions',
        'Partnership inquiries',
      ],
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to contact form or open a modal
    console.log('Selected category:', categoryId);
  };

  return (
    <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Choose Your Support Topic</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How Can We <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Help You?</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the category that best describes your inquiry for faster, more targeted support
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            const isHovered = hoveredCard === category.id;

            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCategorySelect(category.id)}
                className={`group relative cursor-pointer transition-all duration-700 ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`relative bg-white rounded-2xl p-6 md:p-8 border-2 shadow-lg hover:shadow-2xl transition-all duration-500 h-full ${isSelected
                    ? 'border-indigo-500 -translate-y-2 shadow-2xl'
                    : isHovered
                      ? 'border-indigo-300 -translate-y-1'
                      : 'border-gray-200'
                  }`}>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`${category.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-500 ${isHovered || isSelected ? 'scale-110 rotate-6' : 'scale-100'
                    }`}>
                    <Icon className={`w-8 h-8 bg-gradient-to-br ${category.gradient} bg-clip-text`} style={{
                      WebkitTextFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      backgroundImage: `linear-gradient(to bottom right, ${category.gradient.includes('blue') ? '#3B82F6' :
                          category.gradient.includes('purple') ? '#A855F7' :
                            category.gradient.includes('emerald') ? '#10B981' :
                              category.gradient.includes('orange') ? '#F97316' : '#06B6D4'
                        }, ${category.gradient.includes('indigo') ? '#4F46E5' :
                          category.gradient.includes('pink') ? '#EC4899' :
                            category.gradient.includes('teal') ? '#14B8A6' :
                              category.gradient.includes('red') ? '#EF4444' : '#3B82F6'
                        })`,
                    }} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isSelected || isHovered ? 'text-indigo-600' : 'text-gray-900'
                    }`}>
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                    {category.description}
                  </p>

                  {/* Response Time Badge */}
                  <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-600">
                      Response time: {category.responseTime}
                    </span>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Common Topics:
                    </p>
                    {category.examples.slice(0, 3).map((example, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <button
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${isSelected
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : `bg-gradient-to-r ${category.gradient} text-white hover:shadow-lg`
                      }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <span>Select Category</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>

                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info Card */}
        <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-10 border border-indigo-100 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Still Not Sure?
                </h3>
              </div>
              <p className="text-gray-600 mb-2">
                No worries! Our team is here to help you with any question.
              </p>
              <p className="text-sm text-gray-500">
                You can also browse our comprehensive FAQ section or start a live chat for instant assistance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all duration-300">
                Browse FAQ
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SupportCategories;