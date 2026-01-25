import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    MoreVertical,
    CheckSquare,
    Square,
    Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherList = () => {
    const navigate = useNavigate();

    /* ================= AUTH HEADER ================= */
    const getAuthHeaders = () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin/login");
            return {};
        }
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    /* ================= STATE ================= */
    const [teachers, setTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("courses");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /* ================= FETCH TEACHERS ================= */
    const fetchTeachers = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(
                `${BASE_URL}/api/teacher`,
                getAuthHeaders()
            );

            setTeachers(
                res.data.map((t) => ({
                    id: t._id,
                    name: t.fullName,
                    email: t.email,
                    status: t.isSuspended ? "suspended" : "active",
                    avatar: t.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join(""),
                    courses: t.courseCount,
                    students: 0,
                    rating: 0,
                    joined: t.createdAt,
                }))
            );
        } catch {
            toast.error("Failed to load teachers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    /* ================= FILTER + SORT ================= */
    const filteredAndSortedTeachers = useMemo(() => {
        let result = [...teachers];

        if (searchQuery) {
            result = result.filter(
                (t) =>
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterStatus !== "all") {
            result = result.filter((t) => t.status === filterStatus);
        }

        result.sort((a, b) => {
            if (sortBy === "courses") return b.courses - a.courses;
            if (sortBy === "joined")
                return new Date(b.joined) - new Date(a.joined);
            return 0;
        });

        return result;
    }, [teachers, searchQuery, filterStatus, sortBy]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredAndSortedTeachers.length / rowsPerPage);
    const paginatedTeachers = filteredAndSortedTeachers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    /* ================= HELPERS ================= */
    const toggleSelectTeacher = (id) => {
        setSelectedTeachers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    /* ================= UI ================= */
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <ToastContainer />

            {/* Search + Filter */}
            <div className="bg-white p-4 rounded-lg border mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        className="w-full pl-9 pr-3 py-2 border rounded-lg"
                        placeholder="Search teachers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border px-3 py-2 rounded-lg"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border overflow-hidden">
                {isLoading ? (
                    <p className="p-6 text-center">Loading...</p>
                ) : paginatedTeachers.length === 0 ? (
                    <p className="p-6 text-center">No teachers found</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3"></th>
                                <th className="p-3 text-left">Teacher</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Courses</th>
                                <th className="p-3 text-left">Joined</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTeachers.map((t) => (
                                <tr key={t.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">
                                        <button onClick={() => toggleSelectTeacher(t.id)}>
                                            {selectedTeachers.includes(t.id) ? (
                                                <CheckSquare className="w-4 h-4 text-indigo-600" />
                                            ) : (
                                                <Square className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold">
                                            {t.avatar}
                                        </div>
                                        {t.name}
                                    </td>
                                    <td className="p-3">{t.email}</td>
                                    <td className="p-3 font-medium">{t.courses}</td>
                                    <td className="p-3">{formatDate(t.joined)}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${t.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TeacherList;
