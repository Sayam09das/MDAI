import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Phone, Mail, Clock, Navigation,
  Building2, Globe, MessageCircle, ExternalLink,
  CheckCircle, Users, Award, Sparkles
} from 'lucide-react';

const MapSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeInfo, setActiveInfo] = useState('main');
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

  const offices = [
    {
      id: 'main',
      name: 'Main Office',
      address: '123 Education Street, Tech Valley',
      city: 'San Francisco, CA 94102',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      email: 'contact@eduplatform.com',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086421935591!2d-122.41941492347468!3d37.77492971267446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1703001234567!5m2!1sen!2sus',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'regional',
      name: 'Regional Office',
      address: '456 Innovation Drive, Silicon Park',
      city: 'Austin, TX 78701',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      email: 'austin@eduplatform.com',
      hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.4234567890123!2d-97.74306878488281!3d30.26715958178903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd469d57a!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1703001234567!5m2!1sen!2sus',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const activeOffice = offices.find(office => office.id === activeInfo) || offices[0];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      value: activeOffice.phone,
      link: `tel:${activeOffice.phone}`,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'Email Us',
      value: activeOffice.email,
      link: `mailto:${activeOffice.email}`,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Available 24/7',
      link: '#chat',
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ];

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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        iframe {
          border: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Visit Us
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Global Presence
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're here to help! Visit our offices or get in touch with us through any of these convenient methods.
          </p>
        </div>

        {/* Office Selector Tabs */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {offices.map((office) => (
            <button
              key={office.id}
              onClick={() => setActiveInfo(office.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 cursor-pointer ${activeInfo === office.id
                  ? `bg-gradient-to-r ${office.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
            >
              {office.name}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Map Container */}
          <div className={`${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 h-[400px] md:h-[500px] lg:h-[600px]">
              <iframe
                src={activeOffice.mapUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${activeOffice.name} Location`}
                className="absolute inset-0"
              ></iframe>

              {/* Map Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activeOffice.color} flex-shrink-0`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1">{activeOffice.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {activeOffice.address}, {activeOffice.city}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeOffice.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Navigation className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Office Information */}
          <div className={`${isVisible ? 'animate-slideInRight' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 md:p-10 h-full">
              <div className="flex items-start gap-4 mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${activeOffice.color} flex-shrink-0`}>
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {activeOffice.name}
                  </h3>
                  <p className="text-gray-600">Empowering learners worldwide</p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className={`${activeOffice.bgColor} p-3 rounded-xl`}>
                    <MapPin className={`w-5 h-5 ${activeOffice.color.includes('blue') ? 'text-blue-600' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">{activeOffice.address}</p>
                    <p className="text-gray-600">{activeOffice.city}</p>
                    <p className="text-gray-600">{activeOffice.country}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`${activeOffice.bgColor} p-3 rounded-xl`}>
                    <Clock className={`w-5 h-5 ${activeOffice.color.includes('blue') ? 'text-blue-600' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                    <p className="text-gray-600">{activeOffice.hours}</p>
                    <p className="text-sm text-gray-500 mt-1">Weekends: Closed</p>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-3">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.link}
                      className={`flex items-center gap-4 p-4 ${method.bg} rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group`}
                    >
                      <Icon className={`w-6 h-6 ${method.color}`} />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 text-sm">{method.title}</h5>
                        <p className="text-gray-600 text-sm">{method.value}</p>
                      </div>
                      <ExternalLink className={`w-5 h-5 ${method.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
          {[
            { icon: Globe, value: '150+', label: 'Countries', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Users, value: '50K+', label: 'Students', color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: Award, value: '250+', label: 'Teachers', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Sparkles, value: '24/7', label: 'Support', color: 'text-orange-600', bg: 'bg-orange-50' }
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
        <div className={`text-center ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10">
              <MapPin className="w-16 h-16 text-white mx-auto mb-6 animate-float" />

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                Can't Visit? No Problem!
              </h3>

              <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Connect with us virtually! Schedule a video call, start a live chat, or explore our platform from anywhere in the world.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                  Schedule Virtual Tour
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>

                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-3">
                  <MessageCircle className="w-6 h-6" />
                  Start Live Chat
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Instant Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Expert Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Free Consultation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;