import { useEffect, useState, useContext } from "react";

import Navbar from "../components/Navbar";



import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/profile.css";

function Profile() {

    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [address, setAddress] = useState("");

    const [profileImage,setProfileImage] = useState("");

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

            setEmail(response.data.email);

            setAddress(response.data.address || "");

            setProfileImage(response.data.profile_image);

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateProfile = async () => {

        try {

            console.log({
                name,
                email,
                address
            });

            const response = await api.put(

                "/auth/profile",

                {

                    name,

                    email,

                    address

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



                    <label>Profile Image URL</label>
                    
                    <input

                    type="text"

                    placeholder="Paste image URL"

                    value={profileImage}

                    onChange={(e)=>setProfileImage(e.target.value)}

                    />

                    <label>Name</label>

                    <input

                        type="text"

                        value={name}

                        onChange={(e)=>setName(e.target.value)}

                    />

                    <label>Email</label>

                    <input

                        type="email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

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

                    <label>Account Type</label>

                    <input

                        type="text"

                        value={user.account_type}

                        disabled

                    />

                    <label>IFSC Code</label>

                    <input

                        type="text"

                        value={user.ifsc_code}

                        disabled

                    />

                    <label>Branch</label>

                    <input

                        type="text"

                        value={user.branch}

                        disabled

                    />

                    <label>Account Created</label>

                    <input

                        type="text"

                        value={new Date(user.created_on).toLocaleDateString()}

                        disabled

                    />

                    <label>Address</label>

                    <input
                        type="text"
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                    />

                    <button

                        onClick={updateProfile}

                    >

                        Edit Profile

                    </button>

                </div>

            </div>

        </>

    );

}

export default Profile;