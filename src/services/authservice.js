import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { sendEmail } from "../config/emailConfigure.js";
import Helpers from "../../utils/helpers.js";

import {
  UserExistsError,
  DeviceNotRegisteredError,
  UserNotFoundError,
  InvalidCredentialsError,
  EmailSendError,
  InvalidTokenorExipred,
} from "../../utils/AppError.js";

const AuthService = {
  registeruserService: async (UserData) => {
    const { username, device_id, email, password } = UserData;

    let findUser = await User.findUserByUsername(username);
    let findUserByEmail = await User.findUserByEmail(email);
    console.log("findUser:", findUser);
    console.log("findUserByEmail:", findUserByEmail);
    // validating user already exist
    if (findUser.length != 0 || findUserByEmail.length != 0) {
      throw new UserExistsError();
    }
    console.log("running");
    // Checking registered Device id
    let getDeviceId = await User.fetchDeviceById(device_id);
    if (getDeviceId == 0) {
      throw new DeviceNotRegisteredError();
    }

    // Password Hashing
    const hashedPassword = bcrypt.hashSync(password, 8);
    let user = await User.insertNewUser({
      ...UserData,
      password: hashedPassword,
    }); // store details databases
    console.log("user", user);
    console.log("findUser:", findUser);
    if (user.affectedRows > 0) {
      const userResult = await User.fetchUserById(user.insertId);

      // returing same user detail
      user = userResult[0];
    }

    // Remove password from user object
    const data = Array.isArray(user) ? user : [user];
    const sanitizedData = data.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });

    // Generate JWT by using username
    const token = jwt.sign(
      { id: username },
      process.env.JWT_SECRET,
      { expiresIn: 86400 } // 24 hours
    ); // generate JWT token

    return {
      sanitizedData,
      token,
    };
  },

  //   Login user Service
  loginUserService: async ({ username, password }) => {
    // Find user by username
    const user = await User.findUserByUsername(username); // login with email

    // If user not found throw error
    if (user.length === 0) throw new UserNotFoundError();

    // Password comparison using bcrypt
    const passwordIsValid = bcrypt.compareSync(password, user.password); // decrypt the password
    if (!passwordIsValid) throw new InvalidCredentialsError();

    // Token genration
    const token = jwt.sign(
      {
        id: username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    // Removing user password from user object
    const data = Array.isArray(user) ? user : [user];
    const sanitizedData = data.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });

    // return the token & user details
    return {
      token,
      sanitizedData,
    };
  },
  // password reset to user email
  sendResetLinkToUser: async ({ username, email }) => {
    let response;
    if (email) {
      response = await User.findUserByEmail(email);
    } else {
      response = await User.findUserByUsername(username);
    }
    console.log(response);
    if (response.length === 0) {
      throw new UserNotFoundError();
    }
    const token = jwt.sign({ id: response.username }, process.env.JWT_SECRET, {
      expiresIn: 1200000,
    });
    const forgotPasswordLink = `${process.env.CLIENT_URL}/?token=${token}`;
    console.log(forgotPasswordLink);
    let options = {
      to: response.email,
      subject: "Password Reset Link",
      message: `<h2>Your Link for reset password <a href='${forgotPasswordLink}' target="_blank"'>reset password</a> </h2>`,
    };
    console.log(options);
    let result = await sendEmail(options); // email template for share reset password link
    return {
      token: token,
      link: forgotPasswordLink,
      sucess: result ? true : false,
    };
  },

  // Resetpassword using token and password

  resetPassword: async ({ password, token }) => {
    console.log(token);
    const result = await Helpers.tokenValidate(token);
    console.log(result);
    if (!result) {
      throw new InvalidTokenorExipred();
    }

    let options = {
      username: result.id,
      password: bcrypt.hashSync(password, 8),
    };

    let response = await User.updateUserPassword(options);
    if (!response) throw new EmailSendError();

    return true;
  },
};

export default AuthService;
