import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();


router.post("/register", authController.registerUser); //User register
router.post("/login", authController.loginUser); // User login
router.post("/forgot-password", authController.sendPasswordResetLink); // User forgot password
router.put("/resetpassword", authController.resetPasswordWithToken); // User forgot password
router.get("/all-data", authController.fetchAllUsers); // All Users data

export default router;
