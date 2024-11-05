const query = require('../config/database');


// User model for to store in db queries
const User = {
    // user registration
    create: async (userData) => {
        try {
            const insertUserQuery = 'INSERT INTO users (username, device_id, firstName, lastName, email, password) VALUES(?, ?, ?, ?, ?, ?)';
            console.log(userData);
            let valuess = Object.values(userData);
            console.log(valuess);
            let result = await query(insertUserQuery, [
                userData.username,
                userData.device_id,
                userData.firstName,
                userData.lastName,                
                userData.email,
                userData.password
            ])
            return result;
        } catch (e) {
            console.log('error in query')
            throw new Error('Network timeout Error')
        }
    },

    //user login
    findByUsername: async (username) => {
        try {
            const sql = 'SELECT * FROM users WHERE username = ?';
            const result = await query(sql, [username]);
           
            return result;
        } catch (e) {
            console.log('Error fetching user by username:', e.message); // More specific error message
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
            throw new Error('Network timeout Error')
        }
    },
    upadtePassword: async () => {
        try {
            const sql = 'SELECT password FROM users WHERE Password =?';
            const result = await query(sql);
            return result;
        } catch (error) {
            console.log("Error getting user data", error);
            throw new Error('Network timeout Error')
        }
    },
    // sent OTP (not implemented)
    sendOTP: async (otpParam) => {

        try {
            const sql = "INSERT INTO otps (email, otp) VALUES(?, ?)";
            const values = [otpParam.email, otpParam.otp];
            await query(sql, values);
            let getDeatilQuery = 'select otp_id from otps where email =? AND otp =?'
            const getDeatils = await query(getDeatilQuery, values)
            return getDeatils
        } catch (e) {
            console.log(e)
            throw new Error('Network timeout Error')
        }
    },

    // validate OTP (not implemented)
    validateOtp: async (otpParam) => {

        try {
            const sql = `SELECT email from otps WHERE email = ? AND otp= ?`;
            const values = [otpParam.email, otpParam.otp];
            const result = await query(sql, values);
            let getDeatilQuery = 'select otp_id from otps where email =? AND otp =?'
            const getDeatils = await query(getDeatilQuery, values)
            return getDeatils
            // return result;
        } catch (e) {
            console.log(e)
            throw new Error('Network timeout Error')
        }

    },
    getDeviceId: async (device_id) => {
        try {
            const sql = 'SELECT device_id FROM devices WHERE device_id = ?';
            const result = await query(sql, [device_id]);
            return result
        } catch (e) {

        }
    },
    deleteOtps: async (otp_id) => {
        try {
            console.log("delete otp", otp_id);
            const sql = 'DELETE from otps WHERE otp_id = ?';
            const result = await query(sql, [otp_id]);
            return result
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = User;