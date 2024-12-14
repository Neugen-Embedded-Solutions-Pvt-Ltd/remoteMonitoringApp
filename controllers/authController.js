import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/emailConfigure.js";
import Helpers from "../utils/helpers.js";

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
        return res.status(404).send({
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
        status: 201,
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
      res.status(200).send({
        status: 200,
        message: "User logged in successfully",
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

  // forgot Password genrating link and providing to Client
  forgotPassword: async (req, res) => {
    try {
      const { username, email } = req.body;
      let response;
      if (email) {
        response = await User.findByemail(email);
      } else {
        response = await User.findByUsername(username);
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
  resetPassword: async (req, res) => {
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

      await User.updatePassword(options);
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
