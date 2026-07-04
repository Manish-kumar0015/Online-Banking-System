import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/transfer.css";

function Transfer() {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const [receiverAccount, setReceiverAccount] = useState("");

    const [amount, setAmount] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleTransfer = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");

        try{

            const response = await api.post(

                "/account/transfer",

                {

                    receiverAccount:Number(receiverAccount),

                    amount:Number(amount)

                },

                {

                    headers:{

                        Authorization:`Bearer ${token}`

                    }

                }

            );

            setMessage(response.data.message);

            setTimeout(()=>{

                navigate("/dashboard");

            },1500);

        }

        catch(err){

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
        <navbar />
            <div className="transfer-container">

                <h2>

                    Transfer Money

                </h2>

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

export default Transfer;