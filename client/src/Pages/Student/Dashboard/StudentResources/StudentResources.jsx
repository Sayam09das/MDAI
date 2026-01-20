import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL RESOURCES ================= */
  const fetchResources = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/resource`);
      const data = await res.json();
      setResources(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading resources...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Student Resources</h2>

      {resources.length === 0 ? (
        <p>No resources available</p>
      ) : (
        <div style={gridStyle}>
          {resources.map((r) => (
            <div key={r._id} style={cardStyle}>
              <img
                src={r.thumbnail?.url}
                alt={r.title}
                style={imgStyle}
              />

              <h4>{r.title}</h4>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {r.description}
              </p>

              <p>
                <strong>Course:</strong> {r.courseTitle}
              </p>
              <p>
                <strong>Teacher:</strong> {r.teacherName}
              </p>

              <span style={badgeStyle}>{r.resourceType}</span>

              <a
                href={r.driveLink}
                target="_blank"
                rel="noreferrer"
                style={linkStyle}
              >
                📥 Open Resource
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "16px",
  marginTop: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "12px",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const imgStyle = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "6px",
};

const badgeStyle = {
  alignSelf: "flex-start",
  padding: "4px 8px",
  background: "#e3f2fd",
  color: "#1976d2",
  borderRadius: "4px",
  fontSize: "12px",
  textTransform: "uppercase",
};

const linkStyle = {
  marginTop: "auto",
  textDecoration: "none",
  background: "#1976d2",
  color: "#fff",
  padding: "8px",
  textAlign: "center",
  borderRadius: "4px",
};

export default StudentResources;
