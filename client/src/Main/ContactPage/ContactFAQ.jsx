import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, Clock, CreditCard,
  Video, Mail, MessageCircle, Phone, Search,
  CheckCircle, Sparkles, Zap, Shield, X
} from 'lucide-react';

const ContactFAQ = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const faqs = [
    {
      id: 1,
      category: 'Support',
      icon: Clock,
      question: 'How long does support take to respond?',
      answer: 'Our support team typically responds within 2-4 hours during business hours (9 AM - 6 PM EST, Monday to Friday). For urgent issues, we offer live chat support with instant responses 24/7. Premium members receive priority support with response times under 1 hour.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      relatedLinks: [
        { text: 'Contact Live Support', link: '#chat' },
        { text: 'View Support Hours', link: '#hours' }
      ]
    },
    {
      id: 2,
      category: 'Payments',
      icon: CreditCard,
      question: 'What should I do if I have payment issues?',
      answer: 'If you encounter payment problems, first verify your card details and ensure sufficient funds. Our system accepts all major credit cards, debit cards, and PayPal. If the issue persists, contact our billing team at billing@eduplatform.com or call +1 (555) 123-4567. We also offer installment plans for course bundles.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      relatedLinks: [
        { text: 'Payment Methods', link: '#payment' },
        { text: 'Billing Support', link: '#billing' }
      ]
    },
    {
      id: 3,
      category: 'Access',
      icon: Video,
      question: 'How do I access live classes?',
      answer: 'Once enrolled, live classes appear in your dashboard under "Live Sessions". You\'ll receive email reminders 24 hours and 15 minutes before each class. Click "Join Live" when the session starts. Ensure you have a stable internet connection and updated browser. All sessions are recorded and available within 24 hours if you miss them.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      relatedLinks: [
        { text: 'Technical Requirements', link: '#tech' },
        { text: 'Live Class Schedule', link: '#schedule' }
      ]
    },
    {
      id: 4,
      category: 'Account',
      icon: Shield,
      question: 'How do I reset my password or recover my account?',
      answer: 'Click "Forgot Password" on the login page and enter your registered email. You\'ll receive a reset link within 5 minutes. If you don\'t receive it, check your spam folder. For account recovery issues, contact support@eduplatform.com with your registered email and we\'ll verify your identity to restore access.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      relatedLinks: [
        { text: 'Reset Password', link: '#reset' },
        { text: 'Account Security', link: '#security' }
      ]
    },
    {
      id: 5,
      category: 'Refunds',
      icon: CreditCard,
      question: 'What is your refund policy?',
      answer: 'We offer a 14-day money-back guarantee for all courses. If you\'re not satisfied, request a refund within 14 days of purchase through your account dashboard or by emailing refunds@eduplatform.com. Refunds are processed within 5-7 business days. Note: Courses with more than 30% completion are not eligible for refunds.',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      relatedLinks: [
        { text: 'Request Refund', link: '#refund' },
        { text: 'Full Policy', link: '#policy' }
      ]
    },
    {
      id: 6,
      category: 'Technical',
      icon: Zap,
      question: 'What if I experience technical issues during classes?',
      answer: 'For immediate technical support during live classes, use the in-class chat support button or call our tech support hotline at +1 (555) 987-6543. Common issues include browser compatibility (use Chrome/Firefox), internet speed (minimum 5 Mbps), and plugin updates. Our tech team is available 24/7 for emergency assistance.',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      relatedLinks: [
        { text: 'Tech Support', link: '#tech-support' },
        { text: 'Troubleshooting Guide', link: '#troubleshoot' }
      ]
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const quickContacts = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help',
      action: 'Start Chat',
      color: 'from-blue-500 to-cyan-500',
      available: '24/7 Available'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@eduplatform.com',
      action: 'Send Email',
      color: 'from-purple-500 to-pink-500',
      available: 'Response in 2-4 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      action: 'Call Now',
      color: 'from-green-500 to-emerald-500',
      available: 'Mon-Fri: 9 AM - 6 PM'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
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

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
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

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Got Questions?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              We've Got Answers
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find quick answers to common questions about support, payments, and accessing your courses
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-12 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 shadow-lg transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const Icon = faq.icon;
              const isExpanded = expandedFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${isExpanded ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300'
                    } ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 md:p-8 text-left flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${faq.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className={`inline-block px-3 py-1 ${faq.bgColor} text-xs font-bold rounded-full mb-2`} style={{
                            color: faq.color.includes('blue') ? '#2563eb' :
                              faq.color.includes('green') ? '#059669' :
                                faq.color.includes('purple') ? '#9333ea' :
                                  faq.color.includes('orange') ? '#ea580c' :
                                    faq.color.includes('indigo') ? '#6366f1' : '#f59e0b'
                          }}>
                            {faq.category}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed">
                            {faq.question}
                          </h3>
                        </div>
                        <div className={`p-2 rounded-lg transition-all duration-300 ${isExpanded ? 'bg-indigo-100 rotate-180' : 'bg-gray-100'
                          }`}>
                          <ChevronDown className={`w-5 h-5 ${isExpanded ? 'text-indigo-600' : 'text-gray-600'
                            }`} />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Answer Content */}
                  {isExpanded && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 animate-slideDown">
                      <div className="ml-16 md:ml-20">
                        <p className="text-base text-gray-700 leading-relaxed mb-6">
                          {faq.answer}
                        </p>

                        {/* Related Links */}
                        <div className="flex flex-wrap gap-3">
                          {faq.relatedLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.link}
                              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${faq.color} text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                            >
                              {link.text}
                              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">Try a different search term or browse all questions</p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Quick Contact Options */}
        <div className={`mb-16 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Still Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickContacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${contact.color} mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h4>
                  <p className="text-gray-600 mb-1">{contact.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{contact.available}</p>
                  <button className={`w-full py-3 bg-gradient-to-r ${contact.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer`}>
                    {contact.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className={`${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10 text-center">
              <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-float" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Can't Find Your Answer?
              </h3>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Our support team is here to help! Get personalized assistance from our experts.
              </p>
              <button className="px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-105">
                Contact Support Team
              </button>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Average Response: 2 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;