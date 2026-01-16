import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Calendar, Clock, Play } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function StudentLiveClasses() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId || courseId === ":courseId") {
      setError("Invalid course");
      setLoading(false);
      return;
    }

    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
        navigate("/login");
        return;
      }

      const res = await fetch(
        `${BACKEND_URL}/api/lessons/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load live sessions");
      }

      setSessions(data.lessons || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const joinClass = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Video className="text-indigo-600" />
          Live Classes
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center">Loading sessions...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-500">
            No live sessions available
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div
                key={s._id}
                className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {s.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {s.time}
                    </span>
                    <span>{s.duration} min</span>
                  </div>
                </div>

                <button
                  onClick={() => joinClass(s.meetLink)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  <Play size={16} />
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
