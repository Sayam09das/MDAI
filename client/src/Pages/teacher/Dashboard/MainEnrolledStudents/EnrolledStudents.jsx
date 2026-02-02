import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const EnrolledStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/students`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch students");
                }

                setStudents(data.students || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) {
        return <p>Loading enrolled students...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Enrolled Students ({students.length})</h2>

            {students.length === 0 ? (
                <p>No students enrolled yet.</p>
            ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                    {students.map((student) => (
                        <div
                            key={student._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "16px",
                                display: "flex",
                                gap: "16px",
                            }}
                        >
                            {/* Profile Image */}
                            <img
                                src={student.profileImage?.url}
                                alt={student.fullName}
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                            />

                            {/* Student Info */}
                            <div style={{ flex: 1 }}>
                                <h3>{student.fullName}</h3>
                                <p>Email: {student.email}</p>
                                <p>Phone: {student.phone}</p>

                                {/* Enrolled Courses */}
                                <strong>Courses:</strong>
                                <ul>
                                    {student.enrolledCourses.map((course) => (
                                        <li key={course.courseId}>
                                            {course.courseTitle} —{" "}
                                            <span
                                                style={{
                                                    color:
                                                        course.paymentStatus === "PAID"
                                                            ? "green"
                                                            : "orange",
                                                }}
                                            >
                                                {course.paymentStatus}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrolledStudents;
