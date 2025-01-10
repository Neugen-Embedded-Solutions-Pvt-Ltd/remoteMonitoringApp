import query from "../config/database.js";
// User model for to store in db queries
const selectUserQuery = "SELECT * FROM users where id = ?";
const User = {
  // user registration
  insertNewUser: async ({
    username,
    device_id,
    first_name,
    last_name,
    email,
    password,
    admin_user,
  }) => {
    try {
      const insertUserQuery =
        "INSERT INTO users (username, device_id, first_name, last_name, email, password, admin_user) VALUES(?, ?, ?, ?, ?, ?, ?)";
      let result = await query(insertUserQuery, [
        username,
        device_id,
        first_name,
        last_name,
        email,
        password,
        admin_user,
      ]);

      if (result.affectedRows > 0) {
        const userResult = await query(selectUserQuery, [result.insertId]);
        if (userResult.length > 0) {
          return userResult[0];
        }
        throw new Error("Failed to fetch the inserted user details.");
      }
      throw new Error("Failed to insert new user.");
    } catch (e) {
      console.error("Error inserting new user:", e.message);
      throw e; // Propagate the original error instead of creating a new one
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

  // get Device id is registered
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
