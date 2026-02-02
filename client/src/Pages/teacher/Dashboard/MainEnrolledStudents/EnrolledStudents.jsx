import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const EnrolledStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/teacher/students`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                setStudents(data.students || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const markAttendance = async (courseId, studentId, status) => {
        try {
            setSubmitting(true);

            const res = await fetch(
                `${BACKEND_URL}/api/teacher/attendance/${courseId}/mark`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        records: [
                            {
                                studentId,
                                status,
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert(`Marked ${status} successfully`);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading enrolled students...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Enrolled Students ({students.length})</h2>

            {students.length === 0 ? (
                <p>No students enrolled yet.</p>
            ) : (
                <div style={{ display: "grid", gap: 16 }}>
                    {students.map((student) => (
                        <div key={student._id} style={card}>
                            <img
                                src={student.profileImage?.url}
                                alt={student.fullName}
                                style={avatar}
                            />

                            <div style={{ flex: 1 }}>
                                <h3>{student.fullName}</h3>
                                <p>{student.email}</p>
                                <p>{student.phone}</p>

                                {student.enrolledCourses.map((course) => (
                                    <div key={course.courseId} style={courseBox}>
                                        <strong>{course.courseTitle}</strong>

                                        <div style={btnGroup}>
                                            <button
                                                disabled={submitting}
                                                style={{ ...btn, background: "#e8f5e9", color: "green" }}
                                                onClick={() =>
                                                    markAttendance(
                                                        course.courseId,
                                                        student._id,
                                                        "PRESENT"
                                                    )
                                                }
                                            >
                                                Present
                                            </button>

                                            <button
                                                disabled={submitting}
                                                style={{ ...btn, background: "#ffebee", color: "red" }}
                                                onClick={() =>
                                                    markAttendance(
                                                        course.courseId,
                                                        student._id,
                                                        "ABSENT"
                                                    )
                                                }
                                            >
                                                Absent
                                            </button>

                                            <button
                                                disabled={submitting}
                                                style={{
                                                    ...btn,
                                                    background: "#fff8e1",
                                                    color: "orange",
                                                }}
                                                onClick={() =>
                                                    markAttendance(
                                                        course.courseId,
                                                        student._id,
                                                        "LATE"
                                                    )
                                                }
                                            >
                                                Not in time
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ---------------- STYLES ---------------- */

const card = {
    display: "flex",
    gap: 16,
    padding: 16,
    borderRadius: 8,
    border: "1px solid #ddd",
};

const avatar = {
    width: 70,
    height: 70,
    borderRadius: "50%",
    objectFit: "cover",
};

const courseBox = {
    marginTop: 10,
    padding: 10,
    border: "1px dashed #ccc",
    borderRadius: 6,
};

const btnGroup = {
    display: "flex",
    gap: 8,
    marginTop: 8,
};

const btn = {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    cursor: "pointer",
    fontWeight: 600,
};

export default EnrolledStudents;
