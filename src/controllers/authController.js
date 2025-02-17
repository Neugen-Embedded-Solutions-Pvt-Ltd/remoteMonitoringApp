import AuthService from "../services/authservice.js";
import { AppError } from "../../utils/AppError.js";

const authController = {
  /**
 * Handles user registration by invoking the AuthService's userRegistrationService.
 * Sends a response with the created user data and access token upon success.
 * Catches and handles errors, sending appropriate HTTP status codes and messages.
 *
 * @param {Object} req - The request object containing user registration data in the body.
 * @param {Object} res - The response object used to send back the HTTP response.
 */
  userRegistration: async (req, res) => {
    try {
      const result = await AuthService.userRegistrationService(req.body);
      res.status(201).send({
        status: 201,
        message: "user created successfully",
        data: result.userObjectCreated,
        accessToken: result.accessToken, 
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },
 
  /**
 * Handles user login requests.
 * 
 * @async
 * @function loginUser
 * @param {Object} req - The request object containing user login details.
 * @param {Object} res - The response object used to send back the HTTP response.
 * 
 * @description
 * This function attempts to log in a user using the provided credentials in the request body.
 * It calls the AuthService's loginUserService method to authenticate the user.
 * If successful, it sends a response with the user's data and an access token.
 * If an error occurs, it handles known application errors with specific status codes and messages,
 * and logs unexpected errors, returning a 500 status code for internal server errors.
 */
  loginUser: async (req, res) => {
    try {
      const result = await AuthService.loginUserService(req.body);
      res.status(200).send({
        status: 200,
        message: "User logged in successfully",
        data: result.userObjectCreated,
        accessToken: result.accessToken, 
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },

  /**
 * Handles the request to send a password reset link to the user's email.
 * 
 * @async
 * @function sendPasswordResetLink
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object to send the result.
 * 
 * @returns {Promise<void>} Sends a response with a status code and message.
 * 
 * @throws {AppError} If an application-specific error occurs.
 * @throws {Error} If an unexpected error occurs.
 */
  sendPasswordResetLink: async (req, res) => {
    try {
      await AuthService.sendResetLinkToUser(req.body);
      return res.status(200).send({
        status: 200,
        message: "Password reset link sent to your email",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },

  /**
 * Handles the password reset request by invoking the AuthService to update the user's password.
 * 
 * @async
 * @function resetPassword
 * @param {Object} req - The request object containing the password reset details.
 * @param {Object} res - The response object used to send the HTTP response.
 * @returns {Promise<void>} Sends a response with status 200 if the password is updated successfully,
 * or an error response with the appropriate status code and message if an error occurs.
 * 
 * @throws {AppError} If a known application error occurs, sends a response with the error's status code and message.
 * @throws {Error} If an unexpected error occurs, sends a response with status 500 and a generic error message.
 */
  resetPassword: async (req, res) => {
    try {
      let response = await AuthService.resetPassword(req.body);
      if (response)
        return res.status(200).send({
          status: 200,
          message: "Password updated successfully",
        });
    } catch (error) { 
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },
};

export default authController;
