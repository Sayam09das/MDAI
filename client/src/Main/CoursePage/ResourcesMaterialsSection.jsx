import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, Download, ExternalLink, Video, Link2,
  BookOpen, CheckCircle, Lock, Search, Filter,
  Folder, Star, Calendar, Eye, TrendingUp,
  File, Archive, Code, Clock
} from 'lucide-react';
import { toast } from "react-toastify";


const ResourcesMaterialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadedItems, setDownloadedItems] = useState([]);
  const sectionRef = useRef(null);

  // Simulate payment status
  const [isPaid, setIsPaid] = useState(false);

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

  const resourcesData = {
    pdfs: [
      {
        id: 'pdf-1',
        title: 'Machine Learning Fundamentals - Complete Guide',
        description: 'Comprehensive 150-page guide covering all ML basics',
        size: '4.2 MB',
        pages: 150,
        downloads: 2847,
        uploadDate: '2 days ago',
        category: 'Notes',
        locked: false,
        downloadUrl: 'https://example.com/ml-guide.pdf',
        rating: 4.9
      },
      {
        id: 'pdf-2',
        title: 'Python Cheat Sheet for Data Science',
        description: 'Quick reference guide for NumPy, Pandas, and Matplotlib',
        size: '1.8 MB',
        pages: 24,
        downloads: 4521,
        uploadDate: '5 days ago',
        category: 'Cheat Sheet',
        locked: false,
        downloadUrl: 'https://example.com/python-cheat.pdf',
        rating: 4.8
      },
      {
        id: 'pdf-3',
        title: 'Deep Learning Mathematical Foundations',
        description: 'Linear algebra, calculus, and probability for deep learning',
        size: '6.5 MB',
        pages: 200,
        downloads: 1923,
        uploadDate: '1 week ago',
        category: 'Advanced',
        locked: false,
        downloadUrl: 'https://example.com/dl-math.pdf',
        rating: 4.7
      },
      {
        id: 'pdf-4',
        title: 'Neural Networks Architecture Patterns',
        description: 'Common CNN, RNN, and Transformer architectures explained',
        size: '3.4 MB',
        pages: 85,
        downloads: 1654,
        uploadDate: '3 days ago',
        category: 'Notes',
        locked: true,
        downloadUrl: 'https://example.com/nn-patterns.pdf',
        rating: 4.9
      }
    ],
    assignments: [
      {
        id: 'assign-1',
        title: 'Linear Regression Implementation',
        description: 'Build a linear regression model from scratch using NumPy',
        difficulty: 'Beginner',
        estimatedTime: '3-4 hours',
        points: 50,
        dueDate: 'Dec 31, 2025',
        locked: false,
        completed: false
      },
      {
        id: 'assign-2',
        title: 'Image Classification with CNN',
        description: 'Create a CNN to classify images from CIFAR-10 dataset',
        difficulty: 'Intermediate',
        estimatedTime: '6-8 hours',
        points: 100,
        dueDate: 'Jan 5, 2026',
        locked: false,
        completed: false
      },
      {
        id: 'assign-3',
        title: 'NLP Sentiment Analysis Project',
        description: 'Build a sentiment classifier using BERT or transformers',
        difficulty: 'Advanced',
        estimatedTime: '10-12 hours',
        points: 150,
        dueDate: 'Jan 10, 2026',
        locked: true,
        completed: false
      }
    ],
    externalLinks: [
      {
        id: 'link-1',
        title: 'Scikit-learn Official Documentation',
        description: 'Complete reference for machine learning algorithms',
        category: 'Documentation',
        icon: 'docs',
        visits: 1234
      },
      {
        id: 'link-2',
        title: 'TensorFlow Tutorials',
        description: 'Step-by-step guides for deep learning with TensorFlow',
        category: 'Tutorial',
        icon: 'tutorial',
        visits: 2156
      },
      {
        id: 'link-3',
        title: 'Kaggle ML Competitions',
        description: 'Practice your skills with real-world datasets',
        category: 'Practice',
        icon: 'practice',
        visits: 3421
      },
      {
        id: 'link-4',
        title: 'Papers With Code',
        description: 'Latest ML research papers with implementation',
        category: 'Research',
        icon: 'research',
        visits: 987
      },
      {
        id: 'link-5',
        title: 'Google Colab',
        description: 'Free cloud-based Jupyter notebook environment',
        category: 'Tools',
        icon: 'tool',
        visits: 4532
      }
    ],
    recordings: [
      {
        id: 'rec-1',
        title: 'Introduction to Machine Learning - Full Lecture',
        description: 'Complete 2-hour session covering ML fundamentals',
        duration: '2:15:30',
        views: 5847,
        uploadDate: '3 days ago',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=500&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
        locked: false,
        rating: 4.9
      },
      {
        id: 'rec-2',
        title: 'Neural Networks Deep Dive Workshop',
        description: 'Hands-on session building neural networks from scratch',
        duration: '3:45:20',
        views: 4231,
        uploadDate: '5 days ago',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
        locked: false,
        rating: 4.8
      },
      {
        id: 'rec-3',
        title: 'Computer Vision with OpenCV',
        description: 'Live coding session on image processing techniques',
        duration: '2:30:15',
        views: 3156,
        uploadDate: '1 week ago',
        thumbnail: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=500&fit=crop',
        videoUrl: 'https://www.youtube.com/watch?v=P4Z8_qe2Cu0',
        locked: true,
        rating: 4.7
      }
    ]
  };

  const handleDownload = (item) => {
    // 🔒 Demo: Locked content
    if (!isPaid && item.locked) {
      toast.warning(
        "🔒 Demo Mode: This material is locked. Please enroll to unlock downloads.",
        {
          position: "top-right",
          autoClose: 3500,
        }
      );

      // Scroll to enroll section (demo UX)
      document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // ✅ Demo: Successful download
    setDownloadedItems((prev) => [...prev, item.id]);

    toast.success(
      "⬇️ Demo Download Started! Your file is being prepared.",
      {
        position: "top-right",
        autoClose: 2500,
      }
    );

    console.log("Demo downloading:", item.title);
  };


  const handleExternalLink = (url) => {
    if (!isPaid) {
      toast.warning(
        "Demo Mode: Please enroll in the course to access external resources.",
        {
          position: "top-right",
          autoClose: 3500,
        }
      );

      // Redirect to register after short delay
      setTimeout(() => {
        navigate("/register");
      }, 1500);

      return;
    }

    // Optional: Demo message even for paid users
    toast.info(
      "External resource access is available after enrollment.",
      {
        position: "top-right",
        autoClose: 2500,
      }
    );
  };

  const handleWatchRecording = (recording) => {
    if (!isPaid && recording.locked) {
      alert('Please purchase this course to watch this recording');
      window.location.href = '/register';
      return;
    }
    window.open(recording.videoUrl, '_blank');
  };

  const PDFCard = ({ item, index }) => {
    const isDownloaded = downloadedItems.includes(item.id);

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'animate-slideUp' : 'opacity-0'
          }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-4 rounded-xl ${item.locked ? 'bg-gray-100' : 'bg-red-50'}`}>
              <FileText className={`w-8 h-8 ${item.locked ? 'text-gray-400' : 'text-red-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                {item.locked && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <File className="w-3.5 h-3.5" />
                  {item.size}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {item.pages} pages
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {item.downloads.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  {item.rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">{item.uploadDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownload(item)}
            disabled={!isPaid && item.locked}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isDownloaded
              ? 'bg-green-100 text-green-700 cursor-default'
              : isPaid || !item.locked
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isDownloaded ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Downloaded
              </>
            ) : isPaid || !item.locked ? (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Purchase to Download
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const AssignmentCard = ({ item, index }) => {
    const difficultyColors = {
      'Beginner': 'bg-green-50 text-green-700 border-green-200',
      'Intermediate': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Advanced': 'bg-red-50 text-red-700 border-red-200'
    };

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg border-2 ${item.locked ? 'border-gray-200' : 'border-indigo-200'} overflow-hidden hover:shadow-2xl transition-all duration-500 ${isVisible ? 'animate-slideUp' : 'opacity-0'
          }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900 flex-1">{item.title}</h3>
            {item.locked && <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${difficultyColors[item.difficulty]}`}>
              {item.difficulty}
            </span>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
              {item.points} points
            </span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Estimated: {item.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Due: {item.dueDate}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isPaid && item.locked) {
                toast.warning(
                  "🔒 Demo Mode: Please enroll in the course to access assignments.",
                  {
                    position: "top-right",
                    autoClose: 3500,
                  }
                );

                // Optional redirect after toast
                setTimeout(() => {
                  window.location.href = "/register";
                }, 1500);

              } else {
                toast.info(
                  "Demo Mode: Assignment access will be available after enrollment.",
                  {
                    position: "top-right",
                    autoClose: 3000,
                  }
                );
              }
            }}
            disabled={!isPaid && item.locked}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${item.completed
              ? 'bg-green-100 text-green-700 cursor-default'
              : isPaid || !item.locked
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {item.completed ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Completed
              </>
            ) : isPaid || !item.locked ? (
              <>
                <FileText className="w-4 h-4 " />
                Start Assignment
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Purchase Required
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const ExternalLinkCard = ({ item, index }) => {
    const iconMap = {
      docs: BookOpen,
      tutorial: Code,
      practice: TrendingUp,
      research: FileText,
      tool: Archive
    };
    const Icon = iconMap[item.icon] || Link2;

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer ${isVisible ? 'animate-slideUp' : 'opacity-0'
          }`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => handleExternalLink(item.url)}
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="w-3.5 h-3.5" />
                  {item.visits.toLocaleString()} visits
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <ExternalLink className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    );
  };

  const RecordingCard = ({ item, index }) => {
    return (
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible ? 'animate-slideUp' : 'opacity-0'
          }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative h-48 overflow-hidden bg-gray-900 cursor-pointer" onClick={() => handleWatchRecording(item)}>
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            loading="lazy"
          />

          {item.locked && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Locked
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            {item.duration}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {item.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {item.rating}
            </span>
            <span className="text-xs">{item.uploadDate}</span>
          </div>

          <button
            onClick={() => handleWatchRecording(item)}
            disabled={!isPaid && item.locked}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isPaid || !item.locked
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black shadow-md hover:shadow-lg cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isPaid || !item.locked ? (
              <>
                <Video className="w-4 h-4" />
                Watch Recording
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Purchase to Watch
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const tabs = [
    { key: 'all', label: 'All Resources', count: resourcesData.pdfs.length + resourcesData.assignments.length + resourcesData.externalLinks.length + resourcesData.recordings.length },
    { key: 'pdfs', label: 'PDF Notes', count: resourcesData.pdfs.length },
    { key: 'assignments', label: 'Assignments', count: resourcesData.assignments.length },
    { key: 'links', label: 'External Links', count: resourcesData.externalLinks.length },
    { key: 'recordings', label: 'Recordings', count: resourcesData.recordings.length }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 md:mb-12 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
            <Folder className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Resources & Materials
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Resources</span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Access comprehensive materials to enhance your learning experience
          </p>
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 cursor-pointer ${activeTab === tab.key
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
            >
              {tab.label} <span className="ml-1 md:ml-2 text-xs md:text-sm opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {(activeTab === 'all' || activeTab === 'pdfs') && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-7 h-7 text-red-600" />
              PDF Notes & Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData.pdfs.map((item, index) => (
                <PDFCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'assignments') && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-indigo-600" />
              Assignments & Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData.assignments.map((item, index) => (
                <AssignmentCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'links') && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Link2 className="w-7 h-7 text-blue-600" />
              External Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourcesData.externalLinks.map((item, index) => (
                <ExternalLinkCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'recordings') && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Video className="w-7 h-7 text-gray-600" />
              Recorded Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData.recordings.map((item, index) => (
                <RecordingCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => setIsPaid(!isPaid)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Demo: Toggle Payment ({isPaid ? 'Paid ✓' : 'Not Paid ✗'})
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResourcesMaterialsSection;