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

    const [page, setPage] = useState(1);

    const limit = 10;

    const [keyword, setKeyword] = useState("");

    const [typeFilter, setTypeFilter] = useState("All");

    const [sortOrder, setSortOrder] = useState("latest");

    useEffect(() => {

        fetchTransactions();

    }, [page, sortOrder]);

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

    const searchTransactions = async () => {

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

                    <select
                        value={sortOrder}
                        onChange={(e) => {

                            setSortOrder(e.target.value);

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