import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Helpers from "../../utils/helpers.js";
import User from "../models/UserModel.js";
import Device from "../models/DeviceModel.js";



import { sendEmail } from "../config/emailConfigure.js";
import {
  UserExistsError,
  DeviceNotRegisteredError,
  UserNotFoundError,
  InvalidCredentialsError,
  EmailSendError,
  InvalidTokenOrExpired,
} from "../../utils/AppError.js";

await User.sync({ alter: true });

const AuthService = {
  //  Function to allow users to Register
  userRegistrationService: async (UserData) => {
    const { username, device_id, email, password } = UserData;
    let findUser = await User.findOne({ where: { username: username } }); //findUserByUsername(username);
    let findUserByEmail = await User.findOne({ where: { email: email } }); //findUserByEmail(email);

    // validating user already exist
    if (findUser != null || findUserByEmail != null) {
      throw new UserExistsError();
    };

    let getDeviceId = await Device.findOne({ where: { device_id: device_id } });
    if (getDeviceId == null) {
      throw new DeviceNotRegisteredError();
    }

    // Password Hashing
    const hashedPassword = bcrypt.hashSync(password, 8);
    let user = await User.create({
      ...UserData,
      password: hashedPassword,
    }); // store details databases

    // Remove password from user object
    const data = Array.isArray(user.dataValues)
      ? user.dataValues
      : [user.dataValues];
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

  //  Function to allow users to login
  loginUserService: async ({ username, password }) => {
    const user = await User.findOne({ where: { username: username } }); // Find user by username
    if (user == null) throw new UserNotFoundError(); // If user not found throw error

    // Password comparison using bcrypt
    const passwordIsValid = bcrypt.compareSync(password, user.password); // decrypt the password
    if (!passwordIsValid) throw new InvalidCredentialsError();

    // Token generation
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
    const data = Array.isArray(user.dataValues)
      ? user.dataValues
      : [user.dataValues];

    const sanitizedData = data.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });

    return {
      token,
      sanitizedData,
    };
  },

  // Function to allow users to send resetpassword link to email
  sendResetLinkToUser: async ({ username, email }) => {
    let response;
    if (email) {
      response = await User.findOne({ where: { email: email } });
    } else {
      response = await User.findOne({ where: { username: username } });
    }

    if (response == null) {
      throw new UserNotFoundError();
    }
    const token = jwt.sign({ id: response.username }, process.env.JWT_SECRET, {
      expiresIn: 1200000,
    });

    const forgotPasswordLink = `${process.env.CLIENT_URL}/?token=${token}`;

    let options = {
      to: response.email,
      subject: "Password Reset Link",
      message: `<h2>Your Link for reset password <a href='${forgotPasswordLink}' target="_blank"'>reset password</a> </h2>`,
    };

    let result = await sendEmail(options); // email template for share reset password link
    return {
      token: token,
      link: forgotPasswordLink,
      success: result ? true : false,
    };
  },

  // Function to allow users to resetpassword from email link
  resetPassword: async ({ password, token }) => {
    const result = await Helpers.tokenValidate(token);
    if (!result) {
      throw new InvalidTokenOrExpired();
    }
    let UserInfo = {
      username: result.id,
      password: bcrypt.hashSync(password, 8),
    };
    let user = await User.findOne({ where: { username: UserInfo.username } });
    if (user) {
      await user.update(UserInfo);
    } else {
      throw new UserNotFoundError();
    }
    if (!user) throw new EmailSendError();
    return true;
  },
};

export default AuthService;
