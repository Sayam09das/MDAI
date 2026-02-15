import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    BookOpen,
    Clock,
    Award,
    Globe,
    Tag,
    CheckCircle,
    Star,
    Users,
    TrendingUp,
    Sparkles,
    ArrowRight,
    Loader2,
    Search,
    Filter,
    Grid3x3,
    List
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AllCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");

    const navigate = useNavigate();

    /* ================= FETCH COURSES ================= */
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/courses`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch courses");
            }

            setCourses(data.courses);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= ENROLL ================= */
    const handleEnroll = async (courseId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/enrollments/${courseId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Enrollment failed");
            }

            toast.success("Redirecting to payment...");
            navigate(`/payment/${courseId}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Get unique categories
    const categories = ["all", ...new Set(courses.map(c => c.category))];

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || course.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Discover Your Path to Success</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            Explore Our Courses
                        </h1>
                        <p className="text-lg sm:text-xl text-indigo-100 mb-8">
                            Learn from industry experts and transform your career with our comprehensive courses
                        </p>
                        <div className="flex items-center justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>10,000+ Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                                <span>4.8 Average Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                <span>{courses.length}+ Courses</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-8 -mt-20 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 items-center">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer min-w-[150px]"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === "all" ? "All Categories" : cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-indigo-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list"
                                        ? "bg-white shadow-sm text-indigo-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of{" "}
                        <span className="font-semibold text-gray-900">{courses.length}</span> courses
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading amazing courses...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCourses.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                            <p className="text-gray-600">
                                {searchQuery || filterCategory !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No courses are currently available"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Courses Grid/List */}
                {!loading && filteredCourses.length > 0 && (
                    <div className={viewMode === "grid"
                        ? "grid sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8"
                        : "space-y-6"
                    }>
                        {filteredCourses.map((course) => (
                            <div
                                key={course._id}
                                className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                                    <img
                                        src={course.thumbnail?.url || "https://via.placeholder.com/600x400?text=Course"}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Overlay Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-700 shadow-lg">
                                            <Tag className="w-3 h-3" />
                                            {course.category}
                                        </span>
                                    </div>

                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                                            ${course.price}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-bold text-gray-900">4.8</span>
                                        <span className="text-xs text-gray-600">(234)</span>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    {/* Title */}
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {course.title}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-6 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Meta Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-1.5 bg-indigo-100 rounded-lg">
                                                <Clock className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Duration</p>
                                                <p className="font-semibold text-gray-900">{course.duration}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-1.5 bg-green-100 rounded-lg">
                                                <Award className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Level</p>
                                                <p className="font-semibold text-gray-900">{course.level}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                <Globe className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Language</p>
                                                <p className="font-semibold text-gray-900">{course.language}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-1.5 bg-purple-100 rounded-lg">
                                                <Users className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Students</p>
                                                <p className="font-semibold text-gray-900">2.4k</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    {course.requirements?.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-indigo-600" />
                                                Requirements
                                            </h3>
                                            <ul className="space-y-2">
                                                {course.requirements.slice(0, 2).map((req, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <div className="mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                                                        </div>
                                                        <span className="line-clamp-1">{req}</span>
                                                    </li>
                                                ))}
                                                {course.requirements.length > 2 && (
                                                    <li className="text-xs text-indigo-600 font-medium pl-4">
                                                        +{course.requirements.length - 2} more
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Learning Outcomes */}
                                    {course.learningOutcomes?.length > 0 && (
                                        <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                                What You'll Learn
                                            </h3>
                                            <ul className="space-y-2">
                                                {course.learningOutcomes.slice(0, 3).map((out, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span className="line-clamp-1">{out}</span>
                                                    </li>
                                                ))}
                                                {course.learningOutcomes.length > 3 && (
                                                    <li className="text-xs text-indigo-600 font-medium pl-6">
                                                        +{course.learningOutcomes.length - 3} more outcomes
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Enroll Button */}
                                    <button
                                        onClick={() => handleEnroll(course._id)}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
                                    >
                                        <span>Enroll Now</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCourse;