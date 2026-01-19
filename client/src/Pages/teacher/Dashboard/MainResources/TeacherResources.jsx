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
    thumbnail: "",
    driveLink: "",
    resourceType: "pdf",
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH TEACHER RESOURCES ================= */
  const fetchResources = async () => {
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

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${BACKEND_URL}/api/resource/${editingId}`
        : `${BACKEND_URL}/api/resource`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      // refresh + close form
      await fetchResources();
      setShowForm(false);
      setEditingId(null);

      // reset form
      setFormData({
        title: "",
        description: "",
        courseTitle: "",
        teacherName: formData.teacherName,
        thumbnail: "",
        driveLink: "",
        resourceType: "pdf",
      });
    } catch (err) {
      alert("Something went wrong");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await fetch(`${BACKEND_URL}/api/resource/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchResources();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (resource) => {
    setFormData(resource);
    setEditingId(resource._id);
    setShowForm(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Teacher Resources</h2>

      {/* ADD BUTTON */}
      <button onClick={() => setShowForm(true)}>➕ Add Resource</button>

      {/* FORM OVERLAY */}
      {showForm && (
        <div style={overlayStyle}>
          <form style={formStyle} onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit Resource" : "Add Resource"}</h3>

            <input name="title" placeholder="Title" onChange={handleChange} value={formData.title} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} required />
            <input name="courseTitle" placeholder="Course Title" onChange={handleChange} value={formData.courseTitle} required />
            <input name="teacherName" placeholder="Teacher Name" onChange={handleChange} value={formData.teacherName} required />
            <input name="thumbnail" placeholder="Thumbnail URL" onChange={handleChange} value={formData.thumbnail} required />
            <input name="driveLink" placeholder="Drive Link" onChange={handleChange} value={formData.driveLink} required />

            <select name="resourceType" onChange={handleChange} value={formData.resourceType}>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="slides">Slides</option>
              <option value="notes">Notes</option>
            </select>

            <div style={{ marginTop: "10px" }}>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* RESOURCE LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <p>No resources found</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {resources.map((r) => (
            <div key={r._id} style={cardStyle}>
              <img src={r.thumbnail} alt="" style={{ width: "100%" }} />
              <h4>{r.title}</h4>
              <p>{r.courseTitle}</p>
              <button onClick={() => handleEdit(r)}>Edit</button>
              <button onClick={() => handleDelete(r._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  background: "#fff",
  padding: "20px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
};

export default TeacherResources;
