const db = require("../config/db");

// Save generated OTP in the database with its expiry time
const saveOTP = (

    email,

    otp,

    expiresAt,

    callback

) => {

    const sql = `
        INSERT INTO password_otps
        (
            email,
            otp,
            expires_at
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    `;

    db.query(

        sql,

        [

            email,

            otp,

            expiresAt

        ],

        callback

    );

};

// Fetch the latest OTP for verification during password reset
const verifyOTP = (

    email,

    otp,

    callback

) => {

    const sql = `
        SELECT *
        FROM password_otps
        WHERE email = ?
        AND otp = ?
        ORDER BY created_at DESC
        LIMIT 1
    `;

    db.query(

        sql,

        [

            email,

            otp

        ],

        callback

    );

};

// Remove all OTP records after successful password reset
const deleteOTP = (

    email,

    callback

) => {

    const sql = `
        DELETE
        FROM password_otps
        WHERE email = ?
    `;

    db.query(

        sql,

        [

            email

        ],

        callback

    );

};

module.exports = {

    saveOTP,
    verifyOTP,
    deleteOTP

};