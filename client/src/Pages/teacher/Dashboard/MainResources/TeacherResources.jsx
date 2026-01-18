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
  const [resourceFile, setResourceFile] = useState(null);

  /* ================= FETCH ================= */
  const fetchResources = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/resource/teacher`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResources(data.resources || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FRONTEND VALIDATION
    if (!form.title || !form.courseTitle || !form.tags) {
      return alert("Title, course title, and tags are required");
    }

    if (!thumbnailFile && !form.thumbnailUrl) {
      return alert("Thumbnail (file or URL) is required");
    }

    if (form.resourceType === "link" && !form.externalLink) {
      return alert("Resource link is required");
    }

    if (form.resourceType !== "link" && !resourceFile) {
      return alert("Resource file is required");
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("courseTitle", form.courseTitle);
      fd.append("resourceType", form.resourceType);
      fd.append("tags", form.tags);

      // thumbnail (file OR url)
      if (thumbnailFile) {
        fd.append("thumbnail", thumbnailFile);
      } else {
        fd.append("thumbnail", form.thumbnailUrl);
      }

      // main resource
      if (form.resourceType === "link") {
        fd.append("externalLink", form.externalLink);
      } else {
        fd.append("file", resourceFile);
      }

      const res = await fetch(`${BACKEND_URL}/api/resource`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      await fetchResources();
      setShowForm(false);

      // reset
      setForm({
        title: "",
        courseTitle: "",
        resourceType: "link",
        tags: "",
        externalLink: "",
        thumbnailUrl: "",
      });
      setThumbnailFile(null);
      setResourceFile(null);
    } catch (err) {
      alert(err.message || "Create failed");
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

      {/* FORM */}
      {showForm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, width: 420 }}>
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

            {/* THUMBNAIL */}
            <p><b>Thumbnail</b></p>
            <input type="file" onChange={(e) => setThumbnailFile(e.target.files[0])} />
            <input
              placeholder="Or thumbnail image URL"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            />

            {/* RESOURCE */}
            {form.resourceType === "link" ? (
              <input
                placeholder="Resource link (externalLink)"
                value={form.externalLink}
                onChange={(e) => setForm({ ...form, externalLink: e.target.value })}
                required
              />
            ) : (
              <input
                type="file"
                onChange={(e) => setResourceFile(e.target.files[0])}
                required
              />
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
