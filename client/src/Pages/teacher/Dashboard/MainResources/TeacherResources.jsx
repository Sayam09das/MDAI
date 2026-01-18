import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [tags, setTags] = useState("");
  const [resourceType, setResourceType] = useState("file");
  const [file, setFile] = useState(null);
  const [externalLink, setExternalLink] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Login required");
      return;
    }

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
        formData.append("tags", tag.trim());
      });

      if (resourceType === "link") {
        formData.append("externalLink", externalLink);
      } else {
        formData.append("file", file);
      }

      // video → mp3 validation (frontend safety)
      if (resourceType === "video" && !file.type.includes("audio")) {
        alert("Only MP3 allowed for video");
        setLoading(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/resource/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      alert("Resource uploaded successfully");

      // reset
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
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Create Resource</h2>

      <form onSubmit={handleSubmit}>
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
          <option value="file">File (PDF / Word / Code)</option>
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
          {loading ? "Uploading..." : "Upload Resource"}
        </button>
      </form>
    </div>
  );
};

export default TeacherResources;
