import express from "express";
import authController from "../controllers/authController.js";
import weatherApi from "../config/weatherApi.js";

const router = express.Router();

if (typeof weatherApi !== "function") {
  throw new Error("weatherApi is not a function");
}
router.post("/register", authController.registerUser); //User register
router.post("/login", authController.loginUser); // User login
router.post("/forgotpassword", authController.sendPasswordResetLink); // User forgot password
router.put("/resetpassword", authController.resetPasswordWithToken); // User forgot password
router.get("/alldata", authController.fetchAllUsers); // All Users datata

router.get("/weather", weatherApi); // testing purpose

export default router;
