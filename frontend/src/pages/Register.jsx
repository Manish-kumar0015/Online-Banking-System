import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import "../styles/register.css";

function Register(){

    // Hook used for navigation after successful registration
    const navigate = useNavigate();

    // State variables to store user input and response messages
    const [name,setName] = useState("");

    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    // Default account type is Savings
    const [accountType, setAccountType] = useState("Savings");

    const [message,setMessage] = useState("");

    const [error,setError] = useState("");

    // Handles registration form submission
    const handleSubmit = async(e)=>{

        e.preventDefault();

        // Clear previous success/error messages
        setMessage("");

        setError("");

        try{

            // Send registration details to backend API
            const response = await api.post(

                "/auth/register",

                {

                    name,

                    email,

                    password,

                    accountType

                }

            );

            setMessage(response.data.message);

            // Redirect user to login page after successful registration
            setTimeout(()=>{

                navigate("/login");

            },1500);

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

        <div className="register-container">

            <div className="register-card">

                <h2>Create Account</h2>

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>

                    <input

                        type="text"

                        placeholder="Full Name"

                        value={name}

                        onChange={(e)=>setName(e.target.value)}

                        required

                    />

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

                    {/* Select account type during registration */}
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                    >

                        <option value="Savings">
                            Savings
                        </option>

                        <option value="Current">
                            Current
                        </option>

                    </select>

                    <button type="submit">

                        Register

                    </button>

                </form>

                {/* Success message after registration */}
                {

                    message &&

                    <p className="message">

                        {message}

                    </p>

                }

                {/* Error message if registration fails */}
                {

                    error &&

                    <p className="error">

                        {error}

                    </p>

                }

            </div>

        </div>

    );

}

export default Register;