import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, BookOpen, FileText, X, ArrowRight, Loader2 } from "lucide-react";
import { searchCourses, searchResources } from "../../../../lib/api/studentApi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";

    const [courses, setCourses] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [localQuery, setLocalQuery] = useState(query);

    useEffect(() => {
        if (query) {
            performSearch(query);
        }
    }, [query]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            // Search courses
            const coursesResult = await searchCourses(searchQuery, 20);
            if (coursesResult.success) {
                setCourses(coursesResult.courses || []);
            }

            // Search resources
            const resourcesResult = await searchResources(searchQuery, 20);
            if (Array.isArray(resourcesResult)) {
                setResources(resourcesResult);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        if (localQuery.trim()) {
            navigate(`/student-dashboard/search?q=${encodeURIComponent(localQuery.trim())}`);
        }
    };

    const clearSearch = () => {
        setLocalQuery("");
        navigate("/student-dashboard");
    };

    const filteredCourses = () => {
        if (activeTab === "all" || activeTab === "courses") return courses;
        return [];
    };

    const filteredResources = () => {
        if (activeTab === "all" || activeTab === "resources") return resources;
        return [];
    };

    const totalResults = courses.length + resources.length;

    return (
        <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Search</h1>
                <p className="text-gray-600 mt-1">
                    Find courses, resources, and more
                </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for courses, resources..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 text-base rounded-xl bg-white border border-gray-200 outline-none hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {localQuery && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                    <Search className="w-5 h-5" />
                </button>
            </form>

            {/* Query Display */}
            {query && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">"{query}"</span>
                        <span className="text-sm text-gray-500">
                            ({totalResults} results)
                        </span>
                    </div>
                    <button
                        onClick={clearSearch}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}

            {/* Tabs */}
            {totalResults > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[
                        { key: "all", label: "All", icon: Search },
                        { key: "courses", label: "Courses", icon: BookOpen },
                        { key: "resources", label: "Resources", icon: FileText },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
                                ${activeTab === tab.key
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.key === "courses" && courses.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                                    {courses.length}
                                </span>
                            )}
                            {tab.key === "resources" && resources.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                                    {resources.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            )}

            {/* No Results */}
            {!loading && totalResults === 0 && query && (
                <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-4">
                        We couldn't find anything matching "{query}"
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={clearSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                </div>
            )}

            {/* Results */}
            {!loading && totalResults > 0 && (
                <div className="space-y-6">
                    {/* Courses */}
                    {filteredCourses().length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Courses
                            </h2>
                            <div className="grid gap-4">
                                {filteredCourses().map((course) => (
                                    <div
                                        key={course._id}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => navigate(`/student-dashboard/course/${course._id}`)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Thumbnail */}
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {course.thumbnail?.url ? (
                                                    <img
                                                        src={course.thumbnail.url}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                        <BookOpen className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {course.description}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                        {course.category}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                                                        {course.level}
                                                    </span>
                                                    {course.instructor && (
                                                        <span className="text-xs text-gray-500">
                                                            by {course.instructor.name || course.instructor.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    {filteredResources().length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                Resources
                            </h2>
                            <div className="grid gap-4">
                                {filteredResources().map((resource) => (
                                    <div
                                        key={resource._id}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => {
                                            if (resource.driveLink) {
                                                window.open(resource.driveLink, '_blank');
                                            } else if (resource.file?.url) {
                                                window.open(resource.file.url, '_blank');
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                {resource.fileType === "video" ? (
                                                    <BookOpen className="w-6 h-6 text-green-600" />
                                                ) : resource.fileType === "pdf" ? (
                                                    <FileText className="w-6 h-6 text-red-600" />
                                                ) : (
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                )}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {resource.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {resource.description}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase">
                                                        {resource.fileType}
                                                    </span>
                                                    {resource.courseTitle && (
                                                        <span className="text-xs text-gray-500">
                                                            Course: {resource.courseTitle}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* No Query State */}
            {!query && !loading && (
                <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
                    <p className="text-gray-500">
                        Enter a keyword to search for courses and resources
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;

