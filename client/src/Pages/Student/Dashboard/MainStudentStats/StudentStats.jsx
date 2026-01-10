import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, CheckCircle2, Video, Award, TrendingUp, Clock,
  Target, Flame, Trophy, ArrowUpRight, Users, Star, Calendar,
  Download, Share2, ChevronRight, Medal, Crown, Gift
} from 'lucide-react';

const StudentStats = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

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
      totalHours: 47
    },
    liveClassesToday: {
      current: 3,
      upcoming: [
        { title: 'React Patterns', time: '10:00 AM', attendees: 234 },
        { title: 'ML Workshop', time: '2:00 PM', attendees: 189 },
        { title: 'Design Review', time: '4:30 PM', attendees: 156 }
      ],
      attended: 24,
      nextClass: { startsIn: '2h 30m' }
    },
    certificates: {
      current: 5,
      previous: 3,
      change: 66.7,
      trend: 'up',
      recent: [
        { title: 'React Fundamentals', date: '2026-01-05', verified: true },
        { title: 'JavaScript Pro', date: '2025-12-28', verified: true }
      ],
      nextMilestone: { course: 'UX/UI Design', progress: 82 }
    }
  };

  const StatCard = ({ icon: Icon, title, mainValue, subtitle, trend, change, color, cardType, children }) => {
    const isHovered = hoveredCard === cardType;
    
    return (
      <motion.div
        whileHover={{ y: -5 }}
        onHoverStart={() => setHoveredCard(cardType)}
        onHoverEnd={() => setHoveredCard(null)}
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-50 to-${color}-100 opacity-50 group-hover:opacity-70 transition-opacity`} />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            
            {trend && change && (
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <ArrowUpRight className="w-3 h-3" />
                {change}%
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
            <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-1">
              {mainValue}
            </div>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>

          {children}

          {isHovered && (
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mt-4">
              View Details
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Learning Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                Track your progress and achievements
                <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  <Flame className="w-3 h-3" />
                  {stats.completedLessons.streak} day streak
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Enrolled Courses Card */}
          <StatCard
            icon={BookOpen}
            title="Enrolled Courses"
            mainValue={stats.enrolledCourses.current}
            subtitle={`+${stats.enrolledCourses.current - stats.enrolledCourses.previous} from last month`}
            trend={stats.enrolledCourses.trend}
            change={stats.enrolledCourses.change}
            color="blue"
            cardType="courses"
          >
            <div className="space-y-2 mb-3">
              {stats.enrolledCourses.breakdown.map((item, idx) => (
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
                  {stats.enrolledCourses.weeklyGoal.current}/{stats.enrolledCourses.weeklyGoal.target}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.enrolledCourses.weeklyGoal.current / stats.enrolledCourses.weeklyGoal.target) * 100}%` }}
                />
              </div>
            </div>
          </StatCard>

          {/* Completed Lessons Card */}
          <StatCard
            icon={CheckCircle2}
            title="Completed Lessons"
            mainValue={stats.completedLessons.current}
            subtitle={`${stats.completedLessons.thisWeek} lessons this week`}
            trend={stats.completedLessons.trend}
            change={stats.completedLessons.change}
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
                  {stats.completedLessons.streak} days
                </span>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {stats.completedLessons.breakdown.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day.day[0]}</div>
                    <div
                      className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                        day.lessons > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {day.lessons}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
              <span className="text-gray-600">Total Hours</span>
              <span className="font-bold text-gray-900">{stats.completedLessons.totalHours}h</span>
            </div>
          </StatCard>

          {/* Live Classes Today Card */}
          <StatCard
            icon={Video}
            title="Live Classes Today"
            mainValue={stats.liveClassesToday.current}
            subtitle={`${stats.liveClassesToday.attended} attended this month`}
            trend="up"
            change={12.5}
            color="purple"
            cardType="liveClasses"
          >
            <div className="space-y-2 mb-3">
              {stats.liveClassesToday.upcoming.slice(0, 2).map((cls, idx) => (
                <div key={idx} className="p-2 bg-purple-50 rounded-lg">
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
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-purple-600" />
                <span className="text-gray-600">Next class starts in</span>
                <span className="font-bold text-purple-600">
                  {stats.liveClassesToday.nextClass.startsIn}
                </span>
              </div>
            </div>
          </StatCard>

          {/* Certificates Card */}
          <StatCard
            icon={Award}
            title="Certificates Earned"
            mainValue={stats.certificates.current}
            subtitle={`+${stats.certificates.current - stats.certificates.previous} new certificates`}
            trend={stats.certificates.trend}
            change={stats.certificates.change}
            color="yellow"
            cardType="certificates"
          >
            <div className="space-y-2 mb-3">
              {stats.certificates.recent.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
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
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Next Milestone</span>
                <span className="font-bold text-yellow-600">
                  {stats.certificates.nextMilestone.progress}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.certificates.nextMilestone.progress}%` }}
                />
              </div>
            </div>
          </StatCard>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Top Courses Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 col-span-1 md:col-span-2">
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
              {stats.enrolledCourses.topCourses.map((course, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{course.name}</span>
                    <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Quick Actions
            </h3>

            <div className="space-y-3">
              {[
                { icon: Download, label: 'Download Certificates', color: 'blue' },
                { icon: Share2, label: 'Share Achievement', color: 'green' },
                { icon: Calendar, label: 'Schedule Study Time', color: 'purple' },
                { icon: Star, label: 'Rate Courses', color: 'yellow' }
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`w-full p-3 bg-${action.color}-50 hover:bg-${action.color}-100 rounded-xl flex items-center gap-3 transition-all group`}
                >
                  <div className={`w-10 h-10 bg-${action.color}-500 rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
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
                whileHover={{ scale: badge.unlocked ? 1.1 : 1 }}
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;