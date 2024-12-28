import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/emailConfigure.js";
import Helpers from "../utils/helpers.js";

const authController = {
  // Register user
  registerUser: async (req, res) => {
    try {
      const { username, device_id, email, password } =
        req.body;

      let findUser = await User.findUserByUsername(username);
      let findUserByEmail = await User.findUserByEmail(email);
      if (findUser.length != 0 || findUserByEmail.length != 0) {
        return res.status(409).send({
          status: 409,
          message: "User already exist",
        });
      }
      // Checking registred Device id 
      let getDeviceId = await User.fetchDeviceById(device_id);
      if (getDeviceId == 0) {
        return res.status(404).send({
          status: 404,
          message: "Device is not registered",
        });
      }

      // Pasoword making Hash
      const hasedPassword = bcrypt.hashSync(password, 8);
      let user = await User.insertNewUser({ ...req.body, password: hasedPassword }); // store details databases

      // Remove password from user object
      const data = Array.isArray(user) ? user : [user];
      const sanitizedData = data.map((user) => {
        return Object.keys(user)
          .filter((key) => key !== 'password')
          .reduce((obj, key) => {
            obj[key] = user[key];
            return obj;
          }, {});
      });

      // Generate JWT by using username
      const token = jwt.sign({ id: username }, process.env.JWT_SECRET, { expiresIn: 86400, }// 24 hours
      ); // generate JWT token

      // returing token and user deatils to clinet
      res.status(201).send({
        status: 201,
        message: "user created successfully",
        token: token,
        data: sanitizedData
      });

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "error register user",
      });
    }
  },

  // API for Login
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user by username
      const user = await User.findUserByUsername(username); // login with email
      if (user.length === 0)
        return res.status(404).send({
          status: 404,
          message: "User not found",
        });
      const passwordIsValid = bcrypt.compareSync(password, user.password); // decrypt the password
      if (!passwordIsValid)
        return res
          .status(403)
          .send({ status: 403, message: "Invalid credentials." });

      const token = jwt.sign(
        {
          id: username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 24 hours
        }
      ); // generate JWT token
      // delete (user.password); //

      const data = Array.isArray(user) ? user : [user];
      const sanitizedData = data.map((user) => {
        return Object.keys(user)
          .filter((key) => key !== 'password')
          .reduce((obj, key) => {
            obj[key] = user[key];
            return obj;
          }, {});
      });

      res.status(200).send({
        status: 200,
        message: "User logged in successfully",
        auth: true,
        data: sanitizedData,
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
  fetchAllUsers: async (req, res) => {
    try {
      let allUsersdata = await User.fetchAllUsers();
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

  // forgot Password genrating link and providing to Client
  sendPasswordResetLink: async (req, res) => {
    try {
      const { username, email } = req.body;
      let response;
      if (email) {
        response = await User.findUserByEmail(email);
      } else {
        response = await User.findUserByUsername(username);
      }
      console.log(response);
      if (response.length === 0) {
        return res.status(409).send({
          status: 409,
          message: "User not found, create new account",
        });
      }
      const token = jwt.sign(
        { id: response.username },
        process.env.JWT_SECRET,
        { expiresIn: 120 }
      );
      const forgotPasswordLink = `${process.env.CLIENT_URL}/?token=${token}`;
      console.log(forgotPasswordLink);
      let options = {
        to: response.email,
        subject: "Password Reset Link",
        message: `<h2>Your Link for reset password <a href='${forgotPasswordLink}' target="_blank"'>reset password</a> </h2>`,
      };
      console.log(options);
      await sendEmail(options); // email template for share reset password link
      return res.status(200).send({
        status: 200,
        message: "reset password link sent to your email",
        token: token,
        link: forgotPasswordLink
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        message: "Error updating password",
      });
    }
  },

  // update password from Email
  resetPasswordWithToken: async (req, res) => {
    try {
      const { token, password } = req.body;

      const result = await Helpers.tokenValidate(token);
      console.log(result);
      if (!result) {
        return res.status(403).send({
          status: 403,
          message: "Invalid token or expired token",
        });
      }

      let options = {
        username: result.id,
        password: bcrypt.hashSync(password, 8),
      };

      await User.updateUserPassword(options);
      return res.status(200).send({
        status: 200,
        message: "Password updated successfully",
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error updating password",
      });
    }
  },
};

export default authController;
