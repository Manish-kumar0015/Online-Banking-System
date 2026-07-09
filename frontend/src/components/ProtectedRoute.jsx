import { useContext } from "react";

import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

// Restricts access to protected pages unless the user is authenticated
function ProtectedRoute({ children }) {

    const { token } = useContext(AuthContext);

    // Redirect unauthenticated users to the login page
    if (!token) {

        return <Navigate to="/" replace />;

    }

    // Render the requested page for authenticated users
    return children;

}

export default ProtectedRoute;