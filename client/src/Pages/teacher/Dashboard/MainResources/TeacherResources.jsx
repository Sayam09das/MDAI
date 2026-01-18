import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = ({ courseId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}/api/resource/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
  }, [courseId]);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    formData.append("course", courseId);

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

          <ul style={{ marginTop: 20 }}>
            {resources.map((res) => (
              <li
                key={res._id}
                style={{
                  border: "1px solid #ccc",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <h4>{res.title}</h4>
                <p>{res.tags?.join(", ")}</p>

                <button>Edit</button>
                <button
                  style={{ marginLeft: 10, color: "red" }}
                  onClick={() => handleDelete(res._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleCreate}
            style={{
              background: "#fff",
              padding: 20,
              width: 400,
            }}
          >
            <h3>Add Resource</h3>

            <input name="title" placeholder="Title" required />
            <br />

            <input name="tags" placeholder="react,frontend" required />
            <br />

            <select name="resourceType" required>
              <option value="">Select type</option>
              <option value="pdf">PDF</option>
              <option value="file">File</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>
            <br />

            <input name="pages" placeholder="Pages (optional)" />
            <br />

            <input name="externalLink" placeholder="External link" />
            <br />

            <input type="file" name="thumbnail" />
            <br />

            <input type="file" name="file" />
            <br />

            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ marginLeft: 10 }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherResources;
