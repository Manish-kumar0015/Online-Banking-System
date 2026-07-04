
const db = require("../config/db");

// Update account balance
const depositMoney = (userId, amount, callback) => {

    const sql = `
        UPDATE accounts
        SET balance = balance + ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [amount, userId],
        callback
    );

};

// Save transaction
const saveTransaction = (accountNumber, amount, callback) => {

    const sql = `
        INSERT INTO transactions
        (
            account_number,
            type,
            amount,
            description
        )
        VALUES
        (
            ?,
            'Deposit',
            ?,
            'Money Deposited'
        )
    `;

    db.query(
        sql,
        [accountNumber, amount],
        callback
    );

};

// Find account number
const getAccount = (userId, callback) => {

    const sql = `
        SELECT account_number
        FROM accounts
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};

const getBalance = (userId, callback) => {

    const sql = `
        SELECT
            account_number,
            balance
        FROM accounts
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};

const getCurrentBalance = (userId, callback) => {

    const sql = `
        SELECT
            account_number,
            balance
        FROM accounts
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};

const withdrawMoney = (userId, amount, callback) => {

    const sql = `
        UPDATE accounts
        SET balance = balance - ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [amount, userId],
        callback
    );

};

const saveWithdrawTransaction = (

    accountNumber,

    amount,

    callback

) => {

    const sql = `
        INSERT INTO transactions
        (
            account_number,
            type,
            amount,
            description
        )
        VALUES
        (
            ?,
            'Withdraw',
            ?,
            'Money Withdrawn'
        )
    `;

    db.query(

        sql,

        [

            accountNumber,

            amount

        ],

        callback

    );

};

const getAccountByNumber = (accountNumber, callback) => {

    const sql = `
        SELECT
            account_number,
            user_id,
            balance
        FROM accounts
        WHERE account_number = ?
    `;

    db.query(
        sql,
        [accountNumber],
        callback
    );

};

const creditReceiver = (

    accountNumber,

    amount,

    callback

) => {

    const sql = `
        UPDATE accounts
        SET balance = balance + ?
        WHERE account_number = ?
    `;

    db.query(

        sql,

        [

            amount,

            accountNumber

        ],

        callback

    );

};

const saveTransferTransaction = (

    accountNumber,

    amount,

    callback

) => {

    const sql = `
        INSERT INTO transactions
        (
            account_number,
            type,
            amount,
            description
        )
        VALUES
        (
            ?,
            'Transfer',
            ?,
            'Money Transferred'
        )
    `;

    db.query(

        sql,

        [

            accountNumber,

            amount

        ],

        callback

    );

};

const transferTransaction = (

    senderId,

    receiverAccount,

    senderAccount,

    amount,

    callback

) => {

    db.beginTransaction((err)=>{

        if(err){

            return callback(err);

        }

        const withdrawSQL=`
            UPDATE accounts
            SET balance=balance-?
            WHERE user_id=?
        `;

        db.query(

            withdrawSQL,

            [

                amount,

                senderId

            ],

            (withdrawErr)=>{

                if(withdrawErr){

                    return db.rollback(()=>{

                        callback(withdrawErr);

                    });

                }

                const depositSQL=`
                    UPDATE accounts
                    SET balance=balance+?
                    WHERE account_number=?
                `;

                db.query(

                    depositSQL,

                    [

                        amount,

                        receiverAccount

                    ],

                    (depositErr)=>{

                        if(depositErr){

                            return db.rollback(()=>{

                                callback(depositErr);

                            });

                        }

                        const transactionSQL=`
                            INSERT INTO transactions
                            (
                                account_number,
                                type,
                                amount,
                                description
                            )
                            VALUES
                            (
                                ?,
                                'Transfer',
                                ?,
                                'Money Transferred'
                            )
                        `;

                        db.query(

                            transactionSQL,

                            [

                                senderAccount,

                                amount

                            ],

                            (transactionErr)=>{

                                if(transactionErr){

                                    return db.rollback(()=>{

                                        callback(transactionErr);

                                    });

                                }

                                db.commit((commitErr)=>{

                                    if(commitErr){

                                        return db.rollback(()=>{

                                            callback(commitErr);

                                        });

                                    }

                                    callback(null);

                                });

                            }

                        );

                    }

                );

            }

        );

    });

};

const getTransactions = (userId, callback) => {

    const sql = `
        SELECT
            transactions.id,
            transactions.type,
            transactions.amount,
            transactions.description,
            transactions.created_at
        FROM transactions
        JOIN accounts
        ON transactions.account_number = accounts.account_number
        WHERE accounts.user_id = ?
        ORDER BY transactions.created_at DESC
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};

module.exports = {

    depositMoney,

    saveTransaction,

    getAccount,

    getBalance,

    getCurrentBalance,

    withdrawMoney,

    saveWithdrawTransaction,

    getAccountByNumber,

    creditReceiver,

    saveTransferTransaction,

    transferTransaction,

    getTransactions

};