import express from "express";
import authController from "../controllers/authController.js"; 

const AuthRoute = express.Router(); 
 
AuthRoute.post("/register", authController.userRegistration);
AuthRoute.post("/login", authController.loginUser);
AuthRoute.post("/forgotpassword", authController.sendPasswordResetLink);
AuthRoute.put("/resetpassword", authController.resetPassword);
export default AuthRoute;
