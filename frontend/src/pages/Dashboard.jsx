import { useEffect, useState, useContext } from "react";

import Navbar from "../components/Navbar";

import InfoCard from "../components/InfoCard";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/dashboard.css";

function Dashboard() {

    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    useEffect(() => {

        fetchDashboard();

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

    if (!user) {

        return <h2>Loading...</h2>;

    }

    return (

        <>

            <Navbar />

            <div className="dashboard">

                <h1>

                    ONLINE BANKING SYSTEM

                </h1>

                <div className="info-card">

                    <h2>

                        Welcome {user.name} 👋

                    </h2>

                    <div className="cards">

                        <InfoCard

                            title="Email"

                            value={user.email}

                        />

                        <InfoCard

                            title="Account Number"

                            value={user.account_number}

                        />

                        <InfoCard

                            title="Current Balance"

                            value={`₹ ${user.balance}`}

                        />

                    </div>

                </div>

            </div>

        </>

    );

}

export default Dashboard;