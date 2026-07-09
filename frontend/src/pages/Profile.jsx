import { useEffect, useState, useContext } from "react";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/profile.css";

function Profile() {

    // Get JWT token from AuthContext for authenticated API requests
    const { token } = useContext(AuthContext);

    // State variables to store user details
    const [user, setUser] = useState(null);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [address, setAddress] = useState("");

    const [profileImage,setProfileImage] = useState("");

    // Fetch profile information when component loads
    useEffect(() => {

        fetchProfile();

    }, []);

    // Retrieves logged-in user's profile details from the backend
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

            // Store user information in state variables
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

    // Sends updated profile details to the backend
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

            // Reload profile data after successful update
            fetchProfile();

        }

        catch (error) {

            alert("Profile Update Failed");

        }

    };

    // Display loading message until profile data is fetched
    if (!user) {

        return <h2>Loading...</h2>;

    }

    return (

        <>

            <Navbar />

            <div className="profile">

                <h1>My Profile</h1>

                <div className="profile-card">

                    {/* Profile image URL field */}
                    <label>Profile Image URL</label>
                    
                    <input

                    type="text"

                    placeholder="Paste image URL"

                    value={profileImage}

                    onChange={(e)=>setProfileImage(e.target.value)}

                    />

                    {/* Editable personal information */}
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

                    {/* Read-only account information */}
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

                    {/* Editable address field */}
                    <label>Address</label>

                    <input
                        type="text"
                        value={address}
                        onChange={(e)=>setAddress(e.target.value)}
                    />

                    {/* Save updated profile information */}
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