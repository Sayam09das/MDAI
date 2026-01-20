import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const teacherName = localStorage.getItem("teacherName");
  const token = localStorage.getItem("token");

  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseTitle: "",
    driveLink: "",
    resourceType: "pdf",
  });

  const fetchResources = async () => {
    const res = await fetch(
      `${BACKEND_URL}/api/resource/teacher?teacherName=${teacherName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setResources(data || []);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    fd.append("teacherName", teacherName);
    if (thumbnail) fd.append("thumbnail", thumbnail);

    const url = editingId
      ? `${BACKEND_URL}/api/resource/${editingId}`
      : `${BACKEND_URL}/api/resource`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    setShowForm(false);
    setEditingId(null);
    setThumbnail(null);
    fetchResources();
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      title: r.title,
      description: r.description,
      courseTitle: r.courseTitle,
      driveLink: r.driveLink,
      resourceType: r.resourceType,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await fetch(`${BACKEND_URL}/api/resource/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchResources();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Teacher Resources</h2>
      <button onClick={() => setShowForm(true)}>➕ Add</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
          <input name="courseTitle" placeholder="Course" onChange={handleChange} required />
          <input name="driveLink" placeholder="Drive Link" onChange={handleChange} required />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required={!editingId}
          />

          <select name="resourceType" onChange={handleChange}>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="slides">Slides</option>
          </select>

          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      {resources.map((r) => (
        <div key={r._id} style={{ border: "1px solid #ccc", marginTop: 10 }}>
          <img src={r.thumbnail?.url} width="100%" />
          <h4>{r.title}</h4>
          <button onClick={() => handleEdit(r)}>Edit</button>
          <button onClick={() => handleDelete(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TeacherResources;
