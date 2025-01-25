import AuthService from "../services/authservice.js";
import { AppError } from "../../utils/AppError.js"; 

const authController = {
  // Register user
  userRegistration: async (req, res) => {
    try {
      const result = await AuthService.userRegistrationService(req.body); 
      res.status(201).send({
        status: 201,
        message: "user created successfully",
        data: result.passwordRemoved,
        accessToken: result.accessToken,
        refreshToken: result.longTermRefreshToken,
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

  // API for Login
  loginUser: async (req, res) => {
    try {
      const result = await AuthService.loginUserService(req.body);
      res.status(200).send({
        status: 200,
        message: "User logged in successfully",
        data: result.passwordRemoved,
        accessToken: result.accessToken,
        refreshToken: result.longTermRefreshToken,
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

  // forgot Password generating link and providing to Client
  sendPasswordResetLink: async (req, res) => {
    try {
      console.log(req.body);
      let response = await AuthService.sendResetLinkToUser(req.body);
      return res.status(200).send({
        status: 200,
        message: "Password reset link sent to your email",
        response,
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

  // update password from Email
  resetPassword: async (req, res) => {
    try {
      let response = await AuthService.resetPassword(req.body);
      if (response)
        return res.status(200).send({
          status: 200,
          message: "Password updated successfully",
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

  refreshToken: async (req, res) => {
    try {
      let refreshToken = req.headers["refreshToken"]; 
      const response = await AuthService.refreshTokenService(refreshToken);
      if (response)
        return res.status(200).send({
          status: 200,
          message: "Access token sent successful",
          accessToken: response,
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
};

export default authController;
