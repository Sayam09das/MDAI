import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Search,
    MoreVertical,
    UserX,
    UserPlus,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherList = () => {
    const navigate = useNavigate();

    /* ================= AUTH ================= */
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
    const [loading, setLoading] = useState(false);

    /* ================= FETCH TEACHERS ================= */
    const fetchTeachers = async () => {
        try {
            setLoading(true);
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
                    joined: t.createdAt,
                    courseCount: t.courseCount,
                    courses: t.courses || [], // 👈 COURSE NAMES
                }))
            );
        } catch {
            toast.error("Failed to load teachers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    /* ================= ACTIONS ================= */
    const suspendTeacher = async (id) => {
        try {
            await axios.patch(
                `${BASE_URL}/api/teacher/${id}/suspend`,
                {},
                getAuthHeaders()
            );
            toast.warning("Teacher suspended");
            fetchTeachers();
        } catch {
            toast.error("Suspend failed");
        }
    };

    const resumeTeacher = async (id) => {
        try {
            await axios.patch(
                `${BASE_URL}/api/teacher/${id}/resume`,
                {},
                getAuthHeaders()
            );
            toast.success("Teacher activated");
            fetchTeachers();
        } catch {
            toast.error("Resume failed");
        }
    };

    /* ================= FILTER ================= */
    const filteredTeachers = useMemo(() => {
        return teachers.filter(
            (t) =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [teachers, searchQuery]);

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

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Teachers</h1>
                <button
                    onClick={() => navigate("/admin/dashboard/create/teacher")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    Add Teacher
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg border mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        className="w-full pl-9 pr-3 py-2 border rounded-lg"
                        placeholder="Search teacher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border overflow-x-auto">
                {loading ? (
                    <p className="p-6 text-center">Loading...</p>
                ) : filteredTeachers.length === 0 ? (
                    <p className="p-6 text-center">No teachers found</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Courses</th>
                                <th className="p-3 text-left">Course Names</th>
                                <th className="p-3 text-left">Joined</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeachers.map((t) => (
                                <tr key={t.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium">{t.name}</td>
                                    <td className="p-3">{t.email}</td>
                                    <td className="p-3 font-semibold">{t.courseCount}</td>

                                    {/* COURSE NAMES */}
                                    <td className="p-3 text-sm text-gray-600">
                                        {t.courses.length === 0
                                            ? "—"
                                            : t.courses.map((c, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block bg-indigo-50 text-indigo-700 px-2 py-1 rounded mr-1 mb-1"
                                                >
                                                    {c.title}
                                                </span>
                                            ))}
                                    </td>

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

                                    {/* ACTIONS */}
                                    <td className="p-3">
                                        {t.status === "active" ? (
                                            <button
                                                onClick={() => suspendTeacher(t.id)}
                                                className="flex items-center gap-1 text-red-600 hover:underline"
                                            >
                                                <UserX className="w-4 h-4" />
                                                Suspend
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => resumeTeacher(t.id)}
                                                className="flex items-center gap-1 text-emerald-600 hover:underline"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Resume
                                            </button>
                                        )}
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
