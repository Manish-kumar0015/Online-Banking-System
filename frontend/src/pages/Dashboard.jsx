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

    // Stores logged-in user's profile information
    const [user, setUser] = useState(null);

    // Stores account summary (balance, deposits, withdrawals, transfers)
    const [summary, setSummary] = useState(null);

    // Stores recent transaction history
    const [transactions, setTransactions] = useState([]);

    // Fetch dashboard data when component loads
    useEffect(() => {

        fetchDashboard();

        fetchSummary();

        fetchTransactions();

    }, []);

    // Fetch user profile and account details
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

    // Fetch transaction summary for charts and summary cards
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

    // Fetch latest transactions (display only first five)
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

    // Download bank statement as a PDF file
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

            // Create downloadable PDF from response
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

    // Show loading screen until dashboard data is available
    if (

        !user ||

        !summary

    ) {

        return <h2>Loading...</h2>;

    }

    return (

        <>

            {/* Top navigation bar */}
            <Navbar
                user={user}
                setUser={setUser}
            />

            <div className="dashboard">

                {/* Welcome section */}
                <div className="dashboard-header">

                    <h1>

                        Welcome, {user.name} 👋

                    </h1>

                    <p>

                        Manage your banking account easily.

                    </p>

                </div>

                {/* Account summary cards */}
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

                {/* Transaction statistics charts */}
                <TransactionChart

                    summary={summary}

                />

                {/* Recent transaction table */}
                <RecentTransactions

                    transactions={transactions}

                />

                {/* Bank statement download button */}
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