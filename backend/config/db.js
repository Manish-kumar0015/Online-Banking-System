const mysql = require("mysql2");

// ==============================
// Create MySQL Database Connection
// Reads database credentials from
// environment variables (.env)
// ==============================

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT

});

// ==============================
// Connect to MySQL Database
// Logs success or error message
// when the server starts
// ==============================

db.connect((err) => {

    if(err){

        console.log(err);

    }

    else{

        console.log("Database Connected");

    }

});

// Export database connection
// so it can be used throughout
// the application

module.exports = db;