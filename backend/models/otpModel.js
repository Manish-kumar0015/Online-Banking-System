
const db = require("../config/db");

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