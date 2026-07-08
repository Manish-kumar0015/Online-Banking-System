import { useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ResetPassword.css";
function ResetPassword() {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email || "";

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        try {

            const res = await axios.post(
                "http://localhost:5000/api/auth/reset-password",
                {
                    email,
                    password
                }
            );

            alert(res.data.message);

            navigate("/login");

        }

        catch (err) {

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

                <form onSubmit={handleSubmit}>

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