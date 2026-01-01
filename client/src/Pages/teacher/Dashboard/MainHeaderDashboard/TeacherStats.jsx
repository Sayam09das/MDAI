import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, DollarSign, UserCheck } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        totalUsers: Math.floor(Math.random() * 1000) + 5000,
        totalStudents: Math.floor(Math.random() * 800) + 3500,
        totalTeachers: Math.floor(Math.random() * 100) + 150,
        totalCourses: Math.floor(Math.random() * 50) + 200,
        totalRevenue: Math.floor(Math.random() * 50000) + 250000
      });
    }, 3000);

    // Initial load
    setStats({
      totalUsers: 5247,
      totalStudents: 3842,
      totalTeachers: 189,
      totalCourses: 234,
      totalRevenue: 287450
    });

    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString(),
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses.toLocaleString(),
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <motion.div
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <motion.p
                key={stat.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-gray-900"
              >
                {stat.value}
              </motion.p>
            </div>
            <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminStats;