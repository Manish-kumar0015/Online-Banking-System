import { useState } from "react";

import {useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import "../styles/ResetPassword.css";

function ResetPassword() {

    // Hook for navigating to another page after password reset
    const navigate = useNavigate();

    // Access data passed from the previous page (Verify OTP)
    const location = useLocation();

    // Retrieve user's email from navigation state
    const email = location.state?.email || "";

    // State variables for new password inputs
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    // Handles password reset form submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate that both password fields match
        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        try {

            // Send new password to backend for updating
            const res = await axios.post(

                "http://localhost:5000/api/auth/reset-password",

                {
                    email,
                    password
                }

            );

            alert(res.data.message);

            // Redirect user to login page after successful password reset
            navigate("/login");

        }

        catch (err) {

            // Display backend error or default error message
            alert(

                err.response?.data?.message ||

                "Something went wrong"

            );

        }

    };

    return (

        <div className="reset-container">

            <div className="reset-card">

                <h2>Reset Password</h2>

                <p>Create a new password for your account</p>

                {/* Password Reset Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email field is not required because email is received
                        from the previous page after OTP verification */}

                    {/* <label>Email</label>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /> */}

                    <label>New Password</label>

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        className="reset-btn"
                        type="submit"
                    >

                        Reset Password

                    </button>

                </form>

            </div>

        </div>

    );

}

export default ResetPassword;