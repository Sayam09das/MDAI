import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/auth";

const PublicRoute = () => {
    return isAdminAuthenticated()
        ? <Navigate to="/admin/dashboard" replace />
        : <Outlet />;
};

export default PublicRoute;
