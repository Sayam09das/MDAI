import React, { useState, useEffect, useRef } from 'react';
import { 
  Star,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Award,
  CheckCircle,
  Filter,
  ChevronDown,
  Calendar,
  Verified,
  Heart,
  Flag,
  MoreVertical,
  Search
} from 'lucide-react';
const ReviewsRatings = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [likedReviews, setLikedReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);

  const ratingsData = {
    averageRating: 4.9,
    totalReviews: 12543,
    breakdown: [
      { stars: 5, count: 9842, percentage: 78 },
      { stars: 4, count: 1890, percentage: 15 },
      { stars: 3, count: 628, percentage: 5 },
      { stars: 2, count: 126, percentage: 1 },
      { stars: 1, count: 57, percentage: 1 },
    ],
  };

  const reviews = [
    {
      id: 1,
      author: 'Michael Chen',
      avatar: 'MC',
      rating: 5,
      date: '2 days ago',
      verified: true,
      helpful: 245,
      review: 'Absolutely amazing course! The instructor explains complex concepts in a very simple way. The hands-on projects helped me build a strong portfolio. I landed my dream job at Google after completing this course. Highly recommended!',
      courseTaken: 'Complete Web Development Bootcamp',
      badge: 'Verified Purchase',
      progress: 'Completed',
    },
    {
      id: 2,
      author: 'Sarah Williams',
      avatar: 'SW',
      rating: 5,
      date: '5 days ago',
      verified: true,
      helpful: 198,
      review: 'Best investment I made in my career! The course structure is excellent, and the instructor is always available to help. The live sessions were incredibly valuable. I can now build full-stack applications with confidence.',
      courseTaken: 'Advanced React & Next.js',
      badge: 'Verified Purchase',
      progress: 'Completed',
    },
    {
      id: 3,
      author: 'David Rodriguez',
      avatar: 'DR',
      rating: 5,
      date: '1 week ago',
      verified: true,
      helpful: 176,
      review: 'Outstanding quality! Every lesson is well-structured and packed with practical knowledge. The downloadable resources and code examples saved me tons of time. Worth every penny!',
      courseTaken: 'Full Stack JavaScript',
      badge: 'Verified Purchase',
      progress: 'In Progress',
    },
    {
      id: 4,
      author: 'Emily Thompson',
      avatar: 'ET',
      rating: 4,
      date: '2 weeks ago',
      verified: true,
      helpful: 134,
      review: 'Great course overall! The content is comprehensive and up-to-date. Only wish there were more advanced topics covered. The instructor responds quickly to questions which is a huge plus.',
      courseTaken: 'Python Programming',
      badge: 'Verified Purchase',
      progress: 'Completed',
    },
    {
      id: 5,
      author: 'James Wilson',
      avatar: 'JW',
      rating: 5,
      date: '3 weeks ago',
      verified: true,
      helpful: 156,
      review: 'This course exceeded my expectations! Clear explanations, real-world examples, and excellent support. I built three production-ready projects during the course. Couldn\'t ask for more!',
      courseTaken: 'Machine Learning Fundamentals',
      badge: 'Verified Purchase',
      progress: 'Completed',
    },
    {
      id: 6,
      author: 'Lisa Anderson',
      avatar: 'LA',
      rating: 5,
      date: '1 month ago',
      verified: true,
      helpful: 203,
      review: 'Phenomenal learning experience! The instructor is patient, knowledgeable, and passionate. The course helped me transition from a complete beginner to landing freelance projects. Thank you!',
      courseTaken: 'UI/UX Design Mastery',
      badge: 'Verified Purchase',
      progress: 'Completed',
    },
    {
      id: 7,
      author: 'Mark Johnson',
      avatar: 'MJ',
      rating: 3,
      date: '3 days ago',
      verified: true,
      helpful: 18,
      review: 'Good course with solid fundamentals but could use more practical projects and clearer explanations in some modules.',
      courseTaken: 'Frontend Basics',
      badge: 'Verified Purchase',
      progress: 'In Progress',
    },
    {
      id: 8,
      author: 'Aisha Khan',
      avatar: 'AK',
      rating: 2,
      date: '2 months ago',
      verified: true,
      helpful: 9,
      review: 'Content was okay but pacing felt rushed and several examples were not fully explained.',
      courseTaken: 'Data Structures',
      badge: 'Verified Purchase',
      progress: 'In Progress',
    },
    {
      id: 9,
      author: 'Carlos Mendes',
      avatar: 'CM',
      rating: 1,
      date: '3 months ago',
      verified: false,
      helpful: 3,
      review: 'Disappointed by the lack of depth. Slides felt outdated and exercises were too trivial for the advertised level.',
      courseTaken: 'Intro to Algorithms',
      badge: 'Refunded',
      progress: 'Incomplete',
    },
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

  const toggleLike = (reviewId) => {
    setLikedReviews(prev => 
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const filteredReviews = selectedFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(selectedFilter));

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 3);

  return (
    <div ref={sectionRef} className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 rounded-full mb-4">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-600">Student Reviews</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Reviews & <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Ratings</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our students say about their learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column - Rating Summary */}
          <div className={`lg:col-span-1 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl sticky top-24">
              
              {/* Overall Rating */}
              <div className="text-center mb-8">
                <div className="text-6xl font-extrabold text-gray-900 mb-2">
                  {ratingsData.averageRating}
                </div>
                <div className="flex justify-center items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < Math.floor(ratingsData.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-600 font-semibold">
                  {ratingsData.totalReviews.toLocaleString()} reviews
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-8">
                {ratingsData.breakdown.map((item) => (
                  <div key={item.stars} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-semibold text-gray-700">
                        {item.stars}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out"
                        style={{ 
                          width: isVisible ? `${item.percentage}%` : '0%',
                          transitionDelay: `${item.stars * 100}ms`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">100% Verified Reviews</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">98% Recommend</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-700">Highest Rated Course</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews List */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none px-6 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-semibold text-gray-700 cursor-pointer"
                >
                  <option value="all">All Stars</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Reviews Cards */}
            <div className="space-y-6">
              {displayedReviews.map((review, index) => {
                const isLiked = likedReviews.includes(review.id);
                
                return (
                  <div
                    key={review.id}
                    className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {review.avatar}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-gray-900">
                              {review.author}
                            </h4>
                            {review.verified && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>

                      <button className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Rating & Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {review.badge}
                      </span>
                      
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                        {review.progress}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {review.review}
                    </p>

                    {/* Course Taken */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">Course taken:</span>
                        <span className="text-indigo-600 font-semibold">
                          {review.courseTaken}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleLike(review.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          isLiked
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>Helpful</span>
                        <span className="font-bold">
                          ({review.helpful + (isLiked ? 1 : 0)})
                        </span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300">
                        <Flag className="w-4 h-4" />
                        <span className="text-sm font-semibold">Report</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {filteredReviews.length > 3 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <span>{showAll ? 'Show Less' : `Show All ${filteredReviews.length} Reviews`}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatings;