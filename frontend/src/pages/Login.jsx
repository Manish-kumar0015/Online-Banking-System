import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/login.css";

function Login(){

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [message,setMessage] = useState("");

    const [error,setError] = useState("");

    const handleSubmit = async(e)=>{

        e.preventDefault();

        setMessage("");

        setError("");

        try{

            const response = await api.post(

                "/auth/login",

                {

                    email,

                    password

                }

            );

            login(response.data.token);

            setMessage(response.data.message);

            setTimeout(()=>{

                navigate("/dashboard");

            },1000);

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

        <div className="login-container">

            <div className="login-card">

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>

                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                        required

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                        required

                    />

                    <button type="submit">

                        Login

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

                <div className="register-link">

                    Don't have an account?

                    <br/>

                    <Link to="/register">

                        Register Here

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Login;