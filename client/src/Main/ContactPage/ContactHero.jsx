import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Headphones,
  Sparkles,
  Send,
  ArrowDown
} from 'lucide-react';

const ContactHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const quickContacts = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'support@mdai.com',
      link: 'mailto:support@mdai.com',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon - Fri, 9AM - 6PM EST',
      link: null,
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  const floatingIcons = [
    { Icon: MessageCircle, position: 'top-20 left-[8%]', delay: '0s' },
    { Icon: Mail, position: 'top-32 right-[12%]', delay: '0.5s' },
    { Icon: Headphones, position: 'bottom-40 left-[10%]', delay: '1s' },
    { Icon: Send, position: 'bottom-32 right-[15%]', delay: '1.5s' },
  ];

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-white">

      {/* Grid Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Gradient Overlay Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => {
        const Icon = item.Icon;
        return (
          <div
            key={index}
            className={`hidden lg:block absolute ${item.position} text-indigo-300 opacity-20 animate-float`}
            style={{ animationDelay: item.delay }}
          >
            <Icon className="w-12 h-12" />
          </div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">

        {/* Badge */}
        <div className={`inline-flex items-center space-x-2 px-6 py-3 bg-indigo-50 border border-indigo-200 rounded-full mb-8 shadow-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}>
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span className="text-indigo-700 font-semibold text-sm md:text-base">
            24/7 Support Available
          </span>
        </div>

        {/* Main Heading */}
        <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <span className="relative inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Contact
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-40 rounded-full blur-sm" />
          </span>{' '}
          Us
        </h1>

        {/* Subtitle */}
        <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 font-light mb-6 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          We're here to{' '}
          <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            help you
          </span>
        </p>

        {/* Description */}
        <p className={`text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          Have questions? Need support? Want to share feedback? Our team is ready to assist you.
          Reach out through any channel below and we'll get back to you as soon as possible.
        </p>

        {/* Quick Contact Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {quickContacts.map((contact, index) => {
            const Icon = contact.icon;

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {contact.title}
                </h3>

                {contact.link ? (
                  <a
                    href={contact.link}
                    className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300 block"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-lg font-bold text-gray-900">
                    {contact.value}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center space-x-2">
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span>Send Us a Message</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
        <div className="flex flex-col items-center space-y-2 animate-bounce">
          <span className="text-gray-500 text-sm font-medium">Scroll for contact form</span>
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactHero;