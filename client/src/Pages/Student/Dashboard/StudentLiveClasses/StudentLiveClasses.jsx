import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar, Clock, Users, Bell, Share2, Download,
  CheckCircle2, XCircle, AlertCircle, Play, Zap, Star,
  TrendingUp, Award, BookOpen, Filter, Search, X, ChevronRight,
  DollarSign, Lock, CreditCard, ExternalLink, MessageCircle,
  Bookmark, MoreVertical, MapPin, Globe, Heart
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentLiveClasses = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [savedClasses, setSavedClasses] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // User payment status for different courses
  const [paymentStatus, setPaymentStatus] = useState({
    1: 'success',
    2: 'success',
    3: 'pending',
    4: 'failed',
    5: 'success',
    6: 'pending'
  });

  const liveClasses = {
    ongoing: [
      {
        id: 1,
        title: "Advanced React Patterns & Performance",
        instructor: {
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=1",
          rating: 4.9,
          students: 12500
        },
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        startTime: "10:00 AM",
        duration: "2h 30m",
        currentViewers: 234,
        category: "Web Development",
        level: "Advanced",
        price: 49.99,
        tags: ["React", "Performance", "Hooks"],
        isLive: true,
        timeElapsed: "45 min",
        progress: 30
      },
      {
        id: 2,
        title: "Machine Learning Fundamentals Workshop",
        instructor: {
          name: "Dr. Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=2",
          rating: 5.0,
          students: 8900
        },
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        startTime: "11:30 AM",
        duration: "3h 00m",
        currentViewers: 189,
        category: "Data Science",
        level: "Intermediate",
        price: 59.99,
        tags: ["ML", "Python", "AI"],
        isLive: true,
        timeElapsed: "15 min",
        progress: 8
      }
    ],
    upcoming: [
      {
        id: 3,
        title: "UX/UI Design Masterclass 2026",
        instructor: {
          name: "Emma Williams",
          avatar: "https://i.pravatar.cc/150?img=3",
          rating: 4.8,
          students: 15200
        },
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
        startTime: "2:00 PM",
        duration: "2h 00m",
        expectedViewers: 450,
        category: "Design",
        level: "Beginner",
        price: 39.99,
        tags: ["Figma", "UI/UX", "Design"],
        startsIn: "2h 30m",
        date: "Today"
      },
      {
        id: 4,
        title: "Cloud Architecture Deep Dive",
        instructor: {
          name: "James Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=4",
          rating: 4.7,
          students: 6780
        },
        thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
        startTime: "4:30 PM",
        duration: "2h 45m",
        expectedViewers: 320,
        category: "Cloud Computing",
        level: "Advanced",
        price: 69.99,
        tags: ["AWS", "Azure", "DevOps"],
        startsIn: "5h 00m",
        date: "Today"
      },
      {
        id: 5,
        title: "Full-Stack JavaScript Bootcamp",
        instructor: {
          name: "Alex Turner",
          avatar: "https://i.pravatar.cc/150?img=5",
          rating: 4.9,
          students: 9800
        },
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
        startTime: "10:00 AM",
        duration: "4h 00m",
        expectedViewers: 580,
        category: "Web Development",
        level: "Intermediate",
        price: 79.99,
        tags: ["Node.js", "React", "MongoDB"],
        startsIn: "1 day",
        date: "Tomorrow"
      },
      {
        id: 6,
        title: "Blockchain & Web3 Development",
        instructor: {
          name: "Sophia Martinez",
          avatar: "https://i.pravatar.cc/150?img=6",
          rating: 4.6,
          students: 5400
        },
        thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
        startTime: "3:00 PM",
        duration: "3h 30m",
        expectedViewers: 410,
        category: "Blockchain",
        level: "Advanced",
        price: 89.99,
        tags: ["Solidity", "Ethereum", "Smart Contracts"],
        startsIn: "2 days",
        date: "Jan 12"
      }
    ]
  };

  const categories = ['all', 'Web Development', 'Data Science', 'Design', 'Cloud Computing', 'Blockchain'];

  useEffect(() => {
    toast.info(
      <div className="flex items-center gap-2">
        <Video className="w-5 h-5" />
        <div>
          <div className="font-semibold">Live Classes Available</div>
          <div className="text-sm opacity-90">2 classes ongoing now!</div>
        </div>
      </div>,
      {
        position: window.innerWidth < 768 ? "top-center" : "top-right",
        autoClose: 4000,
      }
    );
  }, []);

  const handleJoinClass = (classItem) => {
    const status = paymentStatus[classItem.id];

    if (status === 'success') {
      toast.success(
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          <div>
            <div className="font-semibold">Joining Live Class</div>
            <div className="text-sm opacity-90">{classItem.title}</div>
          </div>
        </div>,
        {
          position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
          autoClose: 2000,
        }
      );
    } else if (status === 'pending') {
      toast.warning(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <div>
            <div className="font-semibold">Payment Pending</div>
            <div className="text-sm opacity-90">Complete payment to join</div>
          </div>
        </div>,
        {
          position: window.innerWidth < 768 ? "top-center" : "top-right",
        }
      );
      setSelectedClass(classItem);
      setShowPaymentModal(true);
    } else if (status === 'failed') {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <div>
            <div className="font-semibold">Payment Failed</div>
            <div className="text-sm opacity-90">Please retry payment</div>
          </div>
        </div>,
        {
          position: window.innerWidth < 768 ? "top-center" : "top-right",
        }
      );
      setSelectedClass(classItem);
      setShowPaymentModal(true);
    }
  };

  const handlePayment = (classId) => {
    setPaymentStatus({ ...paymentStatus, [classId]: 'success' });
    setShowPaymentModal(false);
    
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <div>
          <div className="font-semibold">Payment Successful! 🎉</div>
          <div className="text-sm opacity-90">You can now join the class</div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 3000,
      }
    );
  };

  const handleSaveClass = (classId) => {
    if (savedClasses.includes(classId)) {
      setSavedClasses(savedClasses.filter(id => id !== classId));
      toast.info('Removed from saved classes', {
        position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
        autoClose: 2000,
      });
    } else {
      setSavedClasses([...savedClasses, classId]);
      toast.success(
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5" />
          <span>Saved to your list</span>
        </div>,
        {
          position: window.innerWidth < 768 ? "bottom-center" : "bottom-right",
          autoClose: 2000,
        }
      );
    }
  };

  const handleNotifyMe = (classItem) => {
    toast.success(
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5" />
        <div>
          <div className="font-semibold">Reminder Set! 🔔</div>
          <div className="text-sm opacity-90">We'll notify you before class starts</div>
        </div>
      </div>,
      {
        position: window.innerWidth < 768 ? "top-center" : "top-right",
      }
    );
  };

  const getPaymentStatusBadge = (classId) => {
    const status = paymentStatus[classId];
    
    switch (status) {
      case 'success':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Enrolled
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3 h-3" />
            Payment Pending
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Payment Failed
          </div>
        );
      default:
        return null;
    }
  };

  const filteredClasses = liveClasses[activeTab].filter(classItem => {
    const matchesCategory = filterCategory === 'all' || classItem.category === filterCategory;
    const matchesSearch = classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const LiveClassCard = ({ classItem, index }) => {
    const status = paymentStatus[classItem.id];
    const canJoin = status === 'success';
    const isSaved = savedClasses.includes(classItem.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        <div className="relative">
          <img 
            src={classItem.thumbnail} 
            alt={classItem.title}
            className="w-full h-40 sm:h-48 object-cover"
          />
          
          {classItem.isLive && (
            <div className="absolute top-3 left-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-bold"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </motion.div>
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => handleSaveClass(classItem.id)}
              className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart 
                className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
              />
            </button>
            <button className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
              {classItem.level}
            </span>
            {classItem.isLive && classItem.currentViewers && (
              <div className="flex items-center gap-1 px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                <Users className="w-3 h-3" />
                {classItem.currentViewers}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 flex-1">
              {classItem.title}
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <img 
              src={classItem.instructor.avatar} 
              alt={classItem.instructor.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">
                {classItem.instructor.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{classItem.instructor.rating}</span>
                </div>
                <span>•</span>
                <span>{classItem.instructor.students.toLocaleString()} students</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{classItem.isLive ? classItem.timeElapsed : classItem.startTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Video className="w-4 h-4" />
              <span>{classItem.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{classItem.date || 'Live Now'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <DollarSign className="w-4 h-4" />
              <span>${classItem.price}</span>
            </div>
          </div>

          {classItem.isLive && classItem.progress && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Class Progress</span>
                <span className="text-xs font-semibold text-gray-900">{classItem.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${classItem.progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {classItem.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mb-4">
            {getPaymentStatusBadge(classItem.id)}
          </div>

          {classItem.startsIn && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">
                  Starts in <span className="font-bold text-blue-600">{classItem.startsIn}</span>
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {canJoin ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJoinClass(classItem)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                {classItem.isLive ? 'Join Now' : 'Join Class'}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJoinClass(classItem)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" />
                Complete Payment
              </motion.button>
            )}
            
            {!classItem.isLive && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNotifyMe(classItem)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-3 sm:p-6 lg:p-8">
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
                Live Classes
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Join interactive sessions with expert instructors
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { icon: Video, label: 'Live Now', value: '2', color: 'red' },
              { icon: Calendar, label: 'Upcoming', value: '4', color: 'blue' },
              { icon: CheckCircle2, label: 'Enrolled', value: '3', color: 'green' },
              { icon: Bookmark, label: 'Saved', value: savedClasses.length, color: 'purple' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {[
              { value: 'ongoing', label: 'Live Now', icon: Video, count: liveClasses.ongoing.length },
              { value: 'upcoming', label: 'Upcoming', icon: Calendar, count: liveClasses.upcoming.length }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.value ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    filterCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <AnimatePresence mode="wait">
          {filteredClasses.length > 0 ? (
            <motion.div
              key="classes-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredClasses.map((classItem, index) => (
                <LiveClassCard key={classItem.id} classItem={classItem} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-classes"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 sm:py-20"
            >
              <Video className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">No classes found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedClass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPaymentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="mb-6">
                  <img 
                    src={selectedClass.thumbnail}
                    alt={selectedClass.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {selectedClass.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    with {selectedClass.instructor.name}
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <span className="text-gray-700 font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${selectedClass.price}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pay with Card
                  </button>
                  <button className="w-full p-4 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pay with PayPal
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment(selectedClass.id)}
                  className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  Complete Payment
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Stripe
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentLiveClasses;