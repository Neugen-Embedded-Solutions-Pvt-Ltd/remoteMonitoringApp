import express from "express";
import authController from "../controllers/authController.js"; 

const AuthRoute = express.Router(); 
 
AuthRoute.post("/register", authController.userRegistration); //User register
AuthRoute.post("/login", authController.loginUser); // User login
AuthRoute.post("/forgot-password", authController.sendPasswordResetLink); // User forgot password
AuthRoute.put("/resetpassword", authController.resetPassword); // User forgot password

export default AuthRoute;
