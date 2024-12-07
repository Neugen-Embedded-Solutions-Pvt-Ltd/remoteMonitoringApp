import fs from "fs";

import temprature from "../models/temprature.js";
import generateReport from "../utils/reportGenerator.js";
import weatherApiData from "../utils/weatherApi.js";

const tempController = {
  // Report generator
  getTempratureAllData: async (req, res) => {
    try {
      const dates = req.body;
      const result = await temprature.getTempratureAllDatas(dates);
      if (result.length == 0) {
        throw new Error(`No temprature found`);
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
  tempratureData: async (req, res) => {
    try {
      // Save today's forecast data yo DB
      const result = await temprature.getTempratureAll();

      res.status(200).send({
        status: 200,
        message: "success",
        dataupdate: "date inserted",
        data: result,
      });
    } catch (error) {
      console.error("Error in tempratureData:", error);
      res.status(500).json({
        status: 500,
        message: "Failed to process weather data",
        error: error.message,
      });
    }
  },

  //  Getiing all temperature data from temperatures table which device temprature data
  deviceTempData: async (req, res) => {
    try {
      let result = await temprature.getTemperatureData();
      if (result.length == 0) {
        return res.send({
          status: 400,
          message: "temprature not found",
        });
      }
      res.status(200).send({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (err) {
      console.error("Error in tempratureData:", err);
      res.status(500).json({
        status: 500,
        message: "Failed to process weather data",
        err: err.message,
      });
    }
  },

  // Public API data storing in temprature_records table
  insertTodayTemp: async (req, res) => {
    try {
      let weatherData = await weatherApiData();
      let weatherAllData = weatherData.forecast.forecastday;

      // Extract today's weather data
      let weatherDatas = weatherAllData[0];
      let todayData = {
        date: weatherDatas.date,
        temp: weatherDatas.day.avgtemp_f,
        tempmax: weatherDatas.day.maxtemp_f,
        tempmin: weatherDatas.day.mintemp_f,
        conditions: weatherDatas.day.condition.text,
      };

      // Save today's forecast data yo DB
      await temprature.createTempratureEntry(todayData);
    } catch (error) {
      console.error("Error in tempratureData:", error);
    }
  },
};

export default tempController; 