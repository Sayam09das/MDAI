import React, { useState, useEffect, useRef } from 'react';
import {
  Linkedin, Instagram, Twitter, Youtube,
  Users, Heart, TrendingUp, Share2,
  ExternalLink, Sparkles, MessageCircle, CheckCircle
} from 'lucide-react';

const SocialLinks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);
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

  const socialPlatforms = [
    {
      id: 1,
      name: 'LinkedIn',
      icon: Linkedin,
      handle: '@eduplatform',
      followers: '50K+',
      description: 'Professional insights, career tips, and industry updates',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      url: 'https://linkedin.com/company/eduplatform',
      stats: { posts: '500+', engagement: '85%' }
    },
    {
      id: 2,
      name: 'Instagram',
      icon: Instagram,
      handle: '@eduplatform',
      followers: '120K+',
      description: 'Daily inspiration, student stories, and behind-the-scenes',
      color: 'from-pink-600 via-purple-600 to-orange-500',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:from-pink-700 hover:via-purple-700 hover:to-orange-600',
      url: 'https://instagram.com/eduplatform',
      stats: { posts: '1.2K+', engagement: '92%' }
    },
    {
      id: 3,
      name: 'Twitter',
      icon: Twitter,
      handle: '@eduplatform',
      followers: '75K+',
      description: 'Real-time updates, tech news, and community discussions',
      color: 'from-sky-500 to-blue-600',
      bgColor: 'bg-sky-50',
      hoverColor: 'hover:from-sky-600 hover:to-blue-700',
      url: 'https://twitter.com/eduplatform',
      stats: { tweets: '2.5K+', engagement: '88%' }
    },
    {
      id: 4,
      name: 'YouTube',
      icon: Youtube,
      handle: '@eduplatform',
      followers: '200K+',
      description: 'Free tutorials, course previews, and expert interviews',
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:from-red-700 hover:to-red-800',
      url: 'https://youtube.com/@eduplatform',
      stats: { videos: '500+', engagement: '95%' }
    }
  ];

  const SocialCard = ({ platform, index }) => {
    const Icon = platform.icon;
    const isHovered = hoveredSocial === platform.id;

    return (
      <div
        className={`group relative transition-all duration-700 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'
          }`}
        style={{ animationDelay: `${index * 0.15}s` }}
        onMouseEnter={() => setHoveredSocial(platform.id)}
        onMouseLeave={() => setHoveredSocial(null)}
      >
        <div
          className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 transform ${isHovered
              ? 'scale-105 shadow-2xl border-transparent'
              : 'scale-100 shadow-xl border-gray-200'
            }`}
        >
          {/* Background Gradient on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} transition-opacity duration-500 ${isHovered ? 'opacity-10' : 'opacity-0'
            }`}></div>

          <div className="relative p-8">
            {/* Icon */}
            <div className="mb-6">
              <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${platform.color} transform transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                } shadow-xl`}>
                <Icon className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Platform Info */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {platform.name}
            </h3>
            <p className="text-base text-gray-600 mb-1">{platform.handle}</p>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-lg font-bold text-gray-900">{platform.followers}</span>
              <span className="text-sm text-gray-500">Followers</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {platform.description}
            </p>

            {/* Stats */}
            <div className={`grid grid-cols-2 gap-3 mb-6 ${platform.bgColor} rounded-xl p-4`}>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {platform.stats.posts || platform.stats.tweets || platform.stats.videos}
                </div>
                <div className="text-xs text-gray-600">
                  {platform.name === 'Twitter' ? 'Tweets' : platform.name === 'YouTube' ? 'Videos' : 'Posts'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{platform.stats.engagement}</div>
                <div className="text-xs text-gray-600">Engagement</div>
              </div>
            </div>

            {/* Follow Button */}
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg ${isHovered
                  ? `bg-gradient-to-r ${platform.color} ${platform.hoverColor} text-white transform scale-105`
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
            >
              Follow on {platform.name}
              <ExternalLink className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1 -translate-y-1' : ''
                }`} />
            </a>
          </div>

          {/* Decorative Corner */}
          <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${platform.color} rounded-full blur-3xl transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'
            }`}></div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
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
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 50px rgba(99, 102, 241, 0.6);
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

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className={`text-center mb-16 md:mb-20 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Connect With Us
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Join Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Community
            </span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow us on social media for daily inspiration, learning tips, exclusive content, and to be part of our growing community
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {socialPlatforms.map((platform, index) => (
            <SocialCard key={platform.id} platform={platform} index={index} />
          ))}
        </div>

        {/* Stats Bar */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          {[
            { icon: Users, value: '445K+', label: 'Total Followers', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Heart, value: '1M+', label: 'Total Likes', color: 'text-pink-600', bg: 'bg-pink-50' },
            { icon: MessageCircle, value: '50K+', label: 'Comments', color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: TrendingUp, value: '90%', label: 'Engagement Rate', color: 'text-green-600', bg: 'bg-green-50' }
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

        {/* CTA Banner */}
        <div className={`${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden animate-pulse-glow">
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
                Don't Miss Out on Exclusive Content!
              </h3>

              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get access to free tutorials, course discounts, live Q&A sessions, and be the first to know about new features
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <button className="group px-8 py-4 bg-white text-indigo-600 text-base md:text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-3 cursor-pointer transform hover:scale-105 w-full sm:w-auto">
                  Follow All Platforms
                  <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </button>

                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white text-base md:text-lg font-bold rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer w-full sm:w-auto">
                  View Feed
                </button>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Daily Tips & Tricks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Exclusive Offers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm md:text-base">Community Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hashtags Section */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Join the Conversation
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['#EduPlatform', '#LearnWithUs', '#EdTech', '#OnlineLearning', '#SkillUp'].map((hashtag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;