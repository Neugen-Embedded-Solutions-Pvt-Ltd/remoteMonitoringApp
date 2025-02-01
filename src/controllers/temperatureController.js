import fs from "fs";
import TemperatureService from "../services/temperatureService.js";
import { AppError } from "../../utils/AppError.js";

const tempController = {
  // getting all temperature data from DB
  fetchAllTemperatureData: async (req, res) => {
    try {
      const result = await TemperatureService.fetchAllTemperatureData(
        req.query
      );

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
      let bodyData = req.body;
      let queryData = req.query;
      const result =
        await TemperatureService.getTemperatureAtFiveMinuteIntervals(
          bodyData,
          queryData
        );
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
      const file = await TemperatureService.generateReportData(
        req.body
      );
      // Send the file to the client
      res.status(200).download(file, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          throw new Error("Failed to send file");
        }

        // Delete the file after it has been sent
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
      });
    } catch (error) {
      console.error("Error in /generate-report route:", error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
        });
      } else { 
         
        res.status(500).json({
          status: 500,
          message: "Internal server error",
        });
      }
    }
  },
};

export default tempController;
