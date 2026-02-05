import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, BookOpen, Users, FileText, Calendar, X, ArrowRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState({
        courses: [],
        students: [],
        resources: []
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (query) {
            performSearch(query);
        }
    }, [query]);

    const performSearch = async (searchQuery) => {
        setLoading(true);
        try {
            // For now, we'll show a message that search is being implemented
            // In a real app, you'd make API calls to search courses, students, etc.
            console.log("Searching for:", searchQuery);
            
            // Simulated results for demo purposes
            setResults({
                courses: [
                    { id: 1, title: "Introduction to Python", category: "Programming" },
                    { id: 2, title: "Advanced JavaScript", category: "Programming" },
                    { id: 3, title: "Data Science Fundamentals", category: "Data Science" },
                ],
                students: [],
                resources: []
            });
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        navigate("/student-dashboard");
    };

    const filteredResults = () => {
        if (activeTab === "all") return results;
        return {
            courses: activeTab === "courses" ? results.courses : [],
            students: activeTab === "students" ? results.students : [],
            resources: activeTab === "resources" ? results.resources : []
        };
    };

    const totalResults = results.courses.length + results.students.length + results.resources.length;

    return (
        <div className="px-4 sm:px-5 md:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                <p className="text-gray-600 mt-1">
                    {query ? `Showing results for "${query}"` : "Enter a search query"}
                </p>
            </div>

            {/* Search Query Display */}
            {query && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{query}</span>
                        <span className="text-sm text-gray-500">
                            ({totalResults} results found)
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
                        { key: "students", label: "Students", icon: Users },
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
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* No Results */}
            {!loading && totalResults === 0 && query && (
                <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-4">
                        We couldn't find any matches for "{query}"
                    </p>
                    <button
                        onClick={clearSearch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Clear Search
                    </button>
                </div>
            )}

            {/* Results */}
            {!loading && totalResults > 0 && (
                <div className="space-y-6">
                    {/* Courses */}
                    {filteredResults().courses.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                Courses
                            </h2>
                            <div className="grid gap-3">
                                {filteredResults().courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => navigate(`/student-dashboard/course/${course.id}`)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{course.title}</h3>
                                                <p className="text-sm text-gray-500">{course.category}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Students */}
                    {filteredResults().students.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Users className="w-5 h-5 text-green-600" />
                                Students
                            </h2>
                            <div className="grid gap-3">
                                {filteredResults().students.map((student) => (
                                    <div
                                        key={student.id}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-sm font-medium">
                                                        {student.name?.charAt(0) || "S"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                                                    <p className="text-sm text-gray-500">{student.email}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    {filteredResults().resources.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                Resources
                            </h2>
                            <div className="grid gap-3">
                                {filteredResults().resources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                                                <p className="text-sm text-gray-500">{resource.type}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;

