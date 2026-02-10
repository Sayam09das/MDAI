import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    X,
    FileText,
    Image,
    File,
    Save,
    Trash2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditAssignment = () => {
    const navigate = useNavigate();
    const { assignmentId } = useParams();
    const token = localStorage.getItem("token");

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchingAssignment, setFetchingAssignment] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructions: "",
        course: "",
        dueDate: "",
        maxMarks: 100,
        submissionType: "file",
        allowedFileTypes: [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
        maxFileSize: 10,
        reminderDaysBeforeDue: 1,
    });

    const [existingAttachments, setExistingAttachments] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchAssignment();
    }, [assignmentId]);

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/courses/teacher`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchAssignment = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) {
                const assignment = data.assignment;
                
                const dueDate = new Date(assignment.dueDate);
                const formattedDueDate = dueDate.toISOString().slice(0, 16);

                setFormData({
                    title: assignment.title,
                    description: assignment.description,
                    instructions: assignment.instructions || "",
                    course: assignment.course._id,
                    dueDate: formattedDueDate,
                    maxMarks: assignment.maxMarks,
                    submissionType: assignment.submissionType,
                    allowedFileTypes: assignment.allowedFileTypes || [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
                    maxFileSize: assignment.maxFileSize,
                    reminderDaysBeforeDue: assignment.reminderDaysBeforeDue || 1,
                });

                setExistingAttachments(assignment.attachments || []);
            }
        } catch (error) {
            console.error("Error fetching assignment:", error);
        } finally {
            setFetchingAssignment(false);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles((prev) => [...prev, ...files]);
    };

    const removeNewFile = (index) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingAttachment = async (index) => {
        const attachment = existingAttachments[index];
        
        if (window.confirm("Are you sure you want to delete this attachment?")) {
            try {
                const res = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}/attachments/${attachment.public_id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (res.ok) {
                    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
                }
            } catch (error) {
                console.error("Error deleting attachment:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.course) {
            alert("Please select a course");
            return;
        }

        setSaving(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("instructions", formData.instructions);
            formDataToSend.append("course", formData.course);
            formDataToSend.append("dueDate", formData.dueDate);
            formDataToSend.append("maxMarks", formData.maxMarks);
            formDataToSend.append("submissionType", formData.submissionType);
            formDataToSend.append("allowedFileTypes", JSON.stringify(formData.allowedFileTypes));
            formDataToSend.append("maxFileSize", formData.maxFileSize);
            formDataToSend.append("reminderDaysBeforeDue", formData.reminderDaysBeforeDue);

            newFiles.forEach((file) => {
                formDataToSend.append("attachments", file);
            });

            const res = await fetch(`${BACKEND_URL}/api/assignments/${assignmentId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await res.json();

            if (data.success) {
                alert("Assignment updated successfully!");
                navigate("/teacher-dashboard/assignments");
            } else {
                alert(data.message || "Failed to update assignment");
            }
        } catch (error) {
            console.error("Error updating assignment:", error);
            alert("Failed to update assignment");
        } finally {
            setSaving(false);
        }
    };

    const getFileIcon = (file) => {
        const type = file.type?.split("/")[0] || file.format;
        if (type === "image") return <Image className="w-5 h-5 text-blue-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 MB";
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    if (loading || fetchingAssignment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate("/teacher-dashboard/assignments")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Assignments
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Edit Assignment
                    </h1>
                    <p className="text-gray-600">Update the assignment details below</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
                >
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Course <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                <option value="">Choose a course...</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assignment Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Weekly Reading Assignment"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Brief description of the assignment..."
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Detailed Instructions
                            </label>
                            <textarea
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                placeholder="Detailed instructions for students..."
                                rows="5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Marks <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="maxMarks"
                                    value={formData.maxMarks}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Submission Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {["file", "text", "both"].map((type) => (
                                    <label
                                        key={type}
                                        className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            formData.submissionType === type
                                                ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="submissionType"
                                            value={type}
                                            checked={formData.submissionType === type}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <FileText className="w-5 h-5" />
                                        <span className="capitalize">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {existingAttachments.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Attachments
                                </label>
                                <div className="space-y-2">
                                    {existingAttachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(file)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                                        {file.originalName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingAttachment(index)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add New Attachments (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-600">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB each)
                                    </p>
                                </label>
                            </div>

                            {newFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {newFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(file)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewFile(index)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max File Size (MB)
                                </label>
                                <input
                                    type="number"
                                    name="maxFileSize"
                                    value={formData.maxFileSize}
                                    onChange={handleChange}
                                    min="1"
                                    max="50"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reminder Days Before Due
                                </label>
                                <input
                                    type="number"
                                    name="reminderDaysBeforeDue"
                                    value={formData.reminderDaysBeforeDue}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate("/teacher-dashboard/assignments")}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default EditAssignment;

