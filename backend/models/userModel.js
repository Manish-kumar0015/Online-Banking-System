const db = require("../config/db");

const createUser = (userData, callback) => {

    const sql = `
        INSERT INTO users(name,email,password)
        VALUES(?,?,?)
    `;

    db.query(
        sql,
        [
            userData.name,
            userData.email,
            userData.password
        ],
        callback
    );

};

const createAccount = (userId, callback) => {

    const sql = `
        INSERT INTO accounts(user_id,balance)
        VALUES(?,?)
    `;

    db.query(
        sql,
        [
            userId,
            0
        ],
        callback
    );

};

const getDashboard = (userId, callback) => {

    const sql = `
        SELECT
            users.name,
            users.email,
            accounts.account_number,
            accounts.balance
        FROM users
        JOIN accounts
        ON users.id = accounts.user_id
        WHERE users.id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};

const findUserByEmail = (email, callback) => {

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        callback
    );

};

const updateProfile = (

    userId,

    name,

    callback

) => {

    const sql = `
        UPDATE users
        SET name = ?
        WHERE id = ?
    `;

    db.query(

        sql,

        [

            name,

            userId

        ],

        callback

    );

};

module.exports = {

    createUser,

    createAccount,

    findUserByEmail,

    getDashboard,

    updateProfile

};