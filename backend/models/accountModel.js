
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

                                const receiverTransactionSQL = `
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
                                        'Money Received'
                                    )
                                `;

                                db.query(

                                    receiverTransactionSQL,

                                    [

                                        receiverAccount,

                                        amount

                                    ],

                                    (receiverTransactionErr)=>{

                                        if(receiverTransactionErr){

                                            return db.rollback(()=>{

                                                callback(receiverTransactionErr);

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

            }

        );

    });

};

const getTransactions = (

    userId,

    page,

    limit,

    sort,

    callback

) => {

    const offset = (page - 1) * limit;

    let order = "DESC";

    if (sort === "oldest") {

        order = "ASC";

    }

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
        ORDER BY transactions.created_at ${order}
        LIMIT ? OFFSET ?
    `;

    db.query(

        sql,

        [

            userId,

            limit,

            offset

        ],

        callback

    );

};

const getStatementData = (

    userId,

    callback

) => {

    const sql = `
        SELECT

            users.name,

            users.email,

            accounts.account_number,

            accounts.balance,

            transactions.type,

            transactions.amount,

            transactions.description,

            transactions.created_at

        FROM users

        JOIN accounts

        ON users.id = accounts.user_id

        LEFT JOIN transactions

        ON accounts.account_number = transactions.account_number

        WHERE users.id = ?

        ORDER BY transactions.created_at DESC
    `;

    db.query(

        sql,

        [

            userId

        ],

        callback

    );

};

const getSummary = (

    userId,

    callback

) => {

    const sql = `

        SELECT

            a.balance,

            COALESCE(

                SUM(

                    CASE

                        WHEN t.type='Deposit'

                        THEN t.amount

                        ELSE 0

                    END

                ),

                0

            ) AS totalDeposit,

            COALESCE(

                SUM(

                    CASE

                        WHEN t.type='Withdraw'

                        THEN t.amount

                        ELSE 0

                    END

                ),

                0

            ) AS totalWithdraw,

            COALESCE(

                SUM(

                    CASE

                        WHEN t.type='Transfer'

                        THEN t.amount

                        ELSE 0

                    END

                ),

                0

            ) AS totalTransfer

        FROM accounts a

        LEFT JOIN transactions t

        ON a.account_number = t.account_number

        WHERE a.user_id = ?

        GROUP BY a.balance

    `;

    db.query(

        sql,

        [

            userId

        ],

        callback

    );

};

const getTransactionsByPage = (

    userId,

    limit,

    offset,

    callback

) => {

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

        LIMIT ?

        OFFSET ?

    `;

    db.query(

        sql,

        [

            userId,

            Number(limit),

            Number(offset)

        ],

        callback

    );

};

const searchTransactions = (

    userId,

    keyword,

    callback

) => {

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
        WHERE
            accounts.user_id = ?
            AND
            (
                transactions.type LIKE ?
                OR
                transactions.description LIKE ?
            )
        ORDER BY transactions.created_at DESC
    `;

    db.query(

        sql,

        [

            userId,

            `%${keyword}%`,

            `%${keyword}%`

        ],

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

    getTransactions,

    getStatementData,

    getSummary,

    searchTransactions,

    getTransactionsByPage

};