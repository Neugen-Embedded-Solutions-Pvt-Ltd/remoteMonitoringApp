// configuration for Databases

const mysql = require('mysql');
const dotenv = require('dotenv'); 
dotenv.config({path : `.env.${process.env.NODE_ENV}`});
const tableQueries = require('../schemas/schma');
const util = require('util');

const db = mysql.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
});
const query = util.promisify(db.query).bind(db);
db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log('Database connection ready');
});
(async() =>{
    try {
        let result = await query(tableQueries.userQuery);
        console.log(result);
     } catch (error) {
         console.log(error);
     }
})();
 
module.exports = db;