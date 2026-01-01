import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Edit,
  Plus,
  Users,
  BookOpen,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      enrolledStudents: 234,
      status: 'active',
      lessons: 45,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'React & Next.js Masterclass',
      enrolledStudents: 189,
      status: 'active',
      lessons: 32,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      enrolledStudents: 156,
      status: 'draft',
      lessons: 28,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      title: 'UI/UX Design Fundamentals',
      enrolledStudents: 298,
      status: 'active',
      lessons: 38,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      title: 'Mobile App Development',
      enrolledStudents: 142,
      status: 'active',
      lessons: 41,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      title: 'Advanced JavaScript Patterns',
      enrolledStudents: 87,
      status: 'draft',
      lessons: 24,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleEdit = (course) => {
    toast.info(`Editing: ${course.title}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleAddLessons = (course) => {
    toast.success(`Opening lesson editor for: ${course.title}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleViewStudents = (course) => {
    toast.info(`Viewing ${course.enrolledStudents} students in: ${course.title}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">Manage your courses and track student progress</p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-48 pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={item}
              layout
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'active'
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                    }`}>
                    {course.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{course.lessons} lessons</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddLessons(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Lessons</span>
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewStudents(course)}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">View Students</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filter</p>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherCourses;