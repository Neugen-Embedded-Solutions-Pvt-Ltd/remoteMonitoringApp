import fs from "fs";
import TemperatureService from "../services/temperatureService.js";
import { AppError } from "../../utils/AppError.js";

const tempController = {
  // getting all temperature data from DB
  fetchAllTemperatureData: async (req, res) => {
    try {
      const result = await TemperatureService.fetchAllTemperatureData();

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

  fetchTemperatureIntervals: async (req, res) => {
    try {
      let data = req.body;
      const result =
        await TemperatureService.getTemperatureAtFiveMinuteIntervals(data);

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

  // Report generator
  generateTemperatureReport: async (req, res) => {
    try {
      const response = await TemperatureService.generateReportData(req.body);
      if (response)
        res.status(200).send({
          status: 200,
          message: "report sent successfully",
          data: response,
        });
      fs.unlink(file, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(300).send({
        status: 300,
        message: "data not between that date",
      });
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
};

export default tempController;
