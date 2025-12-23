import React, { useState, useEffect, useRef } from 'react';
import { 
  Code, Palette, Briefcase, TrendingUp, GraduationCap, Trophy, 
  Brain, Cpu, Camera, Music, Globe, BookOpen, Sparkles, ArrowRight,
  Filter, Search, X
} from 'lucide-react';

const CategoriesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const categories = [
    {
      id: 1,
      name: 'Programming',
      icon: Code,
      count: 156,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      description: 'Web Dev, Mobile Apps, Backend',
      tags: ['Python', 'JavaScript', 'Java', 'C++']
    },
    {
      id: 2,
      name: 'Design',
      icon: Palette,
      count: 89,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100',
      description: 'UI/UX, Graphics, Motion Design',
      tags: ['Figma', 'Photoshop', 'Illustrator']
    },
    {
      id: 3,
      name: 'Business',
      icon: Briefcase,
      count: 124,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100',
      description: 'Management, Strategy, Finance',
      tags: ['MBA', 'Entrepreneurship', 'Finance']
    },
    {
      id: 4,
      name: 'Marketing',
      icon: TrendingUp,
      count: 98,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      description: 'Digital Marketing, SEO, Social Media',
      tags: ['SEO', 'Content', 'Analytics']
    },
    {
      id: 5,
      name: 'School Subjects',
      icon: GraduationCap,
      count: 210,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      description: 'Math, Science, Languages',
      tags: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: 6,
      name: 'Competitive Exams',
      icon: Trophy,
      count: 145,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
      description: 'JEE, NEET, UPSC, CAT',
      tags: ['JEE', 'NEET', 'UPSC', 'CAT']
    },
    {
      id: 7,
      name: 'Data Science',
      icon: Brain,
      count: 132,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      description: 'ML, AI, Analytics, Statistics',
      tags: ['Machine Learning', 'AI', 'Big Data']
    },
    {
      id: 8,
      name: 'Technology',
      icon: Cpu,
      count: 167,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100',
      description: 'Cloud, DevOps, Cybersecurity',
      tags: ['AWS', 'Docker', 'Security']
    },
    {
      id: 9,
      name: 'Photography',
      icon: Camera,
      count: 76,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      hoverColor: 'hover:bg-violet-100',
      description: 'Portrait, Landscape, Commercial',
      tags: ['DSLR', 'Editing', 'Lighting']
    },
    {
      id: 10,
      name: 'Music',
      icon: Music,
      count: 84,
      color: 'from-fuchsia-500 to-pink-500',
      bgColor: 'bg-fuchsia-50',
      hoverColor: 'hover:bg-fuchsia-100',
      description: 'Theory, Production, Instruments',
      tags: ['Guitar', 'Piano', 'Production']
    },
    {
      id: 11,
      name: 'Languages',
      icon: Globe,
      count: 112,
      color: 'from-lime-500 to-green-500',
      bgColor: 'bg-lime-50',
      hoverColor: 'hover:bg-lime-100',
      description: 'English, Spanish, French, German',
      tags: ['English', 'Spanish', 'Mandarin']
    },
    {
      id: 12,
      name: 'Personal Development',
      icon: Sparkles,
      count: 93,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100',
      description: 'Leadership, Communication, Productivity',
      tags: ['Leadership', 'Productivity', 'Mindfulness']
    }
  ];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id === selectedCategory ? null : category.id);
    // In production, this would filter courses
    console.log('Selected category:', category.name);
    // window.location.href = `#courses?category=${category.id}`;
  };

  const CategoryCard = ({ category, index }) => {
    const Icon = category.icon;
    const isSelected = selectedCategory === category.id;
    const isHovered = hoveredCategory === category.id;

    return (
      <div
        onClick={() => handleCategoryClick(category)}
        onMouseEnter={() => setHoveredCategory(category.id)}
        onMouseLeave={() => setHoveredCategory(null)}
        className={`group relative cursor-pointer ${
          isVisible ? 'animate-fadeInScale' : 'opacity-0'
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div
          className={`relative overflow-hidden rounded-2xl transition-all duration-500 transform ${
            isSelected 
              ? 'scale-105 shadow-2xl ring-4 ring-indigo-500 ring-offset-2' 
              : 'hover:scale-105 hover:shadow-xl shadow-md'
          }`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Card Content */}
          <div className={`relative ${category.bgColor} ${category.hoverColor} p-6 md:p-8 transition-all duration-300`}>
            {/* Icon Container */}
            <div className="mb-4">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} transform transition-all duration-500 ${
                isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
              } shadow-lg`}>
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Category Info */}
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                {category.name}
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">
                {category.description}
              </p>
              
              {/* Course Count Badge */}
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <BookOpen className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">{category.count} Courses</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {category.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white text-xs font-medium text-gray-700 rounded-lg shadow-sm border border-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Explore Button */}
            <button
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {isSelected ? 'Selected' : 'Explore Courses'}
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} />
            </button>

            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
          </div>
        </div>
      </div>
    );
  };

  const totalCourses = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out forwards;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-1/4 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className={`text-center mb-12 md:mb-16 ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
            <Filter className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Browse Categories
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore By{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Category
            </span>
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover courses across {categories.length} categories with {totalCourses}+ courses to choose from
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories, topics, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-900 placeholder-gray-400 shadow-lg focus:shadow-xl transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Category Info */}
        {selectedCategory && (
          <div className={`mb-8 text-center ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg animate-pulse-ring">
              <span className="font-semibold">
                Selected: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className={`mt-16 md:mt-20 text-center ${isVisible ? 'animate-fadeInScale' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border-2 border-indigo-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We're constantly adding new categories and courses. Request a topic and we'll notify you when it's available!
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105">
              Request a Category
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;