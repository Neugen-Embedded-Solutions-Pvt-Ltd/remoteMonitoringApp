// configuration for Databases 
import mysql from "mysql";
import dotenv from "dotenv";
import util from "util";
import { Sequelize } from "sequelize";

if (process.env.NODE_ENV !== 'dev') {
  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
  });
} 

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
 
const configs= {
  database: "device",
  username: "root",
  password: "password",
  host: "localhost",
  dialect: "mysql",  // or 'postgres', 'sqlite', 'mariadb', 'mssql'
  port: 3306        // optional, depends on your database
};

export const sequelize = new Sequelize(
  configs.database,
  configs.username,
  configs.password,
  {
    host: configs.host,
    dialect: configs.dialect,
  }
);

export default query;