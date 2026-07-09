import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/withdraw.css";

function Withdraw() {

    // Hook for navigating between pages
    const navigate = useNavigate();

    // Get JWT token from authentication context
    const { token } = useContext(AuthContext);

    // State variables for withdrawal amount and response messages
    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // Handles the withdrawal request
    const handleWithdraw = async (e) => {

        e.preventDefault();

        // Clear previous messages
        setMessage("");

        setError("");

        try {

            // Send withdrawal request to the backend
            const response = await api.post(

                "/account/withdraw",

                {

                    amount: Number(amount)

                },

                {

                    headers: {

                        // Send JWT token for user authentication
                        Authorization: `Bearer ${token}`

                    }

                }

            );

            // Display success message
            setMessage(response.data.message);

            // Redirect user to dashboard after successful withdrawal
            setTimeout(() => {

                navigate("/dashboard");

            }, 1500);

        }

        catch (err) {

            // Display backend error message if available
            if (err.response) {

                setError(err.response.data.message);

            }

            else {

                setError("Server Error");

            }

        }

    };

    return (
        <>
        {/* Navigation Bar */}
        <Navbar />

            <div className="withdraw-container">

                <h2>Withdraw Money</h2>

                {/* Withdrawal Form */}
                <form onSubmit={handleWithdraw}>

                    <input

                        type="number"

                        placeholder="Enter Amount"

                        value={amount}

                        onChange={(e)=>setAmount(e.target.value)}

                        min="1"

                        required

                    />

                    <button type="submit">

                        Withdraw

                    </button>

                </form>

                {/* Success message */}
                {

                    message &&

                    <p className="message">

                        {message}

                    </p>

                }

                {/* Error message */}
                {

                    error &&

                    <p className="error">

                        {error}

                    </p>

                }

            </div>
        </>

    );

}

export default Withdraw;