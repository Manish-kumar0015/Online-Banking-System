const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const accountController = require("../controllers/accountController");

// Deposit money into the authenticated user's account
router.post(
    "/deposit",
    authenticateToken,
    accountController.deposit
);

// Withdraw money from the authenticated user's account
router.post(
    "/withdraw",
    authenticateToken,
    accountController.withdraw
);

// Transfer money from the authenticated user to another account
router.post(
    "/transfer",
    authenticateToken,
    accountController.transfer
);

// Retrieve transaction history with pagination and sorting
router.get(
    "/transactions",
    authenticateToken,
    accountController.getTransactions
);

// Search transactions using transaction type or description
router.get(

    "/transactions/search",

    authenticateToken,

    accountController.searchTransactions

);

// Generate and download the user's bank statement in PDF format
router.get(

    "/statement",

    authenticateToken,

    accountController.downloadStatement

);

// Fetch account summary including balance and transaction totals
router.get(

    "/summary",

    authenticateToken,

    accountController.summary

);

module.exports = router;