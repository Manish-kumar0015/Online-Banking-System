
const Account = require("../models/accountModel");

const PDFDocument = require("pdfkit");

const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

const deposit = (req, res) => {

    const userId = req.user.id;

    const { amount } = req.body;

    // Validate input
    if (!amount || amount <= 0) {

        return res.status(400).json({

            message: "Invalid Amount"

        });

    }

    // Find user's account
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

            const accountNumber = accountResult[0].account_number;

            // Update balance
            Account.depositMoney(

                userId,

                amount,

                (depositErr) => {

                    if (depositErr) {

                        return res.status(500).json({

                            message: "Deposit Failed"

                        });

                    }

                    // Save transaction
                    Account.saveTransaction(

                        accountNumber,

                        amount,

                        (transactionErr) => {

                            if (transactionErr) {

                                return res.status(500).json({

                                    message: "Transaction Save Failed"

                                });

                            }

                            Account.getBalance(

                                userId,

                                (balanceErr, balanceResult) => {

                                    if (balanceErr) {

                                        return res.status(500).json({

                                            message: "Balance Fetch Failed"

                                        });

                                    }

                                    User.getUserById(

                                        userId,

                                        async (userErr, userResult) => {

                                            if (!userErr && userResult.length > 0) {

                                                const user = userResult[0];

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

const withdraw = (req, res) => {

    const userId = req.user.id;

    const { amount } = req.body;

    // Validate Amount
    if (!amount || amount <= 0) {

        return res.status(400).json({

            message: "Invalid Amount"

        });

    }

    // Get Current Balance
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

            // Check Balance
            if (currentBalance < amount) {

                return res.status(400).json({

                    message: "Insufficient Balance"

                });

            }

            // Withdraw Money
            Account.withdrawMoney(

                userId,

                amount,

                (withdrawErr) => {

                    if (withdrawErr) {

                        return res.status(500).json({

                            message: "Withdraw Failed"

                        });

                    }

                    // Save Transaction
                    Account.saveWithdrawTransaction(

                        accountNumber,

                        amount,

                        (transactionErr) => {

                            if (transactionErr) {

                                return res.status(500).json({

                                    message: "Transaction Save Failed"

                                });

                            }

                            // Fetch Updated Balance
                            Account.getBalance(

                                userId,

                                (err, result) => {

                                    if (err) {

                                        return res.status(500).json({

                                            message: "Balance Fetch Failed"

                                        });

                                    }

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

const transfer = (req, res) => {

    const senderId = req.user.id;

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

    // Get Sender Balance
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

            // Find Receiver
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

                    // Debit Sender
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

                            Account.getBalance(

                                senderId,

                                (balanceErr,balanceResult)=>{

                                    if(balanceErr){

                                        return res.status(500).json({

                                            message:"Balance Fetch Failed"

                                        });

                                    }

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

                                            // res.json({

                                            //     message:"Transfer Successful",

                                            //     senderAccount,

                                            //     receiverAccount,

                                            //     transferAmount:amount,

                                            //     currentBalance:balanceResult[0].balance

                                            // });

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

const getTransactions = (req, res) => {

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

const downloadStatement = (

    req,

    res

) => {

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

            const doc = new PDFDocument({

                margin: 50

            });

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

const summary = (

    req,

    res

) => {

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