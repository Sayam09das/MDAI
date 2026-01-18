import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/resource`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);

    await fetch(`${BACKEND_URL}/api/resource`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setSubmitting(false);
    setShowForm(false);
    e.target.reset();
    fetchResources();
  };

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Teacher Resources</h2>

      {loading && <p>Loading resources...</p>}

      {!loading && resources.length === 0 && (
        <div>
          <p>No resources yet.</p>
          <button onClick={() => setShowForm(true)}>Add Resource</button>
        </div>
      )}

      {!loading && resources.length > 0 && (
        <>
          <button onClick={() => setShowForm(true)}>Add Resource</button>

          <ul>
            {resources.map((res) => (
              <li key={res._id}>
                <h4>{res.title}</h4>
                <p>{res.tags?.join(", ")}</p>

                <button>Edit</button>
                <button onClick={() => handleDelete(res._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {showForm && (
        <div className="modal">
          <form onSubmit={handleCreate}>
            <h3>Add Resource</h3>

            <input
              name="course"
              placeholder="Course ID"
              required
            />

            <input
              name="title"
              placeholder="Title"
              required
            />

            <input
              name="tags"
              placeholder="react,frontend"
              required
            />

            <select name="resourceType" required>
              <option value="">Select type</option>
              <option value="pdf">PDF</option>
              <option value="file">File</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>

            <input name="pages" placeholder="Pages (optional)" />
            <input name="externalLink" placeholder="External link" />
            <input type="file" name="thumbnail" />
            <input type="file" name="file" />

            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Submit"}
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
