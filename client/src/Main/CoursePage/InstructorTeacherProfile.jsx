import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  BookOpen,
  Users,
  Star,
  CheckCircle,
  Globe,
  Briefcase,
  GraduationCap,
  TrendingUp,
  PlayCircle,
  MessageCircle,
  Share2,
  Heart,
  Sparkles,
  Target,
  Code,
  Palette,
  Database,
  BarChart,
  Trophy,
  Calendar
} from 'lucide-react';

const InstructorTeacherProfile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about' or 'courses'
  const [counters, setCounters] = useState({
    courses: 0,
    students: 0,
    rating: 0,
  });
  const sectionRef = useRef(null);

  const instructorData = {
    name: 'Dr. Sarah Johnson',
    title: 'Senior Full Stack Developer & AI Specialist',
    avatar: 'SJ',
    photo: null,
    bio: 'Passionate educator with 15+ years of experience in web development and artificial intelligence. I\'ve helped over 45,000 students worldwide achieve their career goals through practical, project-based learning. My mission is to make complex concepts accessible and help you build real-world skills.',
    longBio: 'I started my journey as a software engineer at Google, where I led teams building scalable applications. After realizing my passion for teaching, I transitioned to education and have since created comprehensive courses that have transformed thousands of careers. My teaching philosophy focuses on hands-on learning, real-world projects, and continuous mentorship.',
    expertise: [
      { icon: Code, name: 'Web Development', level: 95 },
      { icon: Database, name: 'Backend & APIs', level: 90 },
      { icon: Palette, name: 'UI/UX Design', level: 85 },
      { icon: BarChart, name: 'Data Science', level: 88 },
    ],
    achievements: [
      { icon: Trophy, text: 'Google Developer Expert' },
      { icon: Award, text: 'Best Instructor Award 2024' },
      { icon: Star, text: 'Top 1% Educator Worldwide' },
      { icon: GraduationCap, text: 'PhD in Computer Science - MIT' },
    ],
    stats: {
      totalCourses: 24,
      totalStudents: 45230,
      rating: 4.9,
      totalReviews: 12543,
      yearsExperience: 15,
      responseTime: '2 hours',
    },
    socialProof: {
      followers: 28500,
      coursesCompleted: 24,
      certificates: 156,
    },
    courses: [
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        students: 15230,
        rating: 4.9,
        thumbnail: 'from-blue-500 to-indigo-600',
      },
      {
        id: 2,
        title: 'Advanced React & Next.js',
        students: 12400,
        rating: 4.8,
        thumbnail: 'from-purple-500 to-pink-600',
      },
      {
        id: 3,
        title: 'Full Stack JavaScript',
        students: 9800,
        rating: 4.9,
        thumbnail: 'from-emerald-500 to-teal-600',
      },
    ],
  };

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

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        courses: Math.floor(instructorData.stats.totalCourses * progress),
        students: Math.floor(instructorData.stats.totalStudents * progress),
        rating: (instructorData.stats.rating * progress).toFixed(1),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters({
          courses: instructorData.stats.totalCourses,
          students: instructorData.stats.totalStudents,
          rating: instructorData.stats.rating,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-white via-indigo-50 to-white overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
            <Award className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Meet Your Instructor</span>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>

          {/* Cover Background */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>
            <Sparkles className="absolute top-10 right-20 w-12 h-12 text-white opacity-30 animate-pulse" />
            <Target className="absolute bottom-10 left-20 w-16 h-16 text-white opacity-20" />
          </div>

          <div className="relative px-6 md:px-12 pb-8">

            {/* Profile Image */}
            <div className="relative -mt-20 md:-mt-24 mb-6">
              <div className="inline-block">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-5xl md:text-6xl shadow-2xl border-8 border-white">
                    {instructorData.avatar}
                  </div>
                  {/* Verified Badge */}
                  <div className="absolute bottom-2 right-2 w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">

                {/* Name & Title */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    {instructorData.name}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-4">
                    {instructorData.title}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center space-x-2 ${isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>

                    <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Message</span>
                    </button>

                    <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('about')}
                      className={`pb-4 font-semibold transition-all duration-300 border-b-2 ${activeTab === 'about'
                          ? 'text-indigo-600 border-indigo-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900'
                        }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className={`pb-4 font-semibold transition-all duration-300 border-b-2 ${activeTab === 'courses'
                          ? 'text-indigo-600 border-indigo-600'
                          : 'text-gray-600 border-transparent hover:text-gray-900'
                        }`}
                    >
                      Courses ({instructorData.stats.totalCourses})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About Me</h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {instructorData.bio}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {instructorData.longBio}
                      </p>
                    </div>

                    {/* Expertise */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Target className="w-6 h-6 text-indigo-600" />
                        <span>Expertise</span>
                      </h3>
                      <div className="space-y-4">
                        {instructorData.expertise.map((skill, index) => {
                          const Icon = skill.icon;
                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-5 h-5 text-indigo-600" />
                                  <span className="font-semibold text-gray-900">
                                    {skill.name}
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-indigo-600">
                                  {skill.level}%
                                </span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 ease-out"
                                  style={{
                                    width: isVisible ? `${skill.level}%` : '0%',
                                    transitionDelay: `${index * 100}ms`
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <span>Achievements</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {instructorData.achievements.map((achievement, index) => {
                          const Icon = achievement.icon;
                          return (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-300"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {achievement.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div className="space-y-4">
                    {instructorData.courses.map((course, index) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className={`w-20 h-20 bg-gradient-to-br ${course.thumbnail} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <PlayCircle className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 mb-1 truncate">
                            {course.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold">{course.rating}</span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Stats */}
              <div className="space-y-6">

                {/* Key Stats */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-indigo-600" />
                    <span>Statistics</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-gray-600">Courses</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {counters.courses}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-600">Students</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {counters.students.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {counters.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">Response Time</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {instructorData.stats.responseTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {instructorData.stats.yearsExperience} years experience
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Teaching worldwide</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {instructorData.socialProof.followers.toLocaleString()} followers
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Joined 2015</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorTeacherProfile;