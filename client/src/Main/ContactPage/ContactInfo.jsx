import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Copy,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Headphones
} from 'lucide-react';

const ContactInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
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

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Us',
      primary: 'support@mdai.com',
      secondary: 'sales@mdai.com',
      description: 'Send us an email anytime. We typically respond within 24 hours.',
      link: 'mailto:support@mdai.com',
      actionText: 'Send Email',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      copyable: true,
    },
    {
      icon: Phone,
      title: 'Call Us',
      primary: '+1 (555) 123-4567',
      secondary: 'Toll-free: 1-800-MDAI-EDU',
      description: 'Speak with our support team. Available during business hours.',
      link: 'tel:+15551234567',
      actionText: 'Call Now',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      copyable: true,
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      primary: '123 Learning Street',
      secondary: 'San Francisco, CA 94102, USA',
      description: 'Stop by our office for in-person support and consultations.',
      link: 'https://maps.google.com',
      actionText: 'Get Directions',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      copyable: true,
    },
    {
      icon: Clock,
      title: 'Support Hours',
      primary: 'Monday - Friday',
      secondary: '9:00 AM - 6:00 PM EST',
      description: 'Our team is available to assist you during these hours.',
      link: null,
      actionText: 'Live Chat',
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      copyable: false,
    },
  ];

  const quickStats = [
    { icon: MessageCircle, value: '<2h', label: 'Avg Response Time' },
    { icon: Headphones, value: '24/7', label: 'Support Available' },
    { icon: CheckCircle, value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div ref={sectionRef} className="relative py-16 md:py-24 bg-gray-50 overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Get In <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred way to reach us. We're here to help!
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === index;
            const isCopied = copiedIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative transition-all duration-700 ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`relative bg-white rounded-2xl p-6 border-2 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col ${isHovered ? 'border-indigo-400 -translate-y-2' : 'border-gray-200'
                  }`}>

                  {/* Icon */}
                  <div className={`${card.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'
                    }`}>
                    <Icon className={`w-8 h-8 bg-gradient-to-br ${card.gradient} bg-clip-text`} style={{
                      WebkitTextFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      backgroundImage: `linear-gradient(to bottom right, ${card.gradient.includes('blue') ? '#3B82F6' :
                          card.gradient.includes('purple') ? '#A855F7' :
                            card.gradient.includes('emerald') ? '#10B981' : '#F97316'
                        }, ${card.gradient.includes('indigo') ? '#4F46E5' :
                          card.gradient.includes('pink') ? '#EC4899' :
                            card.gradient.includes('teal') ? '#14B8A6' : '#EF4444'
                        })`,
                    }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {card.title}
                  </h3>

                  {/* Contact Info */}
                  <div className="mb-3 flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base font-semibold text-gray-900">
                        {card.primary}
                      </p>
                      {card.copyable && (
                        <button
                          onClick={() => handleCopy(card.primary, index)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                          title="Copy to clipboard"
                        >
                          {isCopied ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {card.secondary}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  {card.link ? (
                    <a
                      href={card.link}
                      target={card.link.startsWith('http') ? '_blank' : undefined}
                      rel={card.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${card.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 mt-auto`}
                    >
                      <span>{card.actionText}</span>
                      {card.link.startsWith('http') ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </a>
                  ) : (
                    <button
                      className={`flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${card.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 mt-auto`}
                    >
                      <span>{card.actionText}</span>
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info Card */}
        <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-10 border border-indigo-100 text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-gray-600">
                Our live chat support is available 24/7 to answer your questions instantly.
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Start Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;