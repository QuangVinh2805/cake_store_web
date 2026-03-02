import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user } = useAuth();

    // 🚫 CHỈ chặn khi route có yêu cầu role
    if (role) {
        // chưa login
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }

        // sai role
        if (user?.role !== role) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
