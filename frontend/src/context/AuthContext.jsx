import { createContext, useState } from "react";

// Create a global context for sharing authentication data
export const AuthContext = createContext();

function AuthProvider({ children }) {

    // Initialize authentication token from localStorage
    // so the user remains logged in after refreshing the page
    const [token, setToken] = useState(

        localStorage.getItem("token") || ""

    );

    // Save JWT token after successful login
    const login = (jwtToken) => {

        localStorage.setItem("token", jwtToken);

        setToken(jwtToken);

    };

    // Clear authentication data during logout
    const logout = () => {

        localStorage.removeItem("token");

        setToken("");

    };

    return (

        // Provide authentication state and methods
        // to all components wrapped by AuthProvider
        <AuthContext.Provider

            value={{

                token,

                login,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthProvider;