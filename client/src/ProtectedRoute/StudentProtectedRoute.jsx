import { Navigate } from "react-router-dom";

const StudentProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "student" && role !== "user") {
    // in your backend, students are "user"
    return <Navigate to="/teacher-dashboard" replace />;
  }

  return children;
};

export default StudentProtectedRoute;
