import { useEffect, useState, useContext } from "react";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/profile.css";

function Profile() {

    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    const [name, setName] = useState("");

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

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

            setName(response.data.name);

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateProfile = async () => {

        try {

            const response = await api.put(

                "/auth/profile",

                {

                    name

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            alert(response.data.message);

            fetchProfile();

        }

        catch (error) {

            alert("Profile Update Failed");

        }

    };

    if (!user) {

        return <h2>Loading...</h2>;

    }

    return (

        <>

            <Navbar />

            <div className="profile">

                <h1>My Profile</h1>

                <div className="profile-card">

                    <label>Name</label>

                    <input

                        type="text"

                        value={name}

                        onChange={(e)=>setName(e.target.value)}

                    />

                    <label>Email</label>

                    <input

                        type="email"

                        value={user.email}

                        disabled

                    />

                    <label>Account Number</label>

                    <input

                        type="text"

                        value={user.account_number}

                        disabled

                    />

                    <label>Balance</label>

                    <input

                        type="text"

                        value={`₹ ${user.balance}`}

                        disabled

                    />

                    <button

                        onClick={updateProfile}

                    >

                        Save Changes

                    </button>

                </div>

            </div>

        </>

    );

}

export default Profile;