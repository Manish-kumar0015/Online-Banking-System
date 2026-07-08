const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const upload = require("../config/multer");

const authenticateToken = require("../middleware/authMiddleware");

const sendEmail = require("../utils/sendEmail");

// Test Route
router.get("/test", (req, res) => {

    res.json({

        message: "Auth Route Working"

    });

});

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Dashboard
router.get(

    "/dashboard",

    authenticateToken,

    authController.dashboard

);

// Edit Profile
router.put(

    "/profile",

    authenticateToken,

    authController.updateProfile

);

// change password
router.put(

    "/change-password",

    authenticateToken,

    authController.changePassword

);

// Protected Profile Route (Optional)
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

router.post(

    "/forgot-password",

    authController.sendOTP

);

router.post(

    "/verify-otp",

    authController.verifyOTP

);

router.post(

    "/reset-password",

    authController.resetPassword

);

router.post(

    "/upload-photo",

    authenticateToken,

    upload.single("photo"),

    authController.uploadPhoto

);
module.exports = router;