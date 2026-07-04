import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import "../styles/register.css";

function Register(){

    const navigate = useNavigate();

    const [name,setName] = useState("");

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

                "/auth/register",

                {

                    name,

                    email,

                    password

                }

            );

            setMessage(response.data.message);

            setTimeout(()=>{

                navigate("/");

            },1500);

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

        <div className="register-container">

            <div className="register-card">

                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>

                    <input

                        type="text"

                        placeholder="Full Name"

                        value={name}

                        onChange={(e)=>setName(e.target.value)}

                        required

                    />

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

                        Register

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

            </div>

        </div>

    );

}

export default Register;