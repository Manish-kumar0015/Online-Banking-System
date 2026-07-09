const db = require("../config/db");

// Create a new user record during registration
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

// Create a new bank account with zero initial balance
const createAccount = (userId, accountType, callback) => {

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

// Retrieve complete dashboard information by joining user and account details
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

// Find a user using their registered email address
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

// Fetch basic user profile information using user ID
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

// Update user profile details such as name, email, address and profile image
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

// Update only the user's profile picture
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

// Change password for an authenticated user
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

// Reset password after successful OTP verification
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