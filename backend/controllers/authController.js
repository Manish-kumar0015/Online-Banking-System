const bcrypt = require("bcrypt");

const validator = require("validator");

const User = require("../models/userModel");

const OTP = require("../models/otpModel");

const sendEmail = require("../utils/sendEmail");

const register = async (req,res)=>{

    try{

        const{

            name,

            email,

            password,

            accountType

        }=req.body;

        if(!name || !email || !password){

            return res.status(400).json({

                message:"All fields are required"

            });

        }

        if(!validator.isEmail(email)){

            return res.status(400).json({

                message:"Invalid Email"

            });

        }

        const hashedPassword = await bcrypt.hash(password,10);

        const userData={

            name,

            email,

            password:hashedPassword

        };

        User.createUser(

            userData,
            

            (err,result)=>{

                if(err){

                    return res.status(500).json({

                        message:"Registration Failed",

                        error:err

                    });

                }

                const userId = result.insertId;

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

const login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({

            message: "Email and Password are required"

        });

    }

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

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid Password"

            });

        }

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

        res.json({

            message: "Login Successful",

            token

        });

    });

};

const dashboard = (req, res) => {

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

const changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword,

            confirmPassword

        } = req.body;

        if (

            !currentPassword ||

            !newPassword ||

            !confirmPassword

        ) {

            return res.status(400).json({

                message: "All fields are required"

            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                message: "Passwords do not match"

            });

        }

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

                const isMatch = await bcrypt.compare(

                    currentPassword,

                    user.password

                );

                if (!isMatch) {

                    return res.status(401).json({

                        message: "Current Password is Incorrect"

                    });

                }

                const hashedPassword = await bcrypt.hash(

                    newPassword,

                    10

                );

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

const updateProfile = (req, res) => {

    const userId = req.user.id;

    const {

        name,

        email,

        address,

        profile_image

    } = req.body;

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

const sendOTP = (req, res) => {

    const { email } = req.body;

    if (!email) {

        return res.status(400).json({

            message: "Email is required"

        });

    }

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

            const otp = Math.floor(

                100000 + Math.random() * 900000

            ).toString();

            const expiresAt = new Date(

                Date.now() + 5 * 60 * 1000

            );

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

                    const message = `

Hello,

Your password reset OTP is:

${otp}

This OTP is valid for 5 minutes.

Do not share it with anyone.

`;

                    try {

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

const verifyOTP = (req, res) => {

    const {

        email,

        otp

    } = req.body;

    if (!email || !otp) {

        return res.status(400).json({

            message: "Email and OTP are required"

        });

    }

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

            const now = new Date();

            if (now > otpData.expires_at) {

                return res.status(400).json({

                    message: "OTP Expired"

                });

            }

            res.json({

                message: "OTP Verified Successfully"

            });

        }

    );

};

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

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        User.resetPassword(

            email,

            hashedPassword,

            (err) => {

                if (err) {

                    return res.status(500).json({

                        message: "Database Error"

                    });

                }

                OTP.deleteOTP(

                    email,

                    () => {

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

const uploadPhoto = (req, res) => {

    if (!req.file) {

        return res.status(400).json({

            message: "No Image Selected"

        });

    }

    const imagePath = "uploads/profile/" + req.file.filename;

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