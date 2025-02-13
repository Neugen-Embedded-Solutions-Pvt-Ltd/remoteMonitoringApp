import mysql from "mysql2";
import dotenv from "dotenv"; 
import { Sequelize } from "sequelize";

if (process.env.NODE_ENV !== 'dev') {
  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
  });
};
// Create connection to database
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit as needed
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});
// Establish the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
  console.log("Database connection ready");
  connection.release();
}); 
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
); 