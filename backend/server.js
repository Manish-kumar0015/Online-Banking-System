const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

require("./config/db");

const authRoutes = require("./routes/authRoutes");

const accountRoutes = require("./routes/accountRoutes");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Register Auth Routes
app.use("/api/auth", authRoutes);

app.use("/api/account", accountRoutes);

app.get("/api", (req, res) => {

    res.send("Online Banking API Running");

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});