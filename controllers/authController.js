import User from '../models/user.js';

const authController = {

  // Register user 
  register: async (req, res) => {
    try {
      const {
        username,
        device_id,
        firstName,
        lastName,
        email,
        password
      } = req.body;
      let findUser = await User.findByUsername(username);
      if (findUser.length != 0) {
        return res.send({
          status: 400,
          message: 'User already exist'
        });
      }
      let getDeviceId = await User.getDeviceId(device_id);

      if (getDeviceId == 0) {
        return res.send({
          status: 400,
          message: 'Device is not registered'
        });

      }
      await User.create({
        username,
        device_id,
        firstName,
        lastName,
        email,
        password
      }); // store details databses

      res.status(201).send({
        status: 200,
        message: 'user created successfully'
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: 'error register user'
      });
    }
  },

  // API for Login
  login: async (req, res) => {
    try {
      const {
        username
      } = req.body;

      // Find user by username
      const users = await User.findByUsername(username); // login with email
      if (users.length === 0)
        return res.status(404).send("User not found.");
      res.status(200).send({
        status: 200,
        message: 'User logedin',
      });
    } catch (err) {
      console.log(err)
      res.status(500).send({
        message: "Error logging in."
      });
    }
  },

  // Get All users data
  GetAllUsers: async (req, res) => {
    try {
      let allUsersdata = await User.GetAllUser();
      // remove password from user object
      const results = allUsersdata.map(user => {
        return Object.keys(user)
          .filter(key => !key.includes('password'))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: user[key]
            })
          }, {});
      })

      console.log(results);
      if (allUsersdata != 0) {
        return res.send({
          status: 200,
          message: 'All users data',
          data: results
        })
      } else {
        return res.send({
          status: 400,
          message: 'No users data'
        })
      }
    } catch (error) {
      console.log("Error getting user data", error);
      res.send({
        status: 500,
        message: 'Error getting all user data',
      })
    }
  },

}

export default authController;