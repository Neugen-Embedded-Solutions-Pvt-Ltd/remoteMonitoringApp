import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const authController = {
  // Register user
  register: async (req, res) => {
    try {
      const { username, device_id, firstName, lastName, email, password } =
        req.body;

      let findUser = await User.findByUsername(username);
      // if (findUser.length == 0) {
      //   return res.send({
      //     status: 400,
      //     message: 'User input not defined'
      //   });
      // }
      if (findUser.length != 0) {
        return res.status(409).send({
          status: 409,
          message: "User already exist",
        });
      }
      let getDeviceId = await User.getDeviceId(device_id);

      if (getDeviceId == 0) {
        return res.status(401).send({
          status: 404,
          message: "Device is not registered",
        });
      }
      const hasedPassword = bcrypt.hashSync(password, 8);
      await User.create({
        username,
        device_id,
        firstName,
        lastName,
        email,
        password: hasedPassword,
      }); // store details databases
      // Generate JWT
      const token = jwt.sign(
        {
          id: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      ); // generate JWT token
      res.status(201).send({
        status: 200,
        message: "user created successfully",
        token: token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "error register user",
      });
    }
  },

  // API for Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findByUsername(username); // login with email
      if (user.length === 0)
        return res.status(404).send({
          status: 404,
          message: "User not found",
        });
      const passwordIsValid = bcrypt.compareSync(password, user.password); // decrypt the password
      if (!passwordIsValid)
        return res
          .status(401)
          .send({ status: 401, message: "Invalid credentials." });

      const token = jwt.sign(
        {
          id: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      ); // generate JWT token
      res.status(200).send({
        status: 200,
        message: "User logedin",
        auth: true,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Error logging in.",
      });
    }
  },

  // Get All users data
  GetAllUsers: async (req, res) => {
    try {
      let allUsersdata = await User.GetAllUser();
      // remove password from user object
      const results = allUsersdata.map((user) => {
        return Object.keys(user)
          .filter((key) => !key.includes("password"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: user[key],
            });
          }, {});
      });

      if (allUsersdata != 0) {
        return res.send({
          status: 200,
          message: "All users data",
          data: results,
        });
      } else {
        return res.send({
          status: 400,
          message: "No users data",
        });
      }
    } catch (error) {
      console.log("Error getting user data", error);
      res.send({
        status: 500,
        message: "Error getting all user data",
      });
    }
  },
};

export default authController;
