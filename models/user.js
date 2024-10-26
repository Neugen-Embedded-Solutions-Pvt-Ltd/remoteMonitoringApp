const db = require('../config/database');
const util = require('util');

const query = util.promisify(db.query).bind(db);

// User model for to store in db queries
const User = {
    // user registration
    create: async (userData) => {
        try {
            const insertUserQuery = 'INSERT INTO users (device_id, firstName, lastName, email, password) VALUES(?, ?, ?, ?, ?)';
            console.log(userData);
            let valuess = Object.values(userData);
            console.log(valuess);
            let result = await query(insertUserQuery, [
                userData.device_id,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.password
            ])
            return result;
        } catch (e) {
            console.log(e)
            throw new Error('Network timeout Error')
        }
    },

    //user login
    findByEmail: async (email) => {
        try {
            console.log(email);
            const sql = 'SELECT * FROM users WHERE email = ?';
            const result = await query(sql, [email]);

            return result;
        } catch (e) {
            console.error('Error fetching user by email:', e.message); // More specific error message
            throw new Error('Error fetching user by email');
        }

    },
    // Get All users data
    GetAllUser: async () => {
        try {
            const sql = 'SELECT * FROM users';
            let response = await query(sql)
            return response; 
        } catch (error) {
            console.log("Error getting user data", error);
            res.send({
                status: 500,
                message: 'Error getting all user data',
            })
        }
    },
    // sent OTP (not implemented)
    sendOTP: async (otpParam) => {

        try {
            const sql = "INSERT INTO otps (email, otp) VALUES(?, ?)";
            const values = [otpParam.email, otpParam.otp];

            const result = await query(sql, values, );
            return result
        } catch (e) {
            console.log(e)
            throw new Error('Network timeout Error')
        }
    },

    // validate OTP (not implemented)
    validateOtp: async (otpParam) => {

        try {
            const sql = `SELECT email from otps WHERE email = ? AND otp= ?`;
            const result = await query(sql, [otpParam.email, otpParam.otp]);
            return result;
        } catch (e) {
            console.log(e)
            throw new Error('Network timeout Error')
        }

    }
}

module.exports = User;