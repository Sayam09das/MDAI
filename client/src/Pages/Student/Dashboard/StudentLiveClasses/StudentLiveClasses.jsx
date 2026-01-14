import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Video, Calendar, Clock, Play } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentLiveClasses = () => {
  const { courseId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}/api/lessons/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSessions(data.lessons || []);
    } catch (err) {
      toast.error("Failed to load live sessions");
    } finally {
      setLoading(false);
    }
  };

  const joinClass = (link) => {
    window.open(link, "_blank");
    toast.success("Joining live class 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Video className="text-indigo-600" /> Live Classes
        </h2>
        <p className="text-gray-600 mt-1">
          Join your scheduled live sessions
        </p>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <Video className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-lg font-semibold text-gray-600">
              No live sessions scheduled
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {sessions.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-xl p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* Info */}
                <div>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {s.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {s.time}
                    </span>
                    <span className="font-semibold text-indigo-600">
                      {s.duration} min
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => joinClass(s.meetLink)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
                >
                  <Play size={16} /> Join Live
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLiveClasses;
