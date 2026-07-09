import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";

import "../styles/VerifyOTP.css";

function VerifyOTP() {

    // Store the OTP entered by the user
    const [otp, setOtp] = useState("");

    // Access data passed from the previous page
    const location = useLocation();

    // Hook for page navigation
    const navigate = useNavigate();

    // Retrieve the user's email passed from Forgot Password page
    const email = location.state?.email;

    // Verify the entered OTP with the backend
    const verifyOTP = async () => {

        // Prevent API call if OTP field is empty
        if (!otp) {

            alert("Enter OTP");

            return;

        }

        try {

            // Send email and OTP to backend for verification
            const response = await api.post(

                "/auth/verify-otp",

                {

                    email,

                    otp

                }

            );

            // Show success message after OTP verification
            alert(response.data.message);

            // Navigate to Reset Password page and pass the email
            navigate(

                "/reset-password",

                {

                    state: {

                        email

                    }

                }

            );

        }

        catch (error) {

            // Display backend error message if OTP is invalid or expired
            alert(

                error.response?.data?.message ||

                "OTP Verification Failed"

            );

        }

    };

    return (

        <div className="verify-container">

            <div className="verify-card">

                <h2>

                    Verify OTP

                </h2>

                {/* Display the email where the OTP was sent */}
                <p>

                    OTP sent to

                    <br />

                    <b>{email}</b>

                </p>

                {/* OTP input field */}
                <input

                    type="text"

                    placeholder="Enter OTP"

                    value={otp}

                    onChange={(e)=>setOtp(e.target.value)}

                />

                {/* Verify OTP button */}
                <button

                    onClick={verifyOTP}

                >

                    Verify OTP

                </button>

            </div>

        </div>

    );

}

export default VerifyOTP;