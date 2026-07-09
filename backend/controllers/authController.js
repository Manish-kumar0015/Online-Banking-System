// Library for hashing and verifying passwords
const bcrypt = require("bcrypt");

// Library for validating user input
const validator = require("validator");

// User database operations
const User = require("../models/userModel");

// OTP database operations
const OTP = require("../models/otpModel");

// Utility function to send emails
const sendEmail = require("../utils/sendEmail");

// ======================================
// Register a New User and Create Account
// ======================================
const register = async (req,res)=>{

    try{
        // Extract registration details from request body
        const{

            name,

            email,

            password,

            accountType

        }=req.body;
        // Validate required fields
        if(!name || !email || !password){

            return res.status(400).json({

                message:"All fields are required"

            });

        }
        // Validate email format
        if(!validator.isEmail(email)){

            return res.status(400).json({

                message:"Invalid Email"

            });

        }
        // Encrypt password before storing in database
        const hashedPassword = await bcrypt.hash(password,10);
        // Create user object for database insertion
        const userData={

            name,

            email,

            password:hashedPassword

        };
        // Insert user into database
        User.createUser(

            userData,
            

            (err,result)=>{

                if(err){

                    return res.status(500).json({

                        message:"Registration Failed",

                        error:err

                    });

                }
                // Get newly created user's ID
                const userId = result.insertId;
                // Create a bank account for the registered user
                User.createAccount(

                    userId,

                    accountType,

                    (accountErr,accountResult)=>{

                        if(accountErr){

                            return res.status(500).json({

                                message:"Account Creation Failed",

                                error:accountErr

                            });

                        }
                        // Return successful registration response
                        res.status(201).json({

                            message:"Registration Successful",

                            accountNumber:accountResult.insertId

                        });

                    }

                );

            }

        );

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

const jwt = require("jsonwebtoken");
// =====================
// Authenticate User Login
// =====================
const login = (req, res) => {
    // Read login credentials
    const { email, password } = req.body;
    // Validate required fields
    if (!email || !password) {

        return res.status(400).json({

            message: "Email and Password are required"

        });

    }
    // Find user by email
    User.findUserByEmail(email, async (err, result) => {

        if (err) {

            return res.status(500).json({

                message: "Database Error"

            });

        }

        if (result.length === 0) {

            return res.status(404).json({

                message: "User Not Found"

            });

        }
        // Get user details from database
        const user = result[0];
        // Compare entered password with encrypted password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid Password"

            });

        }
        // Generate JWT token for authenticated user
        const token = jwt.sign(

            {

                id: user.id,

                email: user.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1h"

            }

        );
        // Return login success response with JWT token
        res.json({

            message: "Login Successful",

            token

        });

    });

};
// ========================
// Fetch Dashboard Details
// ========================
const dashboard = (req, res) => {
    // Fetch logged-in user's account details
    User.getDashboard(

        req.user.id,

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (result.length === 0) {

                return res.status(404).json({

                    message: "Account Not Found"

                });

            }

            res.json(result[0]);

        }

    );

};
// ======================
// Change User Password
// ======================
const changePassword = async (req, res) => {

    try {
        // Read password fields from request
        const {

            currentPassword,

            newPassword,

            confirmPassword

        } = req.body;
        // Validate required fields
        if (

            !currentPassword ||

            !newPassword ||

            !confirmPassword

        ) {

            return res.status(400).json({

                message: "All fields are required"

            });

        }
        // Ensure both new passwords match
        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                message: "Passwords do not match"

            });

        }
        // Fetch current user details
        User.findUserByEmail(

            req.user.email,

            async (err, result) => {

                if (err) {

                    return res.status(500).json({

                        message: "Database Error"

                    });

                }

                if (result.length === 0) {

                    return res.status(404).json({

                        message: "User Not Found"

                    });

                }

                const user = result[0];
                // Verify current password
                const isMatch = await bcrypt.compare(

                    currentPassword,

                    user.password

                );

                if (!isMatch) {

                    return res.status(401).json({

                        message: "Current Password is Incorrect"

                    });

                }
                // Encrypt new password
                const hashedPassword = await bcrypt.hash(

                    newPassword,

                    10

                );
                // Update password in database
                User.updatePassword(

                    req.user.id,

                    hashedPassword,

                    (updateErr) => {

                        if (updateErr) {

                            return res.status(500).json({

                                message: "Password Update Failed"

                            });

                        }

                        res.json({

                            message: "Password Updated Successfully"

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
// =====================
// Update User Profile
// =====================
const updateProfile = (req, res) => {
    // Logged-in user's ID
    const userId = req.user.id;
    // Read updated profile information
    const {

        name,

        email,

        address,

        profile_image

    } = req.body;
    // Update profile information in database
    User.updateProfile(

        userId,

        name,

        email,

        address,

        profile_image,

        (err) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json({

                message: "Profile Updated Successfully"

            });

        }

    );

};
// ==================================
// Send OTP for Password Reset
// ==================================
const sendOTP = (req, res) => {
    // Read email entered by user
    const { email } = req.body;

    if (!email) {

        return res.status(400).json({

            message: "Email is required"

        });

    }
    // Verify email exists in database
    User.findUserByEmail(

        email,

        async (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (result.length === 0) {

                return res.status(404).json({

                    message: "Email Not Registered"

                });

            }
            // Generate a random 6-digit OTP
            const otp = Math.floor(

                100000 + Math.random() * 900000

            ).toString();
            // OTP will expire after 5 minutes
            const expiresAt = new Date(

                Date.now() + 5 * 60 * 1000

            );
            // Save OTP into database
            OTP.saveOTP(

                email,

                otp,

                expiresAt,

                async (otpErr) => {

                    if (otpErr) {

                        return res.status(500).json({

                            message: "OTP Save Failed"

                        });

                    }
                    // Prepare OTP email content
                    const message = `

Hello,

Your password reset OTP is:

${otp}

This OTP is valid for 5 minutes.

Do not share it with anyone.

`;

                    try {
                        // Prepare OTP email content
                        await sendEmail(

                            email,

                            "Password Reset OTP",

                            message

                        );

                    }

                    catch (emailError) {

                        console.log(emailError);

                    }

                    res.json({

                        message: "OTP Sent Successfully"

                    });

                }

            );

        }

    );

};
// ====================
// Verify User OTP
// ====================
const verifyOTP = (req, res) => {
    // Read email and OTP
    const {

        email,

        otp

    } = req.body;

    if (!email || !otp) {

        return res.status(400).json({

            message: "Email and OTP are required"

        });

    }
    // Check whether OTP exists
    OTP.verifyOTP(

        email,

        otp,

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (result.length === 0) {

                return res.status(400).json({

                    message: "Invalid OTP"

                });

            }

            const otpData = result[0];
            // Check whether OTP has expired
            const now = new Date();

            if (now > otpData.expires_at) {

                return res.status(400).json({

                    message: "OTP Expired"

                });

            }
            // OTP verified successfully
            res.json({

                message: "OTP Verified Successfully"

            });

        }

    );

};
// ========================
// Reset User Password
// ========================
const resetPassword = async (req, res) => {

    const {

        email,

        password

    } = req.body;

    if (!email || !password) {

        return res.status(400).json({

            message: "Email and Password are required"

        });

    }

    try {
        // Encrypt new password
        const hashedPassword = await bcrypt.hash(

            password,

            10

        );
        // Update password in database
        User.resetPassword(

            email,

            hashedPassword,

            (err) => {

                if (err) {

                    return res.status(500).json({

                        message: "Database Error"

                    });

                }
                // Remove used OTP after successful password reset
                OTP.deleteOTP(

                    email,

                    () => {
                        // Return success response
                        res.json({

                            message: "Password Reset Successfully"

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        res.status(500).json({

            message: "Password Reset Failed"

        });

    }

};
// ===========================
// Upload User Profile Photo
// ===========================
const uploadPhoto = (req, res) => {
    // Ensure an image file is selected
    if (!req.file) {

        return res.status(400).json({

            message: "No Image Selected"

        });

    }
    // Save relative image path
    const imagePath = "uploads/profile/" + req.file.filename;
    // Save relative image path
    User.updateProfileImage(

        req.user.id,

        imagePath,

        (err) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json({

                message: "Profile Photo Uploaded Successfully",

                profile_image: imagePath

            });

        }

    );

};

module.exports = {

    register,

    login,

    dashboard,

    changePassword,

    updateProfile,

    sendOTP,

    verifyOTP,

    resetPassword,

    uploadPhoto


};