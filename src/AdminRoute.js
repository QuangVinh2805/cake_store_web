import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const AdminRoute = ({ children }) => {
    const { role, loading } = useContext(AuthContext);

    if (loading) return null;

    if (role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
