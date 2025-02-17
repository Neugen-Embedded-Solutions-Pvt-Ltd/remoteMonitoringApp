import fs from "fs";
import generateReport from "../../utils/reportGenerator.js";
import {
  FieldsNotFound,
  FileNotFound,
  InvalidDate,
  ReportGenerateError,
  TemperatureNotFound,
  TemperatureRecordsNotAvailable,
} from "../../utils/AppError.js";
import Temperature from "../models/TemperatureModel.js";
import { Op, Sequelize, where } from "sequelize";
import Helpers from "../../utils/helpers.js";
// await Temperature.sync({ alter: true });

const TemperatureService = {
  /**
   * Fetches all temperature data based on provided filters and paginates the results.
   *
   * @async
   * @param {Object} data - The filter and pagination parameters.
   * @param {string} [data.date] - The date to filter temperature records.
   * @param {string} [data.min_temp] - The minimum temperature to filter records.
   * @param {string} [data.max_temp] - The maximum temperature to filter records.
   * @param {string} [data.condition] - The condition to filter temperature records.
   * @param {number} [data.page] - The current page number for pagination.
   * @param {number} [data.limit] - The number of records per page for pagination.
   * @throws {TemperatureRecordsNotAvailable} If no temperature records are found.
   * @returns {Object} An object containing total records, current page, total pages, and the paginated records.
   */
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
      page,
      limit
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

  /**
   * Retrieves temperature records at five-minute intervals within a specified date range.
   *
   * @async
   * @function
   * @param {Object} bodyData - The request body data containing date range.
   * @param {string} bodyData.from_date - The start date for the temperature records.
   * @param {string} bodyData.to_date - The end date for the temperature records.
   * @param {Object} queryData - The query parameters for pagination.
   * @param {number} [queryData.page=1] - The current page number for pagination.
   * @param {number} [queryData.limit=10] - The number of records per page for pagination.
   * @throws {FieldsNotFound} If required fields (from_date, to_date) are missing.
   * @throws {TemperatureRecordsNotAvailable} If no temperature records are found.
   * @returns {Object} An object containing paginated temperature records, total records, current page, and total pages.
   */
  getTemperatureAtFiveMinuteIntervals: async (bodyData, queryData) => {
    let { from_date, to_date } = bodyData;

    if (!from_date || !to_date) {
      throw new FieldsNotFound(
        "Required fields (from_date, to_date) cannot be empty or undefined"
      );
    }
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
      (queryData.page = 1),
      (queryData.limit = 10)
    );
    return {
      totalRecords: filteredRecords.length,
      currentPage: parseInt(currentPage),
      totalPages: Math.ceil(originalArray.length / pageLimit),
      records: filteredRecords,
    };
  },

  /**
   * Generates a temperature report for a specified date range.
   *
   * @async
   * @function generateReportData
   * @param {Object} dates - An object containing the date range.
   * @param {string} dates.from_date - The start date of the range.
   * @param {string} dates.to_date - The end date of the range.
   * @throws {FieldsNotFound} If the required fields are empty or undefined.
   * @throws {InvalidDate} If the from_date is later than the to_date.
   * @throws {TemperatureNotFound} If no temperature records are found within the date range.
   * @throws {FileNotFound} If the generated report file does not exist.
   * @returns {Promise<string>} The file path of the generated report.
   */
  generateReportData: async (dates) => {
    const from_date = new Date(dates.from_date);
    const to_date = new Date(dates.to_date);

    if (!from_date || !to_date) {
      throw new FieldsNotFound(
        "Required fields (from_date, to_date) cannot be empty or undefined"
      );
    }
    if (from_date > to_date) {
      throw new InvalidDate();
    }
    const result = await Temperature.findAll({
      attributes: ["record_date", "min_temperature", "max_temperature"], // Select specific columns
      where: {
        record_date: {
          [Op.between]: [from_date, to_date], // Filters records between the two dates
        },
      },
      order: [["record_date", "ASC"]], // Orders by record_date in ascending order
    });
    if (result.length === 0) {
      throw new TemperatureNotFound();
    }

    const file = await generateReport(result);
    if (!fs.existsSync(file)) {
      console.error("File does not exist:", file);
      throw new FileNotFound();
    }

    return file; // Return the file path to the controller
  },
};

export default TemperatureService;
