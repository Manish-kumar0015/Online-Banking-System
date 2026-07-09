import { useState, useRef, useContext } from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import "../styles/ProfileMenu.css";

function ProfileMenu({

    user,
    setUser,

    handleLogout

}) {

    // Controls profile dropdown visibility
    const [open, setOpen] = useState(false);

    // Controls profile image preview modal
    const [showImage, setShowImage] = useState(false);

    const { token } = useContext(AuthContext);

    // Reference to the hidden file input
    const fileInputRef = useRef(null);

    // Open file explorer when "Change Photo" is clicked
    const handleImageClick = () => {

        fileInputRef.current.click();

    };

    // Upload the selected profile image to the backend
    const handleImageChange = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("photo", file);

        try {

            const response = await api.post(

                "/auth/upload-photo",

                formData,

                {

                    headers: {

                        Authorization: `Bearer ${token}`,

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            // Update profile image immediately without page refresh
            setUser({

                ...user,

                profile_image: response.data.profile_image

            });

            alert("Profile Photo Uploaded Successfully");

        }

        catch (error) {

            console.log(error);

            alert("Photo Upload Failed");

        }

    };

    return (

        <div className="profile-menu">

            {/* Profile avatar that toggles the dropdown menu */}
            <div

                className="profile-avatar"

                onClick={() => setOpen(!open)}

            >

                {

                    user?.profile_image ?

                    (

                        <img

                            src={`http://localhost:5000/${user.profile_image}`}

                            alt="Profile"

                            className="profile-avatar-image"

                        />

                    )

                    :

                    (

                        user?.name?.charAt(0).toUpperCase()

                    )

                }

            </div>

            {/* Hidden file input used for profile photo selection */}
            <input

                type="file"

                accept="image/*"

                ref={fileInputRef}

                style={{ display: "none" }}

                onChange={handleImageChange}

            />

            {

                open && (

                    <div className="profile-dropdown">

                        <h4>

                            {user.name}

                        </h4>

                        <p>

                            {user.email}

                        </p>

                        <hr/>

                        <Link to="/profile">

                            My Profile

                        </Link>

                        <Link to="/change-password">

                            Change Password

                        </Link>

                        <hr />

                        {/* Open profile image preview */}
                        <button
                            className="view-photo-btn"
                            onClick={() => {
                                setShowImage(true);
                                setOpen(false);
                            }}
                        >
                            🖼 View Photo
                        </button>

                        {/* Upload a new profile photo */}
                        <button
                            className="change-photo-btn"
                            onClick={handleImageClick}
                        >
                            📷 Change Photo
                        </button>

                        <hr />

                        {/* Logout from the application */}
                        <button
                            className="logout-btn-profile"
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>

                    </div>

                )

            }

            {

            /* Full-screen profile image preview */
            showImage && (

                <div

                    className="image-preview-overlay"

                >

                    <div className="image-preview-box">

                        <button

                            className="close-preview"

                            onClick={() => setShowImage(false)}

                        >

                            ✕

                        </button>

                        <img

                            src={`http://localhost:5000/${user.profile_image}`}

                            alt="Profile"

                            className="image-preview"

                        />

                    </div>

                </div>

            )

            }

        </div>

    );

}

export default ProfileMenu;