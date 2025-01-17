import express from "express";
import tempController from "../controllers/temperatureController.js";

const temperatureRoute = express.Router();
temperatureRoute.post("/temperature-report", tempController.generateTemperatureReport);  
temperatureRoute.get("/temperature", tempController.fetchAllTemperatureData); 
temperatureRoute.get(
  "/temperature-report",
  tempController.fetchTemperatureIntervals
);

export default temperatureRoute;
