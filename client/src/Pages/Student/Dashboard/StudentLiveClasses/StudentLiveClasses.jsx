import React, { useEffect, useState } from "react";
import { Video, Calendar, Clock, Play } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("token");

const StudentLiveClasses = ({ courseId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

      setSessions(data.lessons);
    } catch (err) {
      toast.error("Failed to load live classes");
    } finally {
      setLoading(false);
    }
  };

  const joinClass = (link) => {
    window.open(link, "_blank");
    toast.success("Joining live class 🚀");
  };

  return (
    <div className="p-6">
      <ToastContainer />

      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Video /> Live Classes
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500">No live sessions scheduled</p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-xl p-5 shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar size={14} /> {s.date}
                  <Clock size={14} /> {s.time}
                  • {s.duration} min
                </p>
              </div>

              <button
                onClick={() => joinClass(s.meetLink)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <Play size={16} /> Join Live
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLiveClasses;
