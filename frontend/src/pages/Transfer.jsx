import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/transfer.css";

function Transfer() {

    // Hook for navigating to another page
    const navigate = useNavigate();

    // Get JWT token from authentication context
    const { token } = useContext(AuthContext);

    // State variables for transfer form and response messages
    const [receiverAccount, setReceiverAccount] = useState("");

    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // Handles money transfer request
    const handleTransfer = async (e) => {

        e.preventDefault();

        // Clear previous success/error messages
        setMessage("");

        setError("");

        try{

            // Send transfer request to backend API
            const response = await api.post(

                "/account/transfer",

                {

                    receiverAccount:Number(receiverAccount),

                    amount:Number(amount)

                },

                {

                    headers:{

                        // Send JWT token for authentication
                        Authorization:`Bearer ${token}`

                    }

                }

            );

            // Display success message
            setMessage(response.data.message);

            // Redirect user to dashboard after successful transfer
            setTimeout(()=>{

                navigate("/dashboard");

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
        <>
        {/* Navigation Bar */}
        <Navbar />

            <div className="transfer-container">

                <h2>

                    Transfer Money

                </h2>

                {/* Money Transfer Form */}
                <form onSubmit={handleTransfer}>

                    <input

                        type="number"

                        placeholder="Receiver Account Number"

                        value={receiverAccount}

                        onChange={(e)=>setReceiverAccount(e.target.value)}

                        required

                    />

                    <input

                        type="number"

                        placeholder="Amount"

                        value={amount}

                        onChange={(e)=>setAmount(e.target.value)}

                        min="1"

                        required

                    />

                    <button type="submit">

                        Transfer

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

export default Transfer;