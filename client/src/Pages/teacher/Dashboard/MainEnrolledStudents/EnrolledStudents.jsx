import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const EnrolledStudents = () => {
    const [students, setStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submittingKey, setSubmittingKey] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/teacher/students`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
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

    const markAttendance = async (courseId, student, status) => {
        const key = `${courseId}_${student._id}`;
        setSubmittingKey(key);

        const remarks =
            status === "PRESENT"
                ? "On time"
                : status === "LATE"
                    ? "Late entry"
                    : "Absent";

        try {
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
                                studentId: student._id,
                                status,
                                remarks,
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            const record = data.attendance.records[0];

            // ✅ Update UI state immediately
            setAttendanceMap((prev) => ({
                ...prev,
                [key]: {
                    status: record.status,
                    markedAt: record.markedAt,
                    remarks: record.remarks,
                },
            }));
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmittingKey(null);
        }
    };

    if (loading) return <p>Loading enrolled students...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Enrolled Students ({students.length})</h2>

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

                            {student.enrolledCourses.map((course) => {
                                const key = `${course.courseId}_${student._id}`;
                                const attendance = attendanceMap[key];

                                return (
                                    <div key={course.courseId} style={courseBox}>
                                        <strong>{course.courseTitle}</strong>

                                        {/* ✅ IF ALREADY MARKED */}
                                        {attendance ? (
                                            <div style={{ marginTop: 8 }}>
                                                <span
                                                    style={{
                                                        fontWeight: 700,
                                                        color:
                                                            attendance.status === "PRESENT"
                                                                ? "green"
                                                                : attendance.status === "ABSENT"
                                                                    ? "red"
                                                                    : "orange",
                                                    }}
                                                >
                                                    {attendance.status}
                                                </span>
                                                <p style={{ fontSize: 12 }}>
                                                    {attendance.remarks} •{" "}
                                                    {new Date(attendance.markedAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={btnGroup}>
                                                <button
                                                    disabled={submittingKey === key}
                                                    style={{ ...btn, background: "#e8f5e9", color: "green" }}
                                                    onClick={() =>
                                                        markAttendance(course.courseId, student, "PRESENT")
                                                    }
                                                >
                                                    Present
                                                </button>

                                                <button
                                                    disabled={submittingKey === key}
                                                    style={{ ...btn, background: "#ffebee", color: "red" }}
                                                    onClick={() =>
                                                        markAttendance(course.courseId, student, "ABSENT")
                                                    }
                                                >
                                                    Absent
                                                </button>

                                                <button
                                                    disabled={submittingKey === key}
                                                    style={{
                                                        ...btn,
                                                        background: "#fff8e1",
                                                        color: "orange",
                                                    }}
                                                    onClick={() =>
                                                        markAttendance(course.courseId, student, "LATE")
                                                    }
                                                >
                                                    Not in time
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ---------------- STYLES ---------------- */

const card = {
    display: "flex",
    gap: 16,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
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
