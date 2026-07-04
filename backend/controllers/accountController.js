
const Account = require("../models/accountModel");

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

                                    res.json({

                                        message: "Withdraw Successful",

                                        accountNumber: result[0].account_number,

                                        currentBalance: result[0].balance,

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

                    );

                }

            );

        }

    );

};

const getTransactions = (req, res) => {

    Account.getTransactions(

        req.user.id,

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

    getTransactions

};