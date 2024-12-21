import query from "../config/database.js";
// User model for to store in db queries
const User = {
  // user registration
  insertNewUser: async (userData) => {
    try {
      const insertUserQuery =
        "INSERT INTO users (username, device_id, firstName, lastName, email, password) VALUES(?, ?, ?, ?, ?, ?)";
      let result = await query(insertUserQuery, [
        userData.username,
        userData.device_id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      ]);
      if (result.length > 0) {
        return result[0]; // Return the first user object
      } else {
        return result; // More specific error message
      }
    } catch (e) {
      console.log("error in query");
      throw new Error("Network timeout Error");
    }
  },

  //user login
  findUserByUsername: async (username) => {
    try {
      //json_object('username', username) FROM users;
      const sql = "SELECT * FROM users WHERE username = ?";
      const result = await query(sql, [username]);
      // Check if a user was found and return the first result
      if (result.length > 0) {
        return result[0]; // Return the first user object
      } else {
        return result; // More specific error message
      }
    } catch (e) {
      console.log("Error fetching user by username:", e.message); // More specific error message
      console.error("Detailed error:", e);
      throw new Error("Network timeout Error");
    }
  },
  // Get All users data
  fetchAllUsers: async () => {
    try {
      const sql = "SELECT * FROM users";
      let response = await query(sql);
      return response;
    } catch (error) {
      console.log("Error getting user data", error);
      throw new Error("Network timeout Error");
    }
  },

  // get Devive id is registered
  fetchDeviceById: async (device_id) => {
    try {
      const sql = "SELECT device_id FROM devices WHERE device_id = ?";
      const result = await query(sql, [device_id]);
      return result;
    } catch (e) {}
  },

  // Reset password
  updateUserPassword: async (userinfo) => {
    try {
      const sql = "UPDATE users SET password = ? WHERE username= ?";
      const result = await query(sql, [userinfo.password, userinfo.username]);
      return result;
    } catch (error) {
      console.log("error in query");
      throw new Error("Network timeout Error");
    }
  },

  //find user by email
  findUserByEmail: async (email) => {
    try {
      //json_object('email', email) FROM users;
      const sql = "SELECT * FROM users WHERE email = ?";
      const result = await query(sql, [email]);
      // Check if a user was found and return the first result
      if (result.length > 0) {
        return result[0]; // Return the first user object
      } else {
        return result; // More specific error message
      }
      //   return result;
    } catch (e) {
      console.log("Error fetching user by email:", e.message); // More specific error message
      throw new Error("Network timeout Error");
    }
  },
};

export default User;
