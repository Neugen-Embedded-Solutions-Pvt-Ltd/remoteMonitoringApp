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
  /**
   * Registers a new user in the system.
   *
   * @async
   * @param {Object} UserData - The data of the user to register.
   * @param {string} UserData.username - The username of the user.
   * @param {string} UserData.password - The password of the user.
   * @param {string} UserData.device_id - The device ID associated with the user.
   * @param {string} UserData.email - The email address of the user.
   * @param {string} UserData.first_name - The first name of the user.
   * @param {boolean} UserData.admin_user - Indicates if the user is an admin.
   * @throws {FieldsNotFound} If any required field is missing or undefined.
   * @throws {UserExistsError} If a user with the same username or email already exists.
   * @throws {DeviceNotRegisteredError} If the device ID is not registered.
   * @throws {AppError} If there is an error during user registration.
   * @returns {Object} An object containing the created user data (excluding password) and an access token.
   */
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

  /**
   * Authenticates a user by verifying the provided username and password.
   *
   * @async
   * @function loginUserService
   * @param {Object} credentials - The user's login credentials.
   * @param {string} credentials.username - The username of the user.
   * @param {string} credentials.password - The password of the user.
   * @throws {FieldsNotFound} If the username or password is missing.
   * @throws {UserNotFoundError} If the user is not found in the database.
   * @throws {InvalidCredentialsError} If the password is incorrect.
   * @returns {Object} An object containing the access token and user data without the password.
   */
  loginUserService: async ({ user, password }) => {
    if (!user || !password) {
      throw new FieldsNotFound(
        "Required fields (email or username, password) cannot be empty or undefined"
      );
    }
    let UserEmailValidate = Helpers.validateEmail(user); 
  
    if (UserEmailValidate) {
      user = await User.findOne({ where: { email: user } });
    } else { 
      user = await User.findOne({ where: { username: user } });
    }
    if (user == null) throw new UserNotFoundError();
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) throw new InvalidCredentialsError();
    const accessToken = Helpers.generateAccessToken(user);
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

  /**
   * Sends a password reset link to the user's email.
   *
   * @async
   * @function sendResetLinkToUser
   * @param {Object} param0 - The input object.
   * @param {string} param0.email - The email address of the user.
   * @throws {FieldsNotFound} If the email field is empty or undefined.
   * @throws {UserNotFoundError} If no user is found with the provided email.
   * @returns {Promise<Object>} An object containing the token, reset link, and success status.
   */
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

  /**
   * Resets the user's password using the provided token and new password.
   *
   * @async
   * @function
   * @param {Object} params - The parameters for resetting the password.
   * @param {string} params.password - The new password to set.
   * @param {string} params.token - The token to validate the password reset request.
   * @throws {FieldsNotFound} If the token or password is missing.
   * @throws {InvalidTokenOrExpired} If the token is invalid or expired.
   * @throws {UserNotFoundError} If the user is not found in the database.
   * @throws {EmailSendError} If there is an error sending the email.
   * @returns {boolean} Returns true if the password was successfully reset.
   */
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
