import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    courseTitle: "",
    resourceType: "pdf",
    tags: "",
    pages: "",
    externalLink: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);

  /* ================= FETCH RESOURCES ================= */
  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/api/resource/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setResources(data.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= HANDLE CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        value && formData.append(key, value)
      );

      formData.append("thumbnail", thumbnail);
      if (file) formData.append("file", file);

      const res = await fetch(`${BACKEND_URL}/api/resource`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      // refresh list + close form
      await fetchResources();
      setShowForm(false);

      // reset form
      setForm({
        title: "",
        courseTitle: "",
        resourceType: "pdf",
        tags: "",
        pages: "",
        externalLink: "",
      });
      setThumbnail(null);
      setFile(null);
    } catch (err) {
      alert("Failed to create resource");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this resource?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${BACKEND_URL}/api/resource/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResources(resources.filter((r) => r._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h2>Teacher Resources</h2>

      {/* ADD BUTTON */}
      <button onClick={() => setShowForm(true)}>➕ Add Resource</button>

      {/* LOADING */}
      {loading && <p>Loading resources...</p>}

      {/* EMPTY */}
      {!loading && resources.length === 0 && (
        <p>No resources available</p>
      )}

      {/* RESOURCE LIST */}
      <div style={{ marginTop: "20px" }}>
        {resources.map((r) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{r.title}</h4>
            <p>{r.courseTitle}</p>
            <p>Type: {r.resourceType}</p>

            <button>Edit</button>
            <button onClick={() => handleDelete(r._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* OVERLAY FORM */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              padding: "20px",
              width: "400px",
            }}
          >
            <h3>Add Resource</h3>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <input
              placeholder="Course Title"
              value={form.courseTitle}
              onChange={(e) =>
                setForm({ ...form, courseTitle: e.target.value })
              }
              required
            />

            <select
              value={form.resourceType}
              onChange={(e) =>
                setForm({ ...form, resourceType: e.target.value })
              }
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="file">File</option>
              <option value="link">Link</option>
            </select>

            {form.resourceType === "pdf" && (
              <input
                type="number"
                placeholder="Pages"
                value={form.pages}
                onChange={(e) =>
                  setForm({ ...form, pages: e.target.value })
                }
              />
            )}

            {form.resourceType === "link" && (
              <input
                placeholder="External Link"
                value={form.externalLink}
                onChange={(e) =>
                  setForm({ ...form, externalLink: e.target.value })
                }
              />
            )}

            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) =>
                setForm({ ...form, tags: e.target.value })
              }
            />

            <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} required />
            {form.resourceType !== "link" && (
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Create"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherResources;
