const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(

    "/uploads",

    express.static(

        path.join(__dirname, "uploads")

    )

);

// Auth Routes
app.use("/api/auth", authRoutes);

// Account Routes
app.use("/api/account", accountRoutes);

// Test Route
app.get("/api", (req, res) => {

    res.send("Online Banking API Running");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running on ${PORT}`);

});