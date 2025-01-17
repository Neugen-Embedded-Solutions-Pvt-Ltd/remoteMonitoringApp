import express from "express";
import authController from "../controllers/authController.js"; 

const AuthRoute = express.Router(); 
 
AuthRoute.post("/register", authController.userRegistration);
AuthRoute.post("/login", authController.loginUser);
AuthRoute.post("/forgot-password", authController.sendPasswordResetLink); // User forgot password
AuthRoute.put("/resetpassword", authController.resetPassword); // User forgot password

export default AuthRoute;
