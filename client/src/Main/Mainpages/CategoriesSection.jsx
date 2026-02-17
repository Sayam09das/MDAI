import React, { useState, useEffect, useRef } from 'react';
import { 
  Code, Palette, Briefcase, TrendingUp, GraduationCap, Trophy, 
  Brain, Cpu, Camera, Music, Globe, Sparkles, ArrowRight,
  Filter, Search, X, BookOpen
} from 'lucide-react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const CategoriesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const searchRef = useRef(null);

  // Add refs to array
  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
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

    return () => observer.disconnect();
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation with scrub
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play reverse play reverse"
          }
        }
      );

      // Search bar animation
      gsap.fromTo(searchRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: searchRef.current,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
            toggleActions: "play reverse play reverse"
          }
        }
      );

      // Category cards with 3D effect
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.8, rotateX: 45 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 60%",
              scrub: 1.5,
              toggleActions: "play reverse play reverse"
            }
          }
        );

        // Parallax effect
        gsap.fromTo(card,
          { y: 0 },
          {
            y: -10,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  const categories = [
    {
      id: 1,
      name: 'Programming',
      icon: Code,
      count: 156,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
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
  };

  const CategoryCard = ({ category, index }) => {
    const Icon = category.icon;
    const isSelected = selectedCategory === category.id;

    return (
      <div
        onClick={() => handleCategoryClick(category)}
        className={`category-card ${isVisible ? 'fade-in-up' : ''}`}
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div
          className={`relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            isSelected 
              ? 'border-indigo-500 shadow-lg scale-[1.02]' 
              : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
          }`}
        >
          <div className={`${category.bgColor} p-4 sm:p-6 transition-colors duration-300`}>
            {/* Icon */}
            <div className="mb-3 sm:mb-4">
              <div className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.color} shadow-md transition-transform duration-300 hover:scale-105`}>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Category Info */}
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                {category.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                {category.description}
              </p>
              
              {/* Course Count */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{category.count} Courses</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {category.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white text-xs font-medium text-gray-700 rounded-lg border border-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Button */}
            <button
              className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {isSelected ? 'Selected' : 'Explore Courses'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Selection Badge */}
            {isSelected && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const totalCourses = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .category-card {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span className="text-xs sm:text-sm font-semibold text-indigo-600 tracking-wide uppercase">
              Browse Categories
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Explore By{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Category
            </span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Discover courses across {categories.length} categories with {totalCourses}+ courses to choose from
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative px-4">
            <Search className="absolute left-7 sm:left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400 shadow-sm focus:shadow-md transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-7 sm:right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Category */}
        {selectedCategory && (
          <div className={`mb-6 sm:mb-8 text-center ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg">
              <span className="text-sm sm:text-base font-semibold">
                Selected: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-0.5 sm:p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">Try adjusting your search terms</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white text-sm sm:text-base rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* CTA */}
        <div className={`mt-12 sm:mt-16 md:mt-20 text-center ${isVisible ? 'fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-indigo-100">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              We're constantly adding new categories and courses. Request a topic and we'll notify you when it's available!
            </p>
            <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Request a Category
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;