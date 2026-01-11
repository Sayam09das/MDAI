import { Navigate } from "react-router-dom";

const TeacherProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "teacher") {
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
};

export default TeacherProtectedRoute;
