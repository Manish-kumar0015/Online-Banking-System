import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/transactions.css";

function Transactions() {

    // Hook for page navigation
    const navigate = useNavigate();

    // Get JWT token from authentication context
    const { token } = useContext(AuthContext);

    // State variables for transactions, pagination, search and filters
    const [transactions, setTransactions] = useState([]);

    const [page, setPage] = useState(1);

    // Number of transactions displayed per page
    const limit = 10;

    const [keyword, setKeyword] = useState("");

    const [typeFilter, setTypeFilter] = useState("All");

    const [sortOrder, setSortOrder] = useState("latest");

    // Fetch transactions whenever page number or sorting order changes
    useEffect(() => {

        fetchTransactions();

    }, [page, sortOrder]);

    // Fetch paginated transaction history from the backend
    const fetchTransactions = async () => {

        try {

            const response = await api.get(

                `/account/transactions?page=${page}&limit=${limit}&sort=${sortOrder}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            console.log("Response:", response.data);

            setTransactions(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // Search transactions by transaction type or description
    const searchTransactions = async () => {

        // Reload complete transaction history if search box is empty
        if (keyword.trim() === "") {

            fetchTransactions();

            return;

        }

        try {

            const response = await api.get(

                `/account/transactions/search?keyword=${keyword}`,

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

    // Filter transactions based on selected transaction type
    const filteredTransactions = transactions.filter((item)=>{

        if(typeFilter==="All"){

            return true;

        }

        return item.type===typeFilter;

    });

    return (

        <>

            <Navbar />

            <div className="transactions-container">

                <h2>

                    Transaction History

                </h2>

                {/* Search box and sorting controls */}
                <div className="search-box">

                    <input

                        type="text"

                        placeholder="Search by Type or Description"

                        value={keyword}

                        onChange={(e)=>setKeyword(e.target.value)}

                    />

                    <button

                        className="search-btn"

                        onClick={searchTransactions}

                    >

                        Search

                    </button>

                    {/* Sort transactions by latest or oldest */}
                    <select
                        value={sortOrder}
                        onChange={(e) => {

                            setSortOrder(e.target.value);

                            // Reset to first page whenever sorting changes
                            setPage(1);

                        }}
                    >

                        <option value="latest">

                            Latest

                        </option>

                        <option value="oldest">

                            Oldest

                        </option>

                    </select>

                </div>

                {/* Filter transactions by transaction type */}
                <select
                    value={typeFilter}
                    onChange={(e)=>setTypeFilter(e.target.value)}
                >

                    <option value="All">

                        All

                    </option>

                    <option value="Deposit">

                        Deposit

                    </option>

                    <option value="Withdraw">

                        Withdraw

                    </option>

                    <option value="Transfer">

                        Transfer

                    </option>

                </select>

                {/* Transaction history table */}
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

                            filteredTransactions.length===0 ?

                            (

                                <tr>

                                    <td colSpan="5">

                                        No Transactions Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                // Display filtered transactions
                                filteredTransactions.map((item)=>(

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

                            )

                        }

                    </tbody>

                </table>

                {/* Pagination controls */}
                <div className="pagination">

                    <button

                        disabled={page===1}

                        onClick={()=>setPage(page-1)}

                    >

                        Previous

                    </button>

                    <span>

                        Page {page}

                    </span>

                    <button

                        disabled={transactions.length<limit}

                        onClick={()=>setPage(page+1)}

                    >

                        Next

                    </button>

                </div>

                {/* Navigate back to dashboard */}
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