import fs from "fs"; 

import generateReport from "../../utils/reportGenerator.js";
import {
  FileNotFound,
  ReportGenerateError,
  TemperatureRecordsNotAvailable,
} from "../../utils/AppError.js";

import Temperature from "../models/TemperatureModel.js";

import temperatureSqlFunctions from "../models/temperatureSqlFunctions.js";
const TemperatureService = {
  // public API data fetching
  fetchAllTemperatureData: async () => {
    const result = await Temperature.findAll(); 

    if (result  == null) {
      throw new TemperatureRecordsNotAvailable();
    }
    return result;
  },
  
  getTemperatureAtFiveMinuteIntervals: async (data) => {
    const result = await temperatureSqlFunctions.getTemperatureByTimeInterval(
      data
    );

    if (result.length == 0) {
      throw new TemperatureRecordsNotAvailable();
    }
    return result;
  },

  // generating the reports
  generateReportData: async (dates) => {
    const result = await temperatureSqlFunctions.getTemperatureRangeByDate(
      dates
    );
    if (result.length == 0) {
      throw new Error(`No temperature found`);
    }
    const file = await generateReport(result);
    if (fs.existsSync(file)) {
      return file
      res.status(200).download(file, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          throw new ReportGenerateError();
        }

        console.log("File sent successfully");

        // Delete the file after sending it
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });
        return true;
      });
    } else {
      console.error("File does not exist:", file);
      throw new FileNotFound();
    }
  },
};

export default TemperatureService;
