import query from '../config/database.js';
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

    getDeviceId: async (device_id) => {
        try {
            const sql = 'SELECT device_id FROM devices WHERE device_id = ?';
            const result = await query(sql, [device_id]);
            return result
        } catch (e) {

        }
    }
}

export default User;