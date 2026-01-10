import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, CheckCircle2, Video, Award, TrendingUp, Clock,
  Target, Zap, Star, Calendar, Users, Trophy, Flame, Crown,
  ArrowUpRight, ArrowDownRight, Play, Download, Share2,
  BarChart3, PieChart, Activity, Eye, Heart, MessageCircle,
  ChevronRight, Sparkles, Medal, Gift, Bell
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentStats = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const stats = {
    enrolledCourses: {
      current: 12,
      previous: 8,
      change: 50,
      trend: 'up',
      breakdown: [
        { name: 'Active', value: 8, color: 'blue' },
        { name: 'Completed', value: 3, color: 'green' },
        { name: 'Paused', value: 1, color: 'yellow' }
      ],
      topCourses: [
        { name: 'Advanced React', progress: 67 },
        { name: 'Machine Learning', progress: 45 },
        { name: 'UX/UI Design', progress: 82 }
      ],
      weeklyGoal: { target: 10, current: 8 }
    },
    completedLessons: {
      current: 156,
      previous: 142,
      change: 9.9,
      trend: 'up',
      thisWeek: 12,
      streak: 7,
      breakdown: [
        { day: 'Mon', lessons: 2 },
        { day: 'Tue', lessons: 3 },
        { day: 'Wed', lessons: 1 },
        { day: 'Thu', lessons: 2 },
        { day: 'Fri', lessons: 2 },
        { day: 'Sat', lessons: 1 },
        { day: 'Sun', lessons: 1 }
      ],
      avgTimePerLesson: '18 min',
      totalHours: 47
    },
    liveClassesToday: {
      current: 3,
      upcoming: [
        { title: 'React Patterns', time: '10:00 AM', instructor: 'Sarah', attendees: 234 },
        { title: 'ML Workshop', time: '2:00 PM', instructor: 'Michael', attendees: 189 },
        { title: 'Design Review', time: '4:30 PM', instructor: 'Emma', attendees: 156 }
      ],
      attended: 24,
      avgRating: 4.8,
      nextClass: { title: 'React Patterns', startsIn: '2h 30m' }
    },
    certificates: {
      current: 5,
      previous: 3,
      change: 66.7,
      trend: 'up',
      recent: [
        { title: 'React Fundamentals', date: '2026-01-05', verified: true },
        { title: 'JavaScript Pro', date: '2025-12-28', verified: true },
        { title: 'Web Design', date: '2025-12-15', verified: true }
      ],
      nextMilestone: { course: 'UX/UI Design', progress: 82, remaining: 18 },
      credibility: 98
    }
  };

  const [currentStats, setCurrentStats] = useState(stats);

  useEffect(() => {
    toast.success(
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <div>
          <div className="font-semibold">Welcome back! 🎉</div>
          <div className="text-sm opacity-90">You're on a {currentStats.completedLessons.streak}-day streak!</div>
        </div>
      </div>,
      {
        position: window.innerWidth < 768 ? "top-center" : "top-right",
        autoClose: 4000,
      }
    );
  }, []);

  const handleCardClick = (cardType) => {
    const messages = {
      courses: 'Opening your enrolled courses...',
      lessons: 'Viewing lesson progress...',
      liveClasses: 'Checking live class schedule...',
      certificates: 'Opening your certificates...'
    };

    toast.info(messages[cardType], {
      position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
      autoClose: 2000,
    });
  };

  const handleShareAchievement = (achievement) => {
    toast.success(
      <div className="flex items-center gap-2">
        <Share2 className="w-5 h-5" />
        <span>Achievement shared on social media!</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      }
    );
  };

  const handleDownloadCertificate = () => {
    toast.success(
      <div className="flex items-center gap-2">
        <Download className="w-5 h-5" />
        <span>Certificate download started</span>
      </div>,
      {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      }
    );
  };

  const StatCard = ({ icon: Icon, title, mainValue, subtitle, trend, change, color, cardType, children }) => {
    const isHovered = hoveredCard === cardType;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onHoverStart={() => setHoveredCard(cardType)}
        onHoverEnd={() => setHoveredCard(null)}
        onClick={() => handleCardClick(cardType)}
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50 to-${color}-100 opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
        
        {/* Animated Background Pattern */}
        <motion.div
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : ['0% 0%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            
            {trend && change && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                  trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {trend === 'up' ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {change}%
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="mb-4">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
            <motion.div
              key={mainValue}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-1"
            >
              {mainValue}
            </motion.div>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>

          {/* Additional Content */}
          {children}

          {/* Hover Action */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 mt-4"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Sparkle Effect on Hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 1],
                    opacity: [1, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6 lg:p-8">
      <ToastContainer 
        position={window.innerWidth < 768 ? "top-center" : "top-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16 sm:mt-0"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Learning Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                Track your progress and achievements
                <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  <Flame className="w-3 h-3" />
                  {currentStats.completedLessons.streak} day streak
                </span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-start sm:self-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Notifications
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">3</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Enrolled Courses Card */}
          <StatCard
            icon={BookOpen}
            title="Enrolled Courses"
            mainValue={currentStats.enrolledCourses.current}
            subtitle={`+${currentStats.enrolledCourses.current - currentStats.enrolledCourses.previous} from last month`}
            trend={currentStats.enrolledCourses.trend}
            change={currentStats.enrolledCourses.change}
            color="blue"
            cardType="courses"
          >
            <div className="space-y-2 mb-3">
              {currentStats.enrolledCourses.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600">Weekly Goal</span>
                <span className="font-bold text-gray-900">
                  {currentStats.enrolledCourses.weeklyGoal.current}/{currentStats.enrolledCourses.weeklyGoal.target}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStats.enrolledCourses.weeklyGoal.current / currentStats.enrolledCourses.weeklyGoal.target) * 100}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </StatCard>

          {/* Completed Lessons Card */}
          <StatCard
            icon={CheckCircle2}
            title="Completed Lessons"
            mainValue={currentStats.completedLessons.current}
            subtitle={`${currentStats.completedLessons.thisWeek} lessons this week`}
            trend={currentStats.completedLessons.trend}
            change={currentStats.completedLessons.change}
            color="green"
            cardType="lessons"
          >
            <div className="space-y-3 mb-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-semibold text-gray-700">Current Streak</span>
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {currentStats.completedLessons.streak} days
                </span>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {currentStats.completedLessons.breakdown.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day.day[0]}</div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                        day.lessons > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {day.lessons}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
              <span className="text-gray-600">Total Hours</span>
              <span className="font-bold text-gray-900">{currentStats.completedLessons.totalHours}h</span>
            </div>
          </StatCard>

          {/* Live Classes Today Card */}
          <StatCard
            icon={Video}
            title="Live Classes Today"
            mainValue={currentStats.liveClassesToday.current}
            subtitle={`${currentStats.liveClassesToday.attended} attended this month`}
            trend="up"
            change={12.5}
            color="purple"
            cardType="liveClasses"
          >
            <div className="space-y-2 mb-3">
              {currentStats.liveClassesToday.upcoming.slice(0, 2).map((cls, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-2 bg-purple-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-900 line-clamp-1">
                      {cls.title}
                    </span>
                    <span className="text-xs font-bold text-purple-600 whitespace-nowrap ml-2">
                      {cls.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>{cls.attendees} enrolled</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-purple-600" />
                <span className="text-gray-600">Next class starts in</span>
                <span className="font-bold text-purple-600">
                  {currentStats.liveClassesToday.nextClass.startsIn}
                </span>
              </div>
            </div>
          </StatCard>

          {/* Certificates Card */}
          <StatCard
            icon={Award}
            title="Certificates Earned"
            mainValue={currentStats.certificates.current}
            subtitle={`+${currentStats.certificates.current - currentStats.certificates.previous} new certificates`}
            trend={currentStats.certificates.trend}
            change={currentStats.certificates.change}
            color="yellow"
            cardType="certificates"
          >
            <div className="space-y-2 mb-3">
              {currentStats.certificates.recent.slice(0, 2).map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg"
                >
                  <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {cert.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(cert.date).toLocaleDateString()}
                    </p>
                  </div>
                  {cert.verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Next Milestone</span>
                <span className="font-bold text-yellow-600">
                  {currentStats.certificates.nextMilestone.progress}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStats.certificates.nextMilestone.progress}%` }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </StatCard>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Top Courses Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 col-span-1 md:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Top Courses Progress
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {currentStats.enrolledCourses.topCourses.map((course, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{course.name}</span>
                    <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              Quick Actions
            </h3>

            <div className="space-y-3">
              {[
                { icon: Download, label: 'Download Certificates', color: 'blue', action: handleDownloadCertificate },
                { icon: Share2, label: 'Share Achievement', color: 'green', action: () => handleShareAchievement('streak') },
                { icon: Calendar, label: 'Schedule Study Time', color: 'purple', action: () => {} },
                { icon: Star, label: 'Rate Courses', color: 'yellow', action: () => {} }
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className={`w-full p-3 bg-${action.color}-50 hover:bg-${action.color}-100 rounded-xl flex items-center gap-3 transition-all group`}
                >
                  <div className={`w-10 h-10 bg-${action.color}-500 rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-900">
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Medal className="w-6 h-6 text-yellow-600" />
              Recent Achievements
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              View All Badges
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: Flame, label: 'Week Streak', color: 'orange', unlocked: true },
              { icon: Trophy, label: 'Fast Learner', color: 'yellow', unlocked: true },
              { icon: Crown, label: 'Top Student', color: 'purple', unlocked: true },
              { icon: Target, label: 'Goal Crusher', color: 'green', unlocked: true },
              { icon: Star, label: 'Perfect Score', color: 'blue', unlocked: false },
              { icon: Gift, label: 'Early Bird', color: 'pink', unlocked: false }
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                whileHover={{ scale: badge.unlocked ? 1.1 : 1, rotate: badge.unlocked ? 5 : 0 }}
                className={`relative p-4 rounded-xl text-center transition-all ${
                  badge.unlocked 
                    ? `bg-${badge.color}-50 cursor-pointer` 
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                  badge.unlocked 
                    ? `bg-${badge.color}-500`
                    : 'bg-gray-300'
                }`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-900">{badge.label}</p>
                
                {badge.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentStats;