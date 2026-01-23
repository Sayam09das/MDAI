import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/auth";

const ProtectedRoute = () => {
    return isAdminAuthenticated()
        ? <Outlet />
        : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
