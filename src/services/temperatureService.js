import fs from "fs";
import moment from "moment/moment.js";
import generateReport from "../../utils/reportGenerator.js";
import {
  FileNotFound,
  ReportGenerateError,
  TemperatureRecordsNotAvailable,
} from "../../utils/AppError.js";
import Temperature from "../models/TemperatureModel.js";
import { Op, Sequelize, where } from "sequelize";
import Helpers from "../../utils/helpers.js";
// await Temperature.sync({ alter: true });

const TemperatureService = {
  // public API data fetching
  fetchAllTemperatureData: async (data) => {
    let { date, min_temp, max_temp, condition, page, limit } = data;

    let filteredRecord = await Temperature.findAll();
    if (filteredRecord == null) {
      throw new TemperatureRecordsNotAvailable();
    }
    if (date) {
      filteredRecord = await Temperature.findAll({
        where: {
          record_date: date,
        },
      });
    }
    if (min_temp) {
      filteredRecord = await Temperature.findAll({
        where: {
          min_temperature: min_temp,
        },
      });
    }
    if (max_temp) {
      filteredRecord = await Temperature.findAll({
        where: {
          max_temperature: max_temp,
        },
      });
    }
    if (condition) {
      filteredRecord = await Temperature.findAll({
        where: {
          conditions: condition,
        },
      });
    }
    const { currentPage, pageLimit, filteredRecords } = Helpers.Pagination(
      filteredRecord,
      queryData.page,
      queryData.limit
    );
    if (filteredRecords.length === 0) {
      throw new TemperatureRecordsNotAvailable();
    }
    return {
      totalRecords: filteredRecords.length,
      currentPage: parseInt(currentPage),
      totalPages: Math.ceil(filteredRecord.length / pageLimit),
      records: filteredRecords,
    };
  },

  // getting temperature in 5 mins as average
  getTemperatureAtFiveMinuteIntervals: async (bodyData, queryData) => {
    let { from_date, to_date } = bodyData;
    const filteredRecord = await Temperature.findAll({
      attributes: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("createdAt"),
            "%Y-%m-%d %H:%i"
          ),
          "timestamp",
        ],
        [
          Sequelize.fn("AVG", Sequelize.col("temperature")),
          "average_temperature",
        ],
        [Sequelize.fn("MIN", Sequelize.col("temperature")), "min_temperature"],
        [Sequelize.fn("MAX", Sequelize.col("temperature")), "max_temperature"],
      ],
      where: {
        createdAt: {
          [Op.between]: [from_date, to_date],
        },
        //  [Op.and]: [Sequelize.literal("MOD(MINUTE(createdAt), 5) = 0")],
      },
      group: [
        Sequelize.fn(
          "DATE_FORMAT",
          Sequelize.col("createdAt"),
          "%Y-%m-%d %H:%i"
        ),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("createdAt"),
            "%Y-%m-%d %H:%i"
          ),
          "ASC",
        ],
      ],
    });
    let originalArray = [];
    for (let i = 0; i < filteredRecord.length; i++) {
      let temperatureObj = filteredRecord[i].dataValues;
      originalArray.push(temperatureObj);
    }

    if (filteredRecord.length === 0) {
      throw new TemperatureRecordsNotAvailable();
    }
    const { currentPage, pageLimit, filteredRecords } = Helpers.Pagination(
      originalArray,
      queryData.page,
      queryData.limit
    );
    return {
      totalRecords: filteredRecords.length,
      currentPage: parseInt(currentPage),
      totalPages: Math.ceil(originalArray.length / pageLimit),
      records: filteredRecords,
    };
  },

  // Generating a detailed temperature report and exporting it to an Excel sheet for analysis and record-keeping
  generateReportData: async (dates) => {
    const result = await Temperature.findAll({
      attributes: ["record_date", "min_temperature", "max_temperature"], // Select specific columns
      where: {
        record_date: {
          [Op.between]: [dates.from_date, dates.to_date], // Filters records between the two dates
        },
      },
      order: [["record_date", "ASC"]], // Orders by record_date in ascending order
    });
    if (result.length == 0) {
      throw new Error(`No temperature found`);
    }
    const file = await generateReport(result);
    if (fs.existsSync(file)) {
      return file;
      res.status(200).download(file, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          throw new ReportGenerateError();
        }
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
