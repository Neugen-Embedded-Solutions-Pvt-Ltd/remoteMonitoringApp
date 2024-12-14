import express from "express";
import authController from "../controllers/authController.js";
import weatherApi from "../config/weatherApi.js";

const router = express.Router();

if (typeof weatherApi !== "function") {
  throw new Error("weatherApi is not a function");
}
router.post("/register", authController.register); //User register
router.post("/login", authController.login); // User login
router.post("/forgotpassword", authController.forgotPassword); // User forgot password
router.put("/resetpassword", authController.resetPassword); // User forgot password
router.get("/alldata", authController.GetAllUsers); // All Users datata
 
router.get("/weather", weatherApi); // testing purpose

export default router;
 