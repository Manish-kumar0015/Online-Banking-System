const bcrypt = require("bcrypt");

const validator = require("validator");

const User = require("../models/userModel");

const register = async (req,res)=>{

    try{

        const{

            name,

            email,

            password

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

const editProfile = (req, res) => {

    const { name } = req.body;

    if (!name) {

        return res.status(400).json({

            message: "Name is required"

        });

    }

    User.updateProfile(

        req.user.id,

        name,

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

module.exports = {

    register,

    login,

    dashboard,

    editProfile

};