// configuration for Databases

import  mysql from 'mysql';
import  dotenv from 'dotenv';
import  util from 'util';
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
});
import  tableQueries from '../schemas/schma.js';

// create connection to database
const db = mysql.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
});

const query = util.promisify(db.query).bind(db); // remove promise method from codebase, which is older method

// establish the connection 
db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log('Database connection ready');
});

// create the table if not already created & selfinvoking
(async () => {
    try {
        await query(tableQueries.userQuery);
    } catch (error) {
        console.log(error);
    }
})();

export default query;