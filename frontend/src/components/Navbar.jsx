import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/navbar.css";

import ProfileMenu from "./ProfileMenu";

function Navbar({ user,setUser }) {

    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    const { token } = useContext(AuthContext);

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

                    Transactions History

                </Link>

                {/* <Link to="/change-password">
                    Change Password
                </Link> */}

            </div>

            {/* <button

                className="logout-btn"

                onClick={handleLogout}

            >

                Logout

            </button> */}

            <ProfileMenu

                user={user}
                setUser={setUser}

                handleLogout={handleLogout}

            />

        </nav>

    );

}

export default Navbar;