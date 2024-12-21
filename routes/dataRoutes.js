import express from "express";

const dataRouter = express.Router();
import tempController from "../controllers/tempAllData.js";

dataRouter.post("/tempall", tempController.sendTemperatureReport); // temparture report genration
dataRouter.get("/temp", tempController.fetchAllTemperatureData); // all temparture data for chart
dataRouter.get("/devicetemp", tempController.getDeviceTemperatureLastHour); // all temparture data for chart
dataRouter.get("/tempreport", tempController.getTemperatureAtFiveMinuteIntervals); // all temparture data for chart

// function make entry temprature data day once
const tempratureInsert = () => {
  console.log("function called");
  // Call the function immediately
  const date = new Date().toISOString().split("T")[0];
  console.log(date);
  tempController.insertTodayTemperature(date);

  setInterval(() => {
    const date = new Date().toISOString().split("T")[0];
    console.log(date);
    tempController.insertTodayTemperature(date);
  }, 24 * 60 * 60 * 1000);
};
tempratureInsert();

export default dataRouter;