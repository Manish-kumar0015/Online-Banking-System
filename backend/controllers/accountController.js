// Import account-related database functions
const Account = require("../models/accountModel");

// Library used to generate PDF bank statements
const PDFDocument = require("pdfkit");

// Utility function to send transaction emails
const sendEmail = require("../utils/sendEmail");

// User model for fetching user information
const User = require("../models/userModel");

// ==============================
// Deposit Money into User Account
// ==============================
const deposit = (req, res) => {
    // Logged-in user's ID comes from JWT middleware
    const userId = req.user.id;
    // Deposit amount entered by user
    const { amount } = req.body;

    // Validate input
    if (!amount || amount <= 0) {

        return res.status(400).json({

            message: "Invalid Amount"

        });

    }

    // Fetch user's account details
    Account.getAccount(

        userId,

        (err, accountResult) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (accountResult.length === 0) {

                return res.status(404).json({

                    message: "Account Not Found"

                });

            }
             // Store account number for transaction history
            const accountNumber = accountResult[0].account_number;

            // Update account balance after deposit
            Account.depositMoney(

                userId,

                amount,

                (depositErr) => {

                    if (depositErr) {

                        return res.status(500).json({

                            message: "Deposit Failed"

                        });

                    }

                    // Save deposit transaction into transaction history
                    Account.saveTransaction(

                        accountNumber,

                        amount,

                        (transactionErr) => {

                            if (transactionErr) {

                                return res.status(500).json({

                                    message: "Transaction Save Failed"

                                });

                            }
                            // Fetch updated balance after successful deposit
                            Account.getBalance(

                                userId,

                                (balanceErr, balanceResult) => {

                                    if (balanceErr) {

                                        return res.status(500).json({

                                            message: "Balance Fetch Failed"

                                        });

                                    }
                                    // Fetch user's name and email for sending notification
                                    User.getUserById(

                                        userId,

                                        async (userErr, userResult) => {

                                            if (!userErr && userResult.length > 0) {

                                                const user = userResult[0];
                                                // Email content sent after successful deposit
                                                const message = `

                                    Hello ${user.name},

                                    Your deposit was successful.

                                    Account Number : ${balanceResult[0].account_number}

                                    Amount Deposited : ₹${amount}

                                    Current Balance : ₹${balanceResult[0].balance}

                                    Date : ${new Date().toLocaleString()}

                                    Thank you for banking with us.

                                    `;

                                                try {
                                                // Send deposit confirmation email
                                                    await sendEmail(

                                                        user.email,

                                                        "Deposit Successful",

                                                        message

                                                    );

                                                }

                                                catch (emailError) {

                                                    console.log(

                                                        "Email Error:",

                                                        emailError.message

                                                    );

                                                }

                                            }
                                            // Return success response to frontend
                                            res.json({

                                                message: "Deposit Successful",

                                                accountNumber:

                                                    balanceResult[0].account_number,

                                                currentBalance:

                                                    balanceResult[0].balance,

                                                depositAmount: amount

                                            });

                                        }

                                    );
                                    // res.json({

                                    //     message: "Deposit Successful",

                                    //     accountNumber:
                                    //         balanceResult[0].account_number,

                                    //     currentBalance:
                                    //         balanceResult[0].balance,

                                    //     depositAmount: amount

                                    // });

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};

// =================================
// Withdraw Money from User Account
// =================================
const withdraw = (req, res) => {

    const userId = req.user.id;

    const { amount } = req.body;

    // Validate withdrawal amount
    if (!amount || amount <= 0) {

        return res.status(400).json({

            message: "Invalid Amount"

        });

    }

    // Fetch current account balance
    Account.getCurrentBalance(

        userId,

        (balanceErr, balanceResult) => {

            if (balanceErr) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (balanceResult.length === 0) {

                return res.status(404).json({

                    message: "Account Not Found"

                });

            }

            const currentBalance = Number(balanceResult[0].balance);

            const accountNumber = balanceResult[0].account_number;

            // Check whether sufficient balance is available
            if (currentBalance < amount) {

                return res.status(400).json({

                    message: "Insufficient Balance"

                });

            }

            // Deduct amount from account balance
            Account.withdrawMoney(

                userId,

                amount,

                (withdrawErr) => {

                    if (withdrawErr) {

                        return res.status(500).json({

                            message: "Withdraw Failed"

                        });

                    }

                    // Record withdrawal transaction
                    Account.saveWithdrawTransaction(

                        accountNumber,

                        amount,

                        (transactionErr) => {

                            if (transactionErr) {

                                return res.status(500).json({

                                    message: "Transaction Save Failed"

                                });

                            }

                            // Fetch latest balance after withdrawal
                            Account.getBalance(

                                userId,

                                (err, result) => {

                                    if (err) {

                                        return res.status(500).json({

                                            message: "Balance Fetch Failed"

                                        });

                                    }
                                    // Fetch user details to send withdrawal confirmation email
                                    User.getUserById(

                                        userId,

                                        async (userErr, userResult) => {

                                            if (!userErr && userResult.length > 0) {

                                                const user = userResult[0];

                                                const message = `

                                    Hello ${user.name},

                                    Your withdrawal was successful.

                                    Account Number : ${balanceResult[0].account_number}

                                    Amount Withdrawn : ₹${amount}

                                    Current Balance : ₹${balanceResult[0].balance}

                                    Date : ${new Date().toLocaleString()}

                                    Thank you for banking with us.

                                    `;

                                                try {
                                                    // Send withdrawal confirmation email
                                                    await sendEmail(

                                                        user.email,

                                                        "Withdrawal Successful",

                                                        message

                                                    );

                                                }

                                                catch (emailError) {

                                                    console.log(

                                                        "Email Error:",

                                                        emailError.message

                                                    );

                                                }

                                            }

                                            res.json({

                                                message: "Withdraw Successful",

                                                accountNumber:

                                                    balanceResult[0].account_number,

                                                currentBalance:

                                                    balanceResult[0].balance,

                                                withdrawAmount: amount

                                            });

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};

// ====================================
// Transfer Money Between Two Accounts
// ====================================
const transfer = (req, res) => {
    // Logged-in user's ID (Sender)
    const senderId = req.user.id;
    // Receiver account number and transfer amount
    const {

        receiverAccount,

        amount

    } = req.body;

    // Validate Input
    if (!receiverAccount || !amount || amount <= 0) {

        return res.status(400).json({

            message: "Invalid Input"

        });

    }

    // Fetch sender's current account balance
    Account.getCurrentBalance(

        senderId,

        (senderErr, senderResult) => {

            if (senderErr) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (senderResult.length === 0) {

                return res.status(404).json({

                    message: "Sender Account Not Found"

                });

            }

            const senderBalance = Number(senderResult[0].balance);

            const senderAccount = senderResult[0].account_number;

            // Prevent transfer to own account
            if (senderAccount == receiverAccount) {

                return res.status(400).json({

                    message: "Cannot Transfer To Same Account"

                });

            }

            // Balance Check
            if (senderBalance < amount) {

                return res.status(400).json({

                    message: "Insufficient Balance"

                });

            }

            // Verify receiver account exists
            Account.getAccountByNumber(

                receiverAccount,

                (receiverErr, receiverResult) => {

                    if (receiverErr) {

                        return res.status(500).json({

                            message: "Database Error"

                        });

                    }

                    if (receiverResult.length === 0) {

                        return res.status(404).json({

                            message: "Receiver Account Not Found"

                        });

                    }

                    // Perform transfer (Debit sender and Credit receiver)
                    Account.transferTransaction(

                        senderId,

                        receiverAccount,

                        senderAccount,

                        amount,

                        (transactionErr)=>{

                            if(transactionErr){

                                return res.status(500).json({

                                    message:"Transfer Failed",

                                    error:transactionErr.message

                                });

                            }
                            // Fetch updated sender balance after transfer
                            Account.getBalance(

                                senderId,

                                (balanceErr,balanceResult)=>{

                                    if(balanceErr){

                                        return res.status(500).json({

                                            message:"Balance Fetch Failed"

                                        });

                                    }
                                    // Fetch sender information to send transfer confirmation email
                                    User.getUserById(

                                        senderId,

                                        async (userErr,userResult)=>{

                                            if(!userErr && userResult.length>0){

                                                const user=userResult[0];

                                                const message=`

                            Hello ${user.name},

                            Your money transfer was successful.

                            Receiver Account : ${receiverAccount}

                            Amount Transferred : ₹${amount}

                            Remaining Balance : ₹${balanceResult[0].balance}

                            Date : ${new Date().toLocaleString()}

                            Thank you for banking with us.

                            `;

                                                try{
                                                    // Send transfer confirmation email to sender
                                                    await sendEmail(

                                                        user.email,

                                                        "Money Transfer Successful",

                                                        message

                                                    );

                                                }

                                                catch(emailError){

                                                    console.log(

                                                        "Email Error:",

                                                        emailError.message

                                                    );

                                                }

                                            }
                                            // Fetch receiver details to send money received notification
                                            Account.getAccountByNumber(

                                                receiverAccount,

                                                async (receiverErr, receiverResult) => {

                                                    if (!receiverErr && receiverResult.length > 0) {

                                                        const receiver = receiverResult[0];

                                                        User.getUserById(

                                                            receiver.user_id,

                                                            async (receiverUserErr, receiverUserResult) => {

                                                                if (!receiverUserErr && receiverUserResult.length > 0) {

                                                                    const receiverUser = receiverUserResult[0];

                                                                    const receiverMessage = `

                                            Hello ${receiverUser.name},

                                            You have received money successfully.

                                            Sender Account : ${senderAccount}

                                            Amount Received : ₹${amount}

                                            Current Balance : ₹${receiver.balance}

                                            Date : ${new Date().toLocaleString()}

                                            Thank you for banking with us.

                                            `;

                                                                    try {
                                                                        // Send money received email to receiver
                                                                        await sendEmail(

                                                                            receiverUser.email,

                                                                            "Money Received",

                                                                            receiverMessage

                                                                        );

                                                                    }

                                                                    catch(emailError){

                                                                        console.log(

                                                                            "Receiver Email Error:",

                                                                            emailError.message

                                                                        );

                                                                    }

                                                                }
                                                                // Return successful transfer response
                                                                res.json({

                                                                    message:"Transfer Successful",

                                                                    senderAccount,

                                                                    receiverAccount,

                                                                    transferAmount:amount,

                                                                    currentBalance:balanceResult[0].balance

                                                                });

                                                            }

                                                        );

                                                    }

                                                    else{

                                                        res.json({

                                                            message:"Transfer Successful",

                                                            senderAccount,

                                                            receiverAccount,

                                                            transferAmount:amount,

                                                            currentBalance:balanceResult[0].balance

                                                        });

                                                    }

                                                }

                                            );

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};

// ===================================
// Get Transaction History
// Supports Pagination and Sorting
// ===================================
const getTransactions = (req, res) => {
    // Read page number, limit and sorting option from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const sort = req.query.sort || "latest";

    Account.getTransactions(

        req.user.id,

        page,

        limit,

        sort,

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json(result);

        }

    );

};
// ===================================
// Generate PDF Bank Statement
// ===================================
const downloadStatement = (

    req,

    res

) => {
    // Fetch account information and transaction history
    Account.getStatementData(

        req.user.id,

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (result.length === 0) {

                return res.status(404).json({

                    message: "No Data Found"

                });

            }
            // Create PDF document
            const doc = new PDFDocument({

                margin: 50

            });
            // Configure response headers for PDF download
            res.setHeader(

                "Content-Type",

                "application/pdf"

            );

            res.setHeader(

                "Content-Disposition",

                "attachment; filename=statement.pdf"

            );

            doc.pipe(res);

            const user = result[0];

            // ===========================
            // HEADER
            // ===========================

            doc

                .fontSize(24)

                .font("Helvetica-Bold")

                .text(

                    "ONLINE BANKING SYSTEM",

                    {

                        align: "center"

                    }

                );

            doc.moveDown(0.5);

            doc

                .moveTo(50, doc.y)

                .lineTo(550, doc.y)

                .stroke();

            doc.moveDown();

            // ===========================
            // CUSTOMER INFORMATION
            // ===========================

            doc

                .fontSize(18)

                .font("Helvetica-Bold")

                .text(

                    "Customer Information"

                );

            doc.moveDown(0.5);

            doc

                .fontSize(13)

                .font("Helvetica");

            doc.text(

                `Name            : ${user.name}`

            );

            doc.text(

                `Email           : ${user.email}`

            );

            doc.text(

                `Account Number  : ${user.account_number}`

            );

            doc.text(

                `Current Balance : ₹${user.balance}`

            );

            doc.moveDown();

            doc

                .moveTo(50, doc.y)

                .lineTo(550, doc.y)

                .stroke();

            doc.moveDown();

            // ===========================
            // TRANSACTION HISTORY
            // ===========================

            doc

                .fontSize(18)

                .font("Helvetica-Bold")

                .text(

                    "Transaction History"

                );

            doc.moveDown();

            result.forEach((transaction) => {

                if (transaction.type) {

                    doc

                        .fontSize(12)

                        .font("Helvetica");

                    doc.text(

                        `Date : ${new Date(transaction.created_at).toLocaleString()}`

                    );

                    doc.text(

                        `Type : ${transaction.type}`

                    );

                    doc.text(

                        `Amount : ₹${transaction.amount}`

                    );

                    doc.text(

                        `Description : ${transaction.description}`

                    );

                    doc.moveDown();

                    doc

                        .moveTo(50, doc.y)

                        .lineTo(550, doc.y)

                        .stroke();

                    doc.moveDown();

                }

            });

            // ===========================
            // FOOTER
            // ===========================

            doc.moveDown();

            doc

                .fontSize(11)

                .font("Helvetica-Oblique")

                .text(

                    `Generated On : ${new Date().toLocaleString()}`

                );

            doc.moveDown();

            doc

                .fontSize(13)

                .font("Helvetica-Bold")

                .text(

                    "Thank You For Banking With Us",

                    {

                        align: "center"

                    }

                );

            doc.end();

        }

    );

};
// ===========================
// Fetch Dashboard Summary
// ===========================
const summary = (

    req,

    res

) => {
    // Fetch account balance and transaction summary
    Account.getSummary(

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
// ===========================
// Search Transactions
// ===========================
const searchTransactions = (

    req,

    res

) => {

    const keyword = req.query.keyword;

    if (!keyword) {

        return res.status(400).json({

            message: "Search keyword is required"

        });

    }
    // Search transactions by keyword (type, description, etc.)
    Account.searchTransactions(

        req.user.id,

        keyword,

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json(result);

        }

    );

};

module.exports = {

    deposit,

    withdraw,

    transfer,

    getTransactions,

    downloadStatement,

    summary,

    searchTransactions

};