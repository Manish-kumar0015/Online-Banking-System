import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/withdraw.css";

function Withdraw() {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleWithdraw = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");

        try {

            const response = await api.post(

                "/account/withdraw",

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

            setTimeout(() => {

                navigate("/dashboard");

            }, 1500);

        }

        catch (err) {

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

            <div className="withdraw-container">

                <h2>Withdraw Money</h2>

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

                {

                    message &&

                    <p className="message">

                        {message}

                    </p>

                }

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