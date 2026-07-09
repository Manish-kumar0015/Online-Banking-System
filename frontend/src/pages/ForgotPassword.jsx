import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import "../styles/ForgotPassword.css";

function ForgotPassword() {

    // Store the email entered by the user
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    // Send OTP to the registered email for password reset
    const sendOTP = async () => {

        if (!email) {

            alert("Enter Email");

            return;

        }

        try {

            const response = await api.post(

                "/auth/forgot-password",

                {

                    email

                }

            );

            alert(response.data.message);

            // Navigate to OTP verification page and pass the email
            navigate(

                "/verify-otp",

                {

                    state: {

                        email

                    }

                }

            );

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed To Send OTP"

            );

        }

    };

    return (

        <div className="forgot-container">

            <div className="forgot-card">

                <h2>

                    Forgot Password

                </h2>

                <input

                    type="email"

                    placeholder="Enter Email"

                    value={email}

                    onChange={(e) =>

                        setEmail(

                            e.target.value

                        )

                    }

                />

                <button

                    onClick={sendOTP}

                >

                    Send OTP

                </button>

            </div>

        </div>

    );

}

export default ForgotPassword;