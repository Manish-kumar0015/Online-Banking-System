const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const accountController = require("../controllers/accountController");

// Deposit
router.post(
    "/deposit",
    authenticateToken,
    accountController.deposit
);

// Withdraw
router.post(
    "/withdraw",
    authenticateToken,
    accountController.withdraw
);

// Transfer
router.post(
    "/transfer",
    authenticateToken,
    accountController.transfer
);

// Transaction History
router.get(
    "/transactions",
    authenticateToken,
    accountController.getTransactions
);

module.exports = router;