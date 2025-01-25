import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Helpers from "../../utils/helpers.js";
import { sendEmail } from "../config/emailConfigure.js";
import User from "../models/UserModel.js";
import Device from "../models/DeviceModel.js";
import UserToken from "../models/TokenModel.js";
import {
  UserExistsError,
  DeviceNotRegisteredError,
  UserNotFoundError,
  InvalidCredentialsError,
  EmailSendError,
  InvalidTokenOrExpired,
} from "../../utils/AppError.js";
// await User.sync({ alter: true });

const AuthService = {
  //  Function to allow users to Register
  userRegistrationService: async (UserData) => {
    const { username, device_id, email, password } = UserData;
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
    const hashedPassword = bcrypt.hashSync(password, 8);
    let user = await User.create({
      ...UserData,
      password: hashedPassword,
    });
    const userData = Array.isArray(user.data) ? user.data : [user.data];
    const passwordRemoved = userData.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });
    const accessToken = Helpers.generateAccessToken(username);
    const longTermRefreshToken = Helpers.generateRefreshToken(username);
    return {
      passwordRemoved,
      accessToken,
      longTermRefreshToken,
    };
  },

  //  Function to allow users to login
  loginUserService: async ({ username, password }) => {
    const user = await User.findOne({ where: { username: username } });
    if (user == null) throw new UserNotFoundError();
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) throw new InvalidCredentialsError();
    const accessToken = Helpers.generateAccessToken(username);
    const longTermRefreshToken = Helpers.generateRefreshToken(username);
    let response = await UserToken.findOne({ where: { username: username } });
    if (response) {
      await UserToken.destroy({
        where: { username: username },
      });
    }
    await UserToken.create({
      username: username,
      refresh_token: longTermRefreshToken,
    });
    const userData = Array.isArray(user.data) ? user.data : [user.data];
    const passwordRemoved = userData.map((user) => {
      return Object.keys(user)
        .filter((key) => key !== "password")
        .reduce((obj, key) => {
          obj[key] = user[key];
          return obj;
        }, {});
    });
    return {
      accessToken,
      longTermRefreshToken,
      passwordRemoved,
    };
  },

  // Function to allow users to send resetpassword link to email
  sendResetLinkToUser: async ({ email }) => {
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
    console.log(password, token);
    const result = await Helpers.validateAccessToken(token);
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

  // Refresh token request link
  refreshTokenService: async (refreshToken) => {
    const findRefreshToken = await UserToken.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!findRefreshToken) {
      throw new InvalidTokenOrExpired();
    }
    const validatedRefreshToken = Helpers.verifyRefreshToken(refreshToken);
    if (!validatedRefreshToken) {
      throw new InvalidTokenOrExpired();
    }
    const accessToken = Helpers.generateAccessToken(validatedRefreshToken.id);
    return accessToken;
  },
};

export default AuthService;
