import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/transactions.css";

function Transactions() {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        fetchTransactions();

    }, []);

    const fetchTransactions = async () => {

        try {

            const response = await api.get(

                "/account/transactions",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setTransactions(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (
        <>
        <Navbar />
            <div className="transactions-container">

                <h2>

                    Transaction History

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Type</th>

                            <th>Amount</th>

                            <th>Description</th>

                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            transactions.map((item)=>(

                                <tr key={item.id}>

                                    <td>{item.id}</td>

                                    <td>{item.type}</td>

                                    <td>₹ {item.amount}</td>

                                    <td>{item.description}</td>

                                    <td>

                                        {

                                            new Date(item.created_at)

                                            .toLocaleString()

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <button

                    className="back-btn"

                    onClick={()=>navigate("/dashboard")}

                >

                    Back to Dashboard

                </button>

            </div>
        </>

    );

}

export default Transactions;