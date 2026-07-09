import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/login.css";

function Login(){

    // Hook used for page navigation after successful login
    const navigate = useNavigate();

    // Access login function from AuthContext to store JWT token
    const { login } = useContext(AuthContext);

    // State variables for form inputs and response messages
    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [message,setMessage] = useState("");

    const [error,setError] = useState("");

    // Handles login form submission
    const handleSubmit = async(e)=>{

        e.preventDefault();

        // Clear previous messages before sending a new request
        setMessage("");

        setError("");

        try{

            // Send login credentials to backend API
            const response = await api.post(

                "/auth/login",

                {

                    email,

                    password

                }

            );

            // Save JWT token in AuthContext and localStorage
            login(response.data.token);

            setMessage(response.data.message);

            // Redirect user to dashboard after successful login
            setTimeout(()=>{

                navigate("/dashboard");

            },1000);

        }

        catch(err){

            // Display backend error message if available
            if(err.response){

                setError(err.response.data.message);

            }

            else{

                setError("Server Error");

            }

        }

    };

    return(

        <div className="login-container">

            <div className="login-card">

                <h2>Login</h2>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                        required

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                        required

                    />

                    <button type="submit">

                        Login

                    </button>

                    {/* Navigate to Forgot Password page */}
                    <p
                        style={{

                            marginTop:"15px",

                            textAlign:"center"

                        }}
                    >

                        <Link

                            to="/forgot-password"

                        >

                            Forgot Password?

                        </Link>

                    </p>

                </form>

                {/* Success message after login */}
                {

                    message &&

                    <p className="message">

                        {message}

                    </p>

                }

                {/* Error message if login fails */}
                {

                    error &&

                    <p className="error">

                        {error}

                    </p>

                }

                {/* Redirect new users to registration page */}
                <div className="register-link">

                    Don't have an account?

                    <br/>

                    <Link to="/register">

                        Register Here

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;