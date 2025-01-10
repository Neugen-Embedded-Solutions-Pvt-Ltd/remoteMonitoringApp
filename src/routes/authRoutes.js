import express from "express";
import authController from "../controllers/authController.js";
import tempController from "../controllers/tempratureController.js";

const AuthRoute = express.Router();
const tempratureRoute = express.Router();

// Authentication Routes
AuthRoute.post("/register", authController.registerUser); //User register
AuthRoute.post("/login", authController.loginUser); // User login
AuthRoute.post("/forgot-password", authController.sendPasswordResetLink); // User forgot password
AuthRoute.put("/resetpassword", authController.resetPasswordWithToken); // User forgot password

// Temprature Routes
tempratureRoute.post("/temprature-report", tempController.temperatureReport); // temparture report genration
tempratureRoute.get("/temprature", tempController.fetchAllTemperatureData); // all temparture data for chart
tempratureRoute.get("/temp-report", tempController.fetchTempratureInIntervals); // all temparture data for chart

export { tempratureRoute, AuthRoute };
