import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const UserRoute = ({ children }) => {
    const { role, loading } = useContext(AuthContext);

    if (loading) return null;

    // ❌ admin không được vào user
    if (role === "ADMIN") {
        return <Navigate to="/admin/products" replace />;
    }

    return children;
};

export default UserRoute;
