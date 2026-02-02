import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentAttendance = ({ courseId, studentId }) => {
    const [student, setStudent] = useState(null);
    const [course, setCourse] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/teacher/attendance/${courseId}/student/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                setStudent(data.student);
                setCourse(data.course);
                setAttendance(data.attendanceRecords);
                setStats(data.stats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [courseId, studentId]);

    if (loading) return <PageMessage text="Loading attendance..." />;
    if (error) return <PageMessage text={error} error />;

    return (
        <div style={page}>
            <h1 style={title}>Student Attendance</h1>

            {/* COURSE INFO */}
            <div style={card}>
                <h3>Course</h3>
                <p>{course?.title}</p>
            </div>

            {/* STUDENT INFO */}
            <div style={{ ...card, display: "flex", gap: 16 }}>
                <img
                    src={student?.profileImage?.url}
                    alt={student?.fullName}
                    style={avatar}
                />
                <div>
                    <h3>{student?.fullName}</h3>
                    <p>{student?.email}</p>
                    <p>{student?.phone}</p>
                </div>
            </div>

            {/* STATS */}
            <div style={statsGrid}>
                <Stat label="Total Days" value={stats?.totalDays} />
                <Stat label="Present" value={stats?.present} color="green" />
                <Stat label="Absent" value={stats?.absent} color="red" />
                <Stat label="Late" value={stats?.late} color="orange" />
                <Stat
                    label="Attendance %"
                    value={`${stats?.attendancePercentage}%`}
                    color="blue"
                />
            </div>

            {/* ATTENDANCE TABLE */}
            <div style={card}>
                <h3>Attendance Records</h3>

                <table style={table}>
                    <thead>
                        <tr>
                            <th style={th}>Date</th>
                            <th style={th}>Status</th>
                            <th style={th}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={empty}>
                                    No attendance records
                                </td>
                            </tr>
                        ) : (
                            attendance.map((a, i) => (
                                <tr key={i}>
                                    <td style={td}>
                                        {new Date(a.date).toLocaleDateString()}
                                    </td>
                                    <td
                                        style={{
                                            ...td,
                                            fontWeight: 600,
                                            color:
                                                a.status === "PRESENT"
                                                    ? "green"
                                                    : a.status === "ABSENT"
                                                        ? "red"
                                                        : "orange",
                                        }}
                                    >
                                        {a.status}
                                    </td>
                                    <td style={td}>{a.remarks || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ----------------- UI HELPERS ----------------- */

const PageMessage = ({ text, error }) => (
    <div style={{ padding: 40, textAlign: "center", color: error ? "red" : "#333" }}>
        {text}
    </div>
);

const Stat = ({ label, value, color }) => (
    <div style={statCard}>
        <p>{label}</p>
        <h2 style={{ color }}>{value}</h2>
    </div>
);

/* ----------------- STYLES ----------------- */

const page = {
    padding: 24,
    maxWidth: 1100,
    margin: "auto",
    fontFamily: "sans-serif",
};

const title = {
    marginBottom: 20,
};

const card = {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const avatar = {
    width: 90,
    height: 90,
    borderRadius: "50%",
    objectFit: "cover",
};

const statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 20,
};

const statCard = {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
};

const th = {
    textAlign: "left",
    padding: 10,
    borderBottom: "2px solid #ddd",
};

const td = {
    padding: 10,
    borderBottom: "1px solid #eee",
};

const empty = {
    padding: 20,
    textAlign: "center",
};

export default StudentAttendance;
