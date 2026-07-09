import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/deposit.css";

function Deposit() {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // Handle deposit request
    const handleDeposit = async (e) => {

        e.preventDefault();

        // Clear previous messages
        setMessage("");

        setError("");

        try {

            // Send deposit request to the backend API
            const response = await api.post(

                "/account/deposit",

                {

                    amount: Number(amount)

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setMessage(response.data.message);

            // Redirect user to dashboard after successful deposit
            setTimeout(() => {

                navigate("/dashboard");

            }, 1500);

        }

        catch (err) {

            // Display API error message or fallback server error
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
        <Navbar />

            <div className="deposit-container">

                <h2>Deposit Money</h2>

                {/* Deposit form */}
                <form onSubmit={handleDeposit}>

                    <input

                        type="number"

                        placeholder="Enter Amount"

                        value={amount}

                        onChange={(e) => setAmount(e.target.value)}

                        min="1"

                        required

                    />

                    <button type="submit">

                        Deposit

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

export default Deposit;