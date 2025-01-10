import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Temperature from "../models/temperature.js";

import generateReport from "../../utils/reportGenerator.js";
import WeatherApiData from "../config/WeatherApiData.js";

import {
  TempartureRecordsNotAvalible,
} from "../../utils/AppError.js";

const TempratureService = {
  // public API data fetching
  fetchAllTemperatureData: async () => {
    const result = await Temperature.getAllTemperatureRecords();

    if (result.length == 0) {
      throw new TempartureRecordsNotAvalible();
    }
    return result;
  },
  getTemperatureAtFiveMinuteIntervals: async (data) => {
    const result = await Temperature.getTemperatureByTimeInterval(data);

    if (result.length == 0) {
      throw new TempartureRecordsNotAvalible();
    }
    return result;
  },
};

export default TempratureService;
