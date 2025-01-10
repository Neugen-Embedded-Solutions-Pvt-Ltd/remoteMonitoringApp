import query from "../config/database.js";

const temperature = {
  // insert global temperature to the database once
  insertTemperatureRecord: async (temperatureData) => {
    try {
      const sql =
        "INSERT INTO temperature_records (record_date,temperature, min_temperature, max_temperature, conditions) VALUES(?, ?, ?, ?, ?)";
      const result = await query(sql, [
        temperatureData.date,
        temperatureData.temp,
        temperatureData.tempMin,
        temperatureData.tempMax,
        temperatureData.conditions,
      ]);
      return result;
    } catch (error) {
      console.log("Error fetching temperature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // temperature data for a specified date range and time range
  getTemperatureRangeByDate: async (dates) => {
    try {
      const sql =
        "SELECT record_date,min_temperature,max_temperature FROM temperature_records WHERE record_date BETWEEN ? AND ? ORDER BY record_date ASC";
      const result = await query(sql, [dates.from_date, dates.to_date]);
      return result;
    } catch (error) {
      console.log("Error fetching temperature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // Inserting a temperatures from Global API to our db Daily once
  insertDeviceTemperature: async (data) => {
    try {
      const sql = `INSERT INTO temperatures (device_id, temperature) VALUES(?, ?)`;
      const result = await query(sql, [data.device_id, data.temperature]);
      return result;
    } catch (error) {
      console.log("Error fetching temperature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // Get the all records of user device from DB
  getAllTemperatureRecords: async () => {
    try {
      const sql = "SELECT * FROM temperature_records";
      const result = await query(sql);
      return result;
    } catch (error) {
      console.log("Error fetching temperature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // Retrieve the last 1 hour temperature
  fetchTemperatureLastHour: async () => {
    try {
      //SELECT * FROM temperatures WHERE timestamp > NOW() - INTERVAL 1 HOUR
      const sql =
        "SELECT * FROM temperatures WHERE timestamp > NOW() - INTERVAL 1 HOUR";
      const result = await query(sql);
      return result;
    } catch (error) {
      console.log("Error fetching temperature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // Retrieving aggregate temperature data over the specified time interval
  getTemperatureByTimeInterval: async (data) => {
    try {
      const sql = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS timestamp,
        AVG(temperature) AS average_temperature,
        MIN(min_temperature) AS min_temperature,
        MAX(max_temperature) AS max_temperature      
      FROM 
        temperature_records
      WHERE 
        DATE(created_at) =? AND TIME(created_at) BETWEEN ? AND ? 
        AND MOD(MINUTE(created_at), 5) = 0
      GROUP BY 
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i')    
      ORDER BY
        timestamp;  
      `; // from time interval 5 minute make average , min and max temperature and give it as one

      const result = await query(sql, [
        data.inputDate,
        data.startTime,
        data.endTime,
      ]);

      return result;
    } catch (error) {
      console.log("Error Retrieving aggregate temperature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },
};

export default temperature;
