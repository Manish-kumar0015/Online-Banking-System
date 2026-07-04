
const mysql = require("mysql2");

const connection = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "Root@47",

    database: "online_banking",
    
    multipleStatements:true

});

connection.connect((err)=>{

if(err){

console.log("Database Connection Failed");

console.log(err);

return;

}

console.log("MySQL Connected");

});

module.exports = connection;