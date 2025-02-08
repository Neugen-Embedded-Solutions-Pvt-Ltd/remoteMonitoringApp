import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Helpers from "../../utils/helpers.js";
import { sendEmail } from "../config/emailConfigure.js";
import User from "../models/UserModel.js";
import Device from "../models/DeviceModel.js";
import {
  UserExistsError,
  DeviceNotRegisteredError,
  UserNotFoundError,
  InvalidCredentialsError,
  EmailSendError,
  InvalidTokenOrExpired,
  FieldsNotFound,
  AppError,
} from "../../utils/AppError.js";
// await User.sync({ alter: true });
// await Device.sync({ alter: true });

const AuthService = {
  //  Function to allow users to Register
  userRegistrationService: async (UserData) => {
    const { username, password, device_id, email, first_name, admin_user } =
      UserData;
    if (
      !username ||
      !device_id ||
      !password ||
      !email ||
      !first_name ||
      admin_user === undefined
    ) {
      throw new FieldsNotFound(
        "Required fields (username, password, device_id, email, first_name, admin_user) cannot be empty or undefined"
      );
    }

    let findUserByUsername = await User.findOne({
      where: { username: username },
    });
    let findUserByEmail = await User.findOne({ where: { email: email } });
    if (findUserByUsername != null || findUserByEmail != null) {
      throw new UserExistsError();
    } 
    let getDeviceId = await Device.findOne({ where: { device_id: device_id } });
    if (getDeviceId == null) {
      throw new DeviceNotRegisteredError();
    }
    let user;
    try {
      user = await User.create({
        ...UserData,
        password: bcrypt.hashSync(UserData.password, 8),
      });
    } catch (error) {
      throw new AppError("user registration error", 404);
    }
    const userData = Array.isArray(user.dataValues)
      ? user.dataValues
      : [user.dataValues];
    const userObjectCreated = userData.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });
    const accessToken = Helpers.generateAccessToken(username);

    return {
      userObjectCreated,
      accessToken,
    };
  },

  //  Function to allow users to login
  loginUserService: async ({ username, password }) => {
    if (!username || !password) {
      throw new FieldsNotFound(
        "Required fields (username, password) cannot be empty or undefined"
      );
    }
    const user = await User.findOne({ where: { username: username } });

    if (user == null) throw new UserNotFoundError();
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) throw new InvalidCredentialsError();
    const accessToken = Helpers.generateAccessToken(username);
    const userData = Array.isArray(user.dataValues)
      ? user.dataValues
      : [user.dataValues];
    const userObjectCreated = userData.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });
    return {
      accessToken,
      userObjectCreated,
    };
  },

  // Function to allow users to send resetpassword link to email
  sendResetLinkToUser: async ({ email }) => {
    if (!email) {
      throw new FieldsNotFound(
        "Required fields (email) cannot be empty or undefined"
      );
    }
    let response = await User.findOne({ where: { email: email } });
    if (response == null) {
      throw new UserNotFoundError();
    }
    const token = jwt.sign(
      { id: response.username, email: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
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
    if (!token || !password) {
      throw new FieldsNotFound(
        "Required fields (password,token) cannot be empty or undefined"
      );
    }
    const result = await Helpers.validateAccessToken(token);

    if (result.auth === false) {
      throw new InvalidTokenOrExpired();
    }
    let UserInfo = {
      username: result.result.id,
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
