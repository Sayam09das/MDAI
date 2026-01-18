import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [tags, setTags] = useState("");
  const [resourceType, setResourceType] = useState("file");
  const [file, setFile] = useState(null);
  const [externalLink, setExternalLink] = useState("");
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

    if (resourceType !== "link" && !file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseTitle", courseTitle);
      formData.append("resourceType", resourceType);

      tags.split(",").forEach((tag) => {
        if (tag.trim()) formData.append("tags", tag.trim());
      });

      if (resourceType === "link") {
        formData.append("externalLink", externalLink);
      } else {
        formData.append("file", file);
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

      // ✅ refresh list & close form
      await fetchResources();
      setShowForm(false);

      // reset form
      setTitle("");
      setCourseTitle("");
      setTags("");
      setFile(null);
      setExternalLink("");
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

          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
          >
            <option value="file">File</option>
            <option value="video">Video (MP3)</option>
            <option value="link">Link</option>
          </select>

          {resourceType === "link" ? (
            <input
              type="text"
              placeholder="External Link"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              required
            />
          ) : (
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          )}

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
            <h4>{r.title}</h4>
            <p><b>Course:</b> {r.courseTitle}</p>
            <p><b>Type:</b> {r.resourceType}</p>

            {r.fileUrl && (
              <a href={r.fileUrl} target="_blank">Open File</a>
            )}

            {r.externalLink && (
              <a href={r.externalLink} target="_blank">Open Link</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherResources;
