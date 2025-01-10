import express from "express";
import tempController from "../controllers/temperatureController.js";

const temperatureRoute = express.Router();
temperatureRoute.post("/temperature-report", tempController.temperatureReport); // temperature report generation
temperatureRoute.get("/temperature", tempController.fetchAllTemperatureData); // all temperature data for chart
temperatureRoute.get("/temp-report", tempController.fetchTTemperatureInIntervals); // all temperatures data for chart

export default temperatureRoute;
