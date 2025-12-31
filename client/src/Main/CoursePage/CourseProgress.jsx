import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayCircle,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  Target,
  BookOpen,
  Video,
  FileText,
  Calendar,
  Zap,
  Trophy,
  Star,
  Lock,
  ArrowRight,
  Download,
  Share2,
  BarChart
} from 'lucide-react';

const CourseProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [hoveredModule, setHoveredModule] = useState(null);
  const sectionRef = useRef(null);

  const progressData = {
    courseTitle: 'Complete Web Development Bootcamp',
    overallProgress: 65,
    completedLessons: 211,
    totalLessons: 325,
    hoursCompleted: 31.2,
    totalHours: 48,
    nextLesson: 'Advanced React Hooks',
    estimatedCompletion: '12 days',
    streak: 7,
    lastAccessed: '2 hours ago',
  };

  const modules = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      lessons: 15,
      completed: 15,
      duration: '2.5 hours',
      status: 'completed',
      icon: BookOpen,
    },
    {
      id: 2,
      title: 'HTML & CSS Fundamentals',
      lessons: 32,
      completed: 32,
      duration: '5 hours',
      status: 'completed',
      icon: FileText,
    },
    {
      id: 3,
      title: 'JavaScript Basics to Advanced',
      lessons: 48,
      completed: 48,
      duration: '8 hours',
      status: 'completed',
      icon: Zap,
    },
    {
      id: 4,
      title: 'React & Modern Frontend',
      lessons: 56,
      completed: 42,
      duration: '9.5 hours',
      status: 'in-progress',
      icon: Video,
    },
    {
      id: 5,
      title: 'Backend with Node.js',
      lessons: 64,
      completed: 28,
      duration: '11 hours',
      status: 'in-progress',
      icon: BarChart,
    },
    {
      id: 6,
      title: 'Database & APIs',
      lessons: 52,
      completed: 22,
      duration: '8.5 hours',
      status: 'in-progress',
      icon: BookOpen,
    },
    {
      id: 7,
      title: 'Full Stack Projects',
      lessons: 38,
      completed: 18,
      duration: '6.5 hours',
      status: 'in-progress',
      icon: Trophy,
    },
    {
      id: 8,
      title: 'Deployment & DevOps',
      lessons: 20,
      completed: 6,
      duration: '3.5 hours',
      status: 'in-progress',
      icon: Target,
    },
  ];

  const achievements = [
    { icon: Trophy, title: 'Fast Learner', unlocked: true },
    { icon: Zap, title: '7 Day Streak', unlocked: true },
    { icon: Star, title: 'Quiz Master', unlocked: true },
    { icon: Award, title: 'Project Builder', unlocked: false },
  ];

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
    const increment = progressData.overallProgress / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= progressData.overallProgress) {
        setAnimatedProgress(progressData.overallProgress);
        clearInterval(timer);
      } else {
        setAnimatedProgress(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-600';
      case 'in-progress':
        return 'from-indigo-500 to-purple-600';
      case 'locked':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50';
      case 'in-progress':
        return 'bg-indigo-50';
      case 'locked':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-white via-indigo-50 to-white overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Your Learning Journey</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Course <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Progress</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {progressData.courseTitle}
          </p>
        </div>

        {/* Main Progress Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 mb-12 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Progress Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Left - Progress Circle */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative w-48 h-48 mb-6">
                  {/* Background Circle */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="16"
                      fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="white"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - animatedProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-5xl font-extrabold text-white mb-1">
                      {animatedProgress}%
                    </div>
                    <div className="text-sm text-white/90 font-semibold">
                      Complete
                    </div>
                  </div>
                </div>
                
                <div className="text-white text-center md:text-left">
                  <div className="text-2xl font-bold mb-2">
                    Keep Going! 🎯
                  </div>
                  <div className="text-white/90">
                    You're {100 - progressData.overallProgress}% away from completion
                  </div>
                </div>
              </div>

              {/* Right - Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span className="text-white/90 text-sm">Completed</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {progressData.completedLessons}
                  </div>
                  <div className="text-white/80 text-sm">
                    of {progressData.totalLessons} lessons
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white/90 text-sm">Time Spent</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {progressData.hoursCompleted}h
                  </div>
                  <div className="text-white/80 text-sm">
                    of {progressData.totalHours} hours
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-white" />
                    <span className="text-white/90 text-sm">Streak</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {progressData.streak}
                  </div>
                  <div className="text-white/80 text-sm">
                    days in a row 🔥
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="text-white/90 text-sm">Est. Completion</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {progressData.estimatedCompletion.split(' ')[0]}
                  </div>
                  <div className="text-white/80 text-sm">
                    days remaining
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning Section */}
          <div className="p-8 md:p-12 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">
                  Next Lesson
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {progressData.nextLesson}
                </h3>
                <div className="text-sm text-gray-600">
                  Last accessed {progressData.lastAccessed}
                </div>
              </div>
              
              <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-3 cursor-not-allowed">
                <PlayCircle className="w-6 h-6" />
                <span>Continue Learning</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Modules & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Modules List */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <BookOpen className="w-7 h-7 text-indigo-600" />
              <span>Course Modules</span>
            </h3>

            <div className="space-y-4">
              {modules.map((module, index) => {
                const Icon = module.icon;
                const progress = (module.completed / module.lessons) * 100;
                const isHovered = hoveredModule === module.id;
                
                return (
                  <div
                    key={module.id}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                    className={`group bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      isHovered ? '-translate-y-1' : ''
                    }`}
                    style={{ 
                      transitionDelay: `${index * 50}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${getStatusColor(module.status)} rounded-xl flex items-center justify-center flex-shrink-0 transform transition-all duration-300 ${
                        isHovered ? 'scale-110 rotate-6' : ''
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                            {module.title}
                          </h4>
                          
                          {module.status === 'completed' && (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center space-x-1">
                            <Video className="w-4 h-4" />
                            <span>{module.lessons} lessons</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{module.duration}</span>
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            module.status === 'completed' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {module.completed}/{module.lessons} completed
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getStatusColor(module.status)} transition-all duration-1000 ease-out`}
                              style={{ 
                                width: isVisible ? `${progress}%` : '0%',
                                transitionDelay: `${index * 100}ms`
                              }}
                            />
                          </div>
                          <div className="absolute -top-1 right-0 text-xs font-bold text-gray-700">
                            {Math.round(progress)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Sidebar */}
          <div className={`transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span>Achievements</span>
              </h3>

              <div className="space-y-4 mb-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : 'bg-gray-300'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">
                          {achievement.title}
                        </div>
                        {achievement.unlocked && (
                          <div className="text-xs text-green-600 font-semibold">
                            Unlocked! 🎉
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2 cursor-not-allowed">
                  <Download className="w-5 h-5" />
                  <span>Download Certificate</span>
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2  cursor-not-allowed">
                  <Share2 className="w-5 h-5" />
                  <span>Share Progress</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;