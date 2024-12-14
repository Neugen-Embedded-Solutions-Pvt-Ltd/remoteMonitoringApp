// configuration for Databases 
import mysql from "mysql";
import dotenv from "dotenv";
import util from "util";
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
import tableQueries from "../schemas/schma.js";

// Create connection to database
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as needed
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
});

const query = util.promisify(pool.query).bind(pool);  // remove promise method from codebase, which is older method

// Establish the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    throw err; // You might want to handle this more gracefully in production
  }
  console.log("Database connection ready");
  connection.release(); // Release the connection back to the pool
});


// create the table if not already created & selfinvoking
(async () => {
  try {
    await query(tableQueries.userQuery); // create table for Users
    await query(tableQueries.temperatureQuery); // create table for Temperature for device
    await query(tableQueries.temperatureRecorsQuery); // create table for Temperature for global temperature
  } catch (error) {
    console.log("Error creating tables:", error);
  }
})();

export default query;