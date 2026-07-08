import { useEffect, useState, useContext } from "react";

import Navbar from "../components/Navbar";
import InfoCard from "../components/InfoCard";
import SummaryCard from "../components/SummaryCard";
import RecentTransactions from "../components/RecentTransactions";

import TransactionChart from "../components/TransactionChart";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/dashboard.css";

function Dashboard() {

    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    const [summary, setSummary] = useState(null);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        fetchDashboard();

        fetchSummary();

        fetchTransactions();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await api.get(

                "/auth/dashboard",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setUser(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const fetchSummary = async () => {

        try {

            const response = await api.get(

                "/account/summary",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setSummary(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };


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

            setTransactions(

                response.data.slice(0, 5)

            );

        }

        catch (error) {

            console.log(error);

        }

    };

    const downloadStatement = async () => {

        try {

            const response = await api.get(

                "/account/statement",

                {

                    responseType: "blob",

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const file = new Blob(

                [response.data],

                {

                    type: "application/pdf"

                }

            );

            const fileURL = window.URL.createObjectURL(file);

            const link = document.createElement("a");

            link.href = fileURL;

            link.download = "Bank_Statement.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(fileURL);

        }

        catch (error) {

            console.log(error);

        }

    };

    if (

        !user ||

        !summary

    ) {

        return <h2>Loading...</h2>;

    }

    
    return (

        <>

            <Navbar 
                user={user}
                setUser={setUser}

            />

            <div className="dashboard">

                <div className="dashboard-header">

                    <h1>

                        Welcome, {user.name} 👋

                    </h1>

                    <p>

                        Manage your banking account easily.

                    </p>

                </div>

                <div className="summary-grid">

                    <SummaryCard

                        title="Current Balance"

                        amount={summary.balance}

                    />

                    <SummaryCard

                        title="Total Deposit"

                        amount={summary.totalDeposit}

                    />

                    <SummaryCard

                        title="Total Withdraw"

                        amount={summary.totalWithdraw}

                    />

                    <SummaryCard

                        title="Total Transfer"

                        amount={summary.totalTransfer}

                    />

                </div>

                <TransactionChart

                    summary={summary}

                />

                <RecentTransactions

                    transactions={transactions}

                />

                <div className="statement-download">

                    <button

                        className="statement-btn"

                        onClick={downloadStatement}

                    >

                        📄 Download Bank Statement

                    </button>

                </div>

            </div>

        </>

    );

}

export default Dashboard;