import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const BACKEND_URL = "https://mdai-0jhi.onrender.com"; // direct URL

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");

        await res.json();
        setAllowed(true);
      } catch {
        setAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Important: wait while checking auth
  if (checking) {
    return <p style={{ textAlign: "center" }}>Checking authentication...</p>;
  }

  // ❌ Not logged in → go to login
  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → show page
  return children;
};

export default ProtectedRoute;
