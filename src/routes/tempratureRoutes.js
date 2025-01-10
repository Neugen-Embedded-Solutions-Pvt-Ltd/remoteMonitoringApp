import express from "express";
import tempController from "../controllers/tempratureController.js";

const tempratureRoute = express.Router();
tempratureRoute.post("/temprature-report", tempController.temperatureReport); // temparture report genration
tempratureRoute.get("/temprature", tempController.fetchAllTemperatureData); // all temparture data for chart
tempratureRoute.get("/temp-report", tempController.fetchTempratureInIntervals); // all temparture data for chart

export default tempratureRoute;
