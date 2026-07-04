const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

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

    authController.editProfile

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

module.exports = router;