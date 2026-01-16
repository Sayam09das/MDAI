import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, Calendar, Clock, Play } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentLiveClasses = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${BACKEND_URL}/api/lessons/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Not authorized");
      }

      setSessions(Array.isArray(data.lessons) ? data.lessons : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message || "Failed to load live sessions");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check if class time has arrived
  const isLiveNow = (date, time) => {
    try {
      const sessionTime = new Date(`${date} ${time}`);
      return new Date() >= sessionTime;
    } catch {
      return true; // fallback: allow join
    }
  };

  const joinClass = (link) => {
    window.open(link, "_blank");
    toast.success("Joining live class 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Video className="text-indigo-600" />
          Live Classes
        </h2>
        <p className="text-gray-600 mt-1">
          Join your scheduled live sessions
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading sessions...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <Video className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-lg font-semibold text-gray-600">
              No live sessions scheduled
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {sessions.map((s) => {
              const live = isLiveNow(s.date, s.time);

              return (
                <div
                  key={s._id}
                  className="bg-white rounded-xl p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
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

                  <button
                    onClick={() => joinClass(s.meetLink)}
                    disabled={!live}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition
                      ${live
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                        : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <Play size={16} />
                    {live ? "Join Live" : "Not Started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLiveClasses;
