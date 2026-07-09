const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const upload = require("../config/multer");

const authenticateToken = require("../middleware/authMiddleware");

const sendEmail = require("../utils/sendEmail");

// Test API to verify that authentication routes are working correctly
router.get("/test", (req, res) => {

    res.json({

        message: "Auth Route Working"

    });

});

// Register a new user and create a bank account
router.post("/register", authController.register);

// Authenticate user and generate JWT token
router.post("/login", authController.login);

// Fetch dashboard information of the authenticated user
router.get(

    "/dashboard",

    authenticateToken,

    authController.dashboard

);

// Update profile details of the authenticated user
router.put(

    "/profile",

    authenticateToken,

    authController.updateProfile

);

// Allow authenticated user to change account password
router.put(

    "/change-password",

    authenticateToken,

    authController.changePassword

);

// Protected route used to verify JWT authentication
router.get(

    "/profile",

    authenticateToken,

    (req, res) => {

        res.json({

            message: "Welcome",

            user: req.user

        });

    }

);

// Test route to verify Nodemailer email configuration
router.get("/test-email", async (req, res) => {

    try {

        await sendEmail(

            "mk0659407@gmail.com",

            "Online Banking Email Test",

            `Hello,

This is a test email from your Online Banking System.

If you received this email, Nodemailer is working correctly.

Thank you!`

        );

        res.json({

            message: "Test Email Sent Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Email Sending Failed"

        });

    }

});

// Send OTP to the registered email for password reset
router.post(

    "/forgot-password",

    authController.sendOTP

);

// Verify the OTP entered by the user
router.post(

    "/verify-otp",

    authController.verifyOTP

);

// Reset user password after successful OTP verification
router.post(

    "/reset-password",

    authController.resetPassword

);

// Upload and update profile photo for the authenticated user
router.post(

    "/upload-photo",

    authenticateToken,

    upload.single("photo"),

    authController.uploadPhoto

);

module.exports = router;