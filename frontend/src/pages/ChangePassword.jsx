
import { useState, useContext } from "react";

import Navbar from "../components/Navbar";

import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import "../styles/changePassword.css";

function ChangePassword() {

    const { token } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.put(

                "/auth/change-password",

                {

                    currentPassword,

                    newPassword,

                    confirmPassword

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setMessage(response.data.message);

            setCurrentPassword("");

            setNewPassword("");

            setConfirmPassword("");

        }

        catch (error) {

            setMessage(

                error.response?.data?.message ||

                "Something went wrong"

            );

        }

    };

    return (

        <>

            <Navbar />

            <div className="change-password-container">

                <h1>

                    Change Password

                </h1>

                <form

                    onSubmit={handleSubmit}

                >

                    <input

                        type="password"

                        placeholder="Current Password"

                        value={currentPassword}

                        onChange={(e) =>

                            setCurrentPassword(

                                e.target.value

                            )

                        }

                        required

                    />

                    <input

                        type="password"

                        placeholder="New Password"

                        value={newPassword}

                        onChange={(e) =>

                            setNewPassword(

                                e.target.value

                            )

                        }

                        required

                    />

                    <input

                        type="password"

                        placeholder="Confirm Password"

                        value={confirmPassword}

                        onChange={(e) =>

                            setConfirmPassword(

                                e.target.value

                            )

                        }

                        required

                    />

                    <button type="submit">

                        Update Password

                    </button>

                </form>

                {

                    message &&

                    <p>

                        {message}

                    </p>

                }

            </div>

        </>

    );

}

export default ChangePassword;