// configuration for Databases

const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
const db = mysql.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
});

db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('Database connection ready');
});

module.exports = db;