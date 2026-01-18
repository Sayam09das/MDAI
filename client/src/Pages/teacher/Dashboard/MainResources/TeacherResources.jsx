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
    resourceType: "link",
    tags: "",
    externalLink: "",
    thumbnailUrl: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [file, setFile] = useState(null);

  /* ================= FETCH RESOURCES ================= */
  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/resource/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResources(data.resources || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= CREATE RESOURCE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      /* ========= LINK → JSON ========= */
      if (form.resourceType === "link" && !thumbnailFile) {
        const payload = {
          title: form.title,
          courseTitle: form.courseTitle,
          resourceType: "link",
          tags: form.tags.split(","),
          thumbnail: form.thumbnailUrl,
          externalLink: form.externalLink,
        };

        const res = await fetch(`${BACKEND_URL}/api/resource`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Create failed");
      }

      /* ========= FILE / PDF / VIDEO → FORM-DATA ========= */
      else {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("courseTitle", form.courseTitle);
        fd.append("resourceType", form.resourceType);
        fd.append("tags", form.tags);
        fd.append("thumbnail", thumbnailFile);
        if (file) fd.append("file", file);

        const res = await fetch(`${BACKEND_URL}/api/resource`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        if (!res.ok) throw new Error("Create failed");
      }

      await fetchResources();
      setShowForm(false);
      setForm({
        title: "",
        courseTitle: "",
        resourceType: "link",
        tags: "",
        externalLink: "",
        thumbnailUrl: "",
      });
      setThumbnailFile(null);
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

    const token = localStorage.getItem("token");
    await fetch(`${BACKEND_URL}/api/resource/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setResources(resources.filter((r) => r._id !== id));
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: 20 }}>
      <h2>Teacher Resources</h2>
      <button onClick={() => setShowForm(true)}>➕ Add Resource</button>

      {loading && <p>Loading resources...</p>}
      {!loading && resources.length === 0 && <p>No resources found</p>}

      {resources.map((r) => (
        <div key={r._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h4>{r.title}</h4>
          <p>{r.courseTitle}</p>
          <p>{r.resourceType}</p>
          <button onClick={() => handleDelete(r._id)}>Delete</button>
        </div>
      ))}

      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, width: 400 }}>
            <h3>Add Resource</h3>

            <input placeholder="Title" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input placeholder="Course Title" required
              value={form.courseTitle}
              onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
            />

            <select
              value={form.resourceType}
              onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
            >
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="file">File</option>
            </select>

            <input placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />

            {form.resourceType === "link" && (
              <>
                <input placeholder="Thumbnail URL"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  required
                />
                <input placeholder="External Link"
                  value={form.externalLink}
                  onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
                  required
                />
              </>
            )}

            {form.resourceType !== "link" && (
              <>
                <input type="file" required onChange={(e) => setThumbnailFile(e.target.files[0])} />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              </>
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Create"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherResources;
