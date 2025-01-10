import fs from "fs";

import temperature from "../models/temperature.js";
import generateReport from "../../utils/reportGenerator.js";
import WeatherApiData from "../config/WeatherApiData.js";
import TempratureService from "../services/tempratureService.js";
import { AppError } from "../../utils/AppError.js";

const tempController = {
  // getting all temperature data from DB
  fetchAllTemperatureData: async (req, res) => {
    try {
      const result = await TempratureService.fetchAllTemperatureData();

      res.status(200).send({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },

  fetchTempratureInIntervals: async (req, res) => {
    try {
      let data = req.body;
      console.log("input parameters: ", data);
      const result =  await TempratureService.getTemperatureAtFiveMinuteIntervals(data);
      
      res.status(200).send({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },

   

  // Public API data storing in temperature_records table
  insertTodayTemperature: async (req, res) => {
    try {
      let apiWeatherData = await WeatherApiData();
      let weatherAllData = apiWeatherData.forecast.forecastday;

      // Extract today's weather data
      let weatherData = weatherAllData[0];
      let todayData = {
        date: weatherData.date,
        temp: weatherData.day.avgtemp_f,
        tempMax: weatherData.day.maxtemp_f,
        tempMin: weatherData.day.mintemp_f,
        conditions: weatherData.day.condition.text,
      };

      // Save today's forecast data yo DB
      await temperature.insertTemperatureRecord(todayData);
    } catch (error) {
      console.error("Error in temperatureData:", error);
    }
  },

  // Report generator
  temperatureReport: async (req, res) => {
    try {
      const dates = req.body;
      const result = await temperature.getTemperatureRangeByDate(dates);
      if (result.length == 0) {
        throw new Error(`No temperature found`);
      }
      const file = await generateReport(result);
      console.log(file, "line-2");
      if (fs.existsSync(file)) {
        res.status(200).download(file, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).send({
              message: "Error sending temperature report file",
            });
          } else {
            console.log("File sent successfully");
            fs.unlink(file, (unlinkErr) => {
              if (unlinkErr) console.error("Error deleting file:", unlinkErr);
            });
          }
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(300).send({
        status: 300,
        message: "data not between that date",
      });
    }
  },
};

export default tempController;
