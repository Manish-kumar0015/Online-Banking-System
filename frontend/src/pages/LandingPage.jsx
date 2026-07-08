import { useNavigate } from "react-router-dom";

import "../styles/LandingPage.css";

import bankingImage from "../assets/banking.png";

function LandingPage() {

    const navigate = useNavigate();

    return (

        <div className="landing-page">

            {/* Navbar */}

            <nav className="navbar">

                <div className="logo">

                    🏦 Online Banking

                </div>

                <div className="nav-links">

                    <a href="#home">Home</a>

                    <a href="#features">Features</a>

                    <a href="#about">About</a>

                    <a href="#contact">Contact</a>

                    <button
                        onClick={()=>navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        onClick={()=>navigate("/register")}
                    >
                        Register
                    </button>

                </div>

            </nav>

            {/* Hero */}

            <section
                id="home"
                className="hero"
            >

                <div className="hero-left">

                    <h1>

                        Secure Online Banking

                    </h1>

                    <h2>

                        Modern Online Banking for Everyday Transactions

                    </h2>

                    <p>

                        Deposit money, withdraw cash,
                        transfer funds, download
                        statements, receive email
                        notifications and manage
                        your bank account securely.

                    </p>

                    <button

                        className="get-btn"

                        onClick={()=>navigate("/login")}

                    >

                        Get Started

                    </button>

                </div>

                <div className="hero-right">

                    <img

                        src={bankingImage}

                        alt="Banking"

                    />

                </div>

            </section>

                        {/* Why Choose Us */}

            <section className="why-us">

                <h2>

                    Why Choose Our Banking?

                </h2>

                <div className="why-grid">

                    <div className="why-card">

                        <div className="icon">

                            🔒

                        </div>

                        <h3>

                            Secure Banking

                        </h3>

                        <p>

                            JWT authentication and encrypted
                            transactions keep your account safe.

                        </p>

                    </div>

                    <div className="why-card">

                        <div className="icon">

                            ⚡

                        </div>

                        <h3>

                            Fast Transactions

                        </h3>

                        <p>

                            Deposit, Withdraw and Transfer
                            money instantly.

                        </p>

                    </div>

                    <div className="why-card">

                        <div className="icon">

                            📧

                        </div>

                        <h3>

                            Instant Notifications

                        </h3>

                        <p>

                            Receive email after every
                            successful transaction.

                        </p>

                    </div>

                </div>

            </section>


            {/* Statistics */}

            <section className="stats">

                <div className="stat-card">

                    <h2>

                        10,000+

                    </h2>

                    <p>

                        Happy Users

                    </p>

                </div>

                <div className="stat-card">

                    <h2>

                        ₹50M+

                    </h2>

                    <p>

                        Transactions

                    </p>

                </div>

                <div className="stat-card">

                    <h2>

                        99.9%

                    </h2>

                    <p>

                        Secure Banking

                    </p>

                </div>

                <div className="stat-card">

                    <h2>

                        24×7

                    </h2>

                    <p>

                        Customer Support

                    </p>

                </div>

            </section>
            {/* Features */}

            <section
                id="features"
                className="features"
            >

                <h2>

                    Our Features

                </h2>

                <div className="feature-grid">

                    <div>

                        💰

                        <h3>Deposit</h3>

                    </div>

                    <div>

                        💸

                        <h3>Withdraw</h3>

                    </div>

                    <div>

                        🔄

                        <h3>Transfer</h3>

                    </div>

                    <div>

                        📄

                        <h3>Statement</h3>

                    </div>

                    <div>

                        📧

                        <h3>Email Alerts</h3>

                    </div>

                    <div>

                        🔐

                        <h3>OTP Reset</h3>

                    </div>

                </div>

            </section>

            {/* About */}

            <section
                id="about"
                className="about"
            >

                <h2>

                    About

                </h2>

                <p>

                    This Online Banking System was
                    developed using React, Node.js,
                    Express and MySQL.

                </p>

            </section>

            {/* Contact */}

            <section
                id="contact"
                className="contact"
            >

                <h2>

                    Contact

                </h2>

                <p>

                    Email:
                    support@onlinebanking.com

                </p>

            </section>

            {/* Footer */}

            <footer>

                © 2026 Online Banking System

            </footer>

        </div>

    );

}

export default LandingPage;