import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherResources = ({ courseId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH RESOURCES ================= */
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
      console.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ================= DELETE ================= */
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

  /* ================= FORM SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("course", courseId);

    const url = editingResource
      ? `${BACKEND_URL}/api/resource/${editingResource._id}`
      : `${BACKEND_URL}/api/resource/create`;

    const method = editingResource ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setShowForm(false);
    setEditingResource(null);
    fetchResources();
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Course Resources</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Resource
        </button>
      </div>

      {loading && <p>Loading resources...</p>}

      {!loading && resources.length === 0 && (
        <p className="text-gray-500">No resources yet.</p>
      )}

      {/* ================= RESOURCE LIST ================= */}
      <div className="grid gap-4">
        {resources.map((res) => (
          <div
            key={res._id}
            className="border rounded p-4 flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{res.title}</h3>
              <p className="text-sm text-gray-500">
                Type: {res.resourceType}
              </p>
              <p className="text-sm">Tags: {res.tags.join(", ")}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingResource(res);
                  setShowForm(true);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(res._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL FORM ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-[500px] space-y-3"
          >
            <h3 className="text-lg font-bold">
              {editingResource ? "Edit Resource" : "Add Resource"}
            </h3>

            {/* COURSE ID */}
            <input
              value={courseId}
              disabled
              className="w-full border p-2 bg-gray-100"
            />

            <input
              name="title"
              placeholder="Title"
              defaultValue={editingResource?.title}
              required
              className="w-full border p-2"
            />

            <input
              name="tags"
              placeholder="Tags (comma separated)"
              defaultValue={editingResource?.tags?.join(",")}
              required
              className="w-full border p-2"
            />

            <select
              name="resourceType"
              defaultValue={editingResource?.resourceType}
              required
              className="w-full border p-2"
            >
              <option value="">Select Type</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="file">File</option>
              <option value="link">Link</option>
              <option value="other">Other</option>
            </select>

            <input
              name="pages"
              type="number"
              placeholder="Pages"
              defaultValue={editingResource?.pages}
              className="w-full border p-2"
            />

            <input
              name="externalLink"
              placeholder="External Link"
              defaultValue={editingResource?.externalLink}
              className="w-full border p-2"
            />

            <input name="thumbnail" type="file" />
            <input name="file" type="file" />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingResource(null);
                }}
                className="px-4 py-2 border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherResources;
