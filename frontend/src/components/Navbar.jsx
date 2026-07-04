import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import "../styles/navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    return (

        <nav className="navbar">

            <h2>🏦 Online Banking</h2>

            <div className="nav-links">

                <Link to="/dashboard">

                    Dashboard

                </Link>

                <Link to="/profile">

                    Profile

                </Link>

                <Link to="/deposit">

                    Deposit

                </Link>

                <Link to="/withdraw">

                    Withdraw

                </Link>

                <Link to="/transfer">

                    Transfer

                </Link>

                <Link to="/transactions">

                    Transactions

                </Link>

            </div>

            <button

                className="logout-btn"

                onClick={handleLogout}

            >

                Logout

            </button>

        </nav>

    );

}

export default Navbar;