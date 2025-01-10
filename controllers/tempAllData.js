import fs from "fs";

import temperature from "../models/temperature.js";
import generateReport from "../utils/reportGenerator.js";
import WeatherApiData from "../config/WeatherApiData.js";

const tempController = {
  // Report generator
  sendTemperatureReport: async (req, res) => {
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

  // getting all temperature data from DB
  fetchAllTemperatureData: async (req, res) => {
    try {
      // Save today's forecast data yo DB
      const result = await temperature.getAllTemperatureRecords();

      res.status(200).send({
        status: 200,
        message: "success",
        dataUpdate: "date inserted",
        data: result,
      });
    } catch (error) {
      console.error("Error in temperatureData:", error);
      res.status(500).json({
        status: 500,
        message: "Failed to process weather data",
        error: error.message,
      });
    }
  },

  //  Getting all temperature data from temperatures table which device temperature data
  getDeviceTemperatureLastHour: async (req, res) => {
    try {
      let result = await temperature.fetchTemperatureLastHour();
      if (result.length == 0) {
        return res.send({
          status: 400,
          message: "temperature not found",
        });
      }
      res.status(200).send({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (err) {
      console.error("Error in temperatureData:", err);
      res.status(500).json({
        status: 500,
        message: "Failed to process weather data",
        err: err.message,
      });
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
  getTemperatureAtFiveMinuteIntervals: async (req, res) => {
    try {
      let data = req.body;
      console.log("input parameters: ", data)
      const response = await temperature.getTemperatureByTimeInterval(data);
      res.status(200).send({
        status: 200,
        message: "success",
        data: response,
      });
    } catch (error) {
      console.error("Error in temperatureData:", error);
      res.status(500).json({
        status: 500,
        message: "Failed to process weather data",
        err: error.message,
      });
    }
  }

};

export default tempController; 