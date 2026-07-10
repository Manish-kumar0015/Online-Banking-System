const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Establish MySQL database connection
require("./config/db");

// Import application routes
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

// Enable Cross-Origin Resource Sharing (Frontend ↔ Backend)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded profile images as static files
// Example:
// http://localhost:5000/uploads/profile/image.jpg
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// Authentication related APIs
app.use("/api/auth", authRoutes);


// Banking account related APIs
app.use("/api/account", accountRoutes);

// Test API to verify backend is running
app.get("/api", (req, res) => {

    res.send("Online Banking API Running");

});

// Use PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Start Express server
app.listen(PORT, () => {

    console.log(`Server Running on ${PORT}`);

});