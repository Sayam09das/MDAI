import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseTitle: "",
    teacherName: "",
    driveLink: "",
    resourceType: "pdf",
  });

  const [thumbnail, setThumbnail] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH TEACHER RESOURCES ================= */
  const fetchResources = async () => {
    if (!formData.teacherName) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}/api/resource/teacher?teacherName=${formData.teacherName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setResources(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE TEXT INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT (CREATE / UPDATE) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (thumbnail) {
      fd.append("thumbnail", thumbnail); // 🔥 FILE UPLOAD
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${BACKEND_URL}/api/resource/${editingId}`
        : `${BACKEND_URL}/api/resource`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ DO NOT SET Content-Type
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Failed");

      await fetchResources();
      setShowForm(false);
      setEditingId(null);
      setThumbnail(null);

      setFormData({
        title: "",
        description: "",
        courseTitle: "",
        teacherName: formData.teacherName,
        driveLink: "",
        resourceType: "pdf",
      });
    } catch (err) {
      alert("Failed to save resource");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    await fetch(`${BACKEND_URL}/api/resource/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchResources();
  };

  /* ================= EDIT ================= */
  const handleEdit = (r) => {
    setFormData({
      title: r.title,
      description: r.description,
      courseTitle: r.courseTitle,
      teacherName: r.teacherName,
      driveLink: r.driveLink,
      resourceType: r.resourceType,
    });
    setEditingId(r._id);
    setShowForm(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Teacher Resources</h2>

      <button onClick={() => setShowForm(true)}>➕ Add Resource</button>

      {/* FORM MODAL */}
      {showForm && (
        <div style={overlayStyle}>
          <form style={formStyle} onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit Resource" : "Add Resource"}</h3>

            <input name="title" placeholder="Title" onChange={handleChange} value={formData.title} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} required />
            <input name="courseTitle" placeholder="Course Title" onChange={handleChange} value={formData.courseTitle} required />
            <input name="teacherName" placeholder="Teacher Name" onChange={handleChange} value={formData.teacherName} required />
            <input name="driveLink" placeholder="Drive Link" onChange={handleChange} value={formData.driveLink} required />

            {/* 🔥 FILE INPUT */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required={!editingId}
            />

            <select name="resourceType" onChange={handleChange} value={formData.resourceType}>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="slides">Slides</option>
              <option value="notes">Notes</option>
            </select>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <p>No resources found</p>
      ) : (
        resources.map((r) => (
          <div key={r._id} style={cardStyle}>
            <img src={r.thumbnail} alt="" width="100%" />
            <h4>{r.title}</h4>
            <p>{r.courseTitle}</p>
            <button onClick={() => handleEdit(r)}>Edit</button>
            <button onClick={() => handleDelete(r._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  background: "#fff",
  padding: "20px",
  width: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginTop: "10px",
};

export default TeacherResources;
