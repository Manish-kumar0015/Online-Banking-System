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

// transaction search
router.get(

    "/transactions/search",

    authenticateToken,

    accountController.searchTransactions

);

// statement download
router.get(

    "/statement",

    authenticateToken,

    accountController.downloadStatement

);

router.get(

    "/summary",

    authenticateToken,

    accountController.summary

);


module.exports = router;