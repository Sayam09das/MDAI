import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [tags, setTags] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH RESOURCES ================= */
  const fetchResources = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/resource`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= CREATE RESOURCE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!externalLink) {
      alert("External link is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseTitle", courseTitle);
      formData.append("externalLink", externalLink);

      tags.split(",").forEach((tag) => {
        if (tag.trim()) formData.append("tags", tag.trim());
      });

      // ✅ Thumbnail image (optional)
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await fetch(`${BACKEND_URL}/api/resource/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // refresh list & close form
      await fetchResources();
      setShowForm(false);

      // reset form
      setTitle("");
      setCourseTitle("");
      setTags("");
      setExternalLink("");
      setThumbnail(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <h2>Teacher Resources</h2>

      {/* ADD RESOURCE BUTTON */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add Resource"}
      </button>

      {/* CREATE FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Course Title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <input
            type="text"
            placeholder="External Link"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            required
          />

          {/* Thumbnail upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      )}

      {/* RESOURCE LIST */}
      <div style={{ marginTop: "30px" }}>
        <h3>All Resources</h3>

        {resources.length === 0 && <p>No resources yet</p>}

        {resources.map((r) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {r.thumbnail && (
              <img
                src={r.thumbnail}
                alt="thumbnail"
                style={{ width: "120px", marginBottom: "10px" }}
              />
            )}

            <h4>{r.title}</h4>
            <p><b>Course:</b> {r.courseTitle}</p>

            <a href={r.externalLink} target="_blank" rel="noreferrer">
              Open Resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherResources;
