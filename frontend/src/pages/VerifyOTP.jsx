import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";

import "../styles/VerifyOTP.css";

function VerifyOTP() {

    const [otp, setOtp] = useState("");

    const location = useLocation();

    const navigate = useNavigate();

    const email = location.state?.email;

    const verifyOTP = async () => {

        if (!otp) {

            alert("Enter OTP");

            return;

        }

        try {

            const response = await api.post(

                "/auth/verify-otp",

                {

                    email,

                    otp

                }

            );

            alert(response.data.message);

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

                <p>

                    OTP sent to

                    <br />

                    <b>{email}</b>

                </p>

                <input

                    type="text"

                    placeholder="Enter OTP"

                    value={otp}

                    onChange={(e)=>setOtp(e.target.value)}

                />

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