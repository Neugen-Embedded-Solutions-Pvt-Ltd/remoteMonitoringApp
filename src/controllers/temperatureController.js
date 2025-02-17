import fs from "fs";
import TemperatureService from "../services/temperatureService.js";
import { AppError } from "../../utils/AppError.js";

const tempController = {
  /**
   * Handles the HTTP request to fetch all temperature data based on query parameters.
   * Utilizes the TemperatureService to retrieve data and sends a response with the results.
   * Catches and handles errors, sending appropriate HTTP status codes and messages.
   *
   * @param {Object} req - The HTTP request object containing query parameters.
   * @param {Object} res - The HTTP response object used to send back the desired HTTP response.
   */
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
  /**
   * Handles the request to fetch temperature data at five-minute intervals.
   *
   * @param {Object} req - The request object containing body and query data.
   * @param {Object} res - The response object used to send back the result.
   *
   * @returns {void} Sends a JSON response with the status, message, and data.
   *
   * @throws {AppError} If a known application error occurs, sends a response with the error status and message.
   * @throws {Error} If an unexpected error occurs, sends a 500 status with an "Internal server error" message.
   */
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

  /**
   * Generates and downloads a temperature report using TemperatureService.
   *
   * The function creates a report based on the request body, sends it as a downloadable file,
   * and deletes the file from the server after sending. Errors are logged and returned with
   * appropriate HTTP status codes.
   *
   * @param {Object} req - The request object with data for report generation.
   * @param {Object} res - The response object to send the file or errors.
   */
  generateTemperatureReport: async (req, res) => {
    try {
      const file = await TemperatureService.generateReportData(req.body);
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
