import express from "express";
import tempController from "../controllers/temperatureController.js";

const temperatureRoute = express.Router();
temperatureRoute.post("/report", tempController.generateTemperatureReport);  
temperatureRoute.get("/temperature", tempController.fetchAllTemperatureData); 
temperatureRoute.get(
  "/temperature-chart",
  tempController.fetchTemperatureIntervals
);

export default temperatureRoute;
// 2025-01-24 11:29:35