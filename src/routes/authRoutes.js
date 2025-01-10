import express from "express";
import authController from "../controllers/authController.js"; 

const AuthRoute = express.Router(); 

// Authentication Routes
AuthRoute.post("/register", authController.registerUser); //User register
AuthRoute.post("/login", authController.loginUser); // User login
AuthRoute.post("/forgot-password", authController.sendPasswordResetLink); // User forgot password
AuthRoute.put("/resetpassword", authController.resetPasswordWithToken); // User forgot password

export default AuthRoute;
