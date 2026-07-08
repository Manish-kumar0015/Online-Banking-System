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

const createAccount = (userId, accountType,callback) => {

    const sql = `
        INSERT INTO accounts(user_id,balance,account_type)
        VALUES(?,?,?)
    `;

    db.query(
        sql,
        [
            userId,
            0,
            accountType
        ],
        callback
    );

};

const getDashboard = (userId, callback) => {

    const sql = `
        SELECT

            users.name,

            users.email,

            users.address,

            users.profile_image,

            accounts.account_number,

            accounts.balance,

            accounts.account_type,

            accounts.ifsc_code,

            accounts.branch,

            accounts.created_on

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

const getUserById = (

    userId,

    callback

) => {

    const sql = `
    SELECT
        name,
        email,
        address,
        profile_image
    FROM users
    WHERE id = ?
    `;

    db.query(

        sql,

        [

            userId

        ],

        callback

    );

};

const updateProfile = (

    userId,

    name,

    email,

    address,

    profileImage,

    callback

) => {

    const sql = `

        UPDATE users

        SET

            name = ?,

            email = ?,

            address = ?,

            profile_image = ?

        WHERE id = ?

    `;

    db.query(

        sql,

        [

            name,

            email,

            address,

            profileImage,

            userId

        ],

        callback

    );

};

const updateProfileImage = (

    userId,

    imagePath,

    callback

) => {

    const sql = `

        UPDATE users

        SET profile_image = ?

        WHERE id = ?

    `;

    db.query(

        sql,

        [

            imagePath,

            userId

        ],

        callback

    );

};

const updatePassword = (

    userId,

    password,

    callback

) => {

    const sql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
    `;

    db.query(

        sql,

        [

            password,

            userId

        ],

        callback

    );

};

const resetPassword = (

    email,

    password,

    callback

) => {

    const sql = `
        UPDATE users
        SET password = ?
        WHERE email = ?
    `;

    db.query(

        sql,

        [

            password,

            email

        ],

        callback

    );

};


module.exports = {

    createUser,

    createAccount,

    findUserByEmail,

    getUserById,

    getDashboard,

    updateProfile,

    updateProfileImage,

    updatePassword,

    resetPassword

};