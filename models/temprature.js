import query from "../config/database.js";

const temperature = {
  // insert global temprature to the database once
  createTempratureEntry: async (tempdata) => {
    try {
      const sql =
        "INSERT INTO temperature_records (record_date,temprature, min_temperature, max_temperature, conditions) VALUES(?, ?, ?, ?, ?)";
      const result = await query(sql, [
        tempdata.date,
        tempdata.temp,
        tempdata.tempmin,
        tempdata.tempmax,
        tempdata.conditions,
      ]);
      return result;
    } catch (error) {
      console.log("Error fetching temprature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // get the deatils of temperature for report generation
  getTempratureAllDatas: async (dates) => {
    try {
      const sql =
        "SELECT record_date,min_temperature,max_temperature FROM temperature_records WHERE record_date BETWEEN ? AND ? ORDER BY record_date ASC";
      console.log(await dates);
      const result = await query(sql, [dates.fromdate, dates.todate]);
      return result;
    } catch (error) {
      console.log("Error fetching temprature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // Inserting a temprature from Global API to our db Daily once
  insertTempratureData: async (data) => {
    try {
      const sql = `INSERT INTO temperatures (device_id, temperature) VALUES(?, ?)`;
      const result = await query(sql, [data.device_id, data.temperature]);
      return result;
    } catch (error) {
      console.log("Error fetching temprature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // Get the all records of user device from DB
  getTempratureAll: async () => {
    try {
      const sql = "SELECT * FROM temperature_records";
      const result = await query(sql);
      return result;
    } catch (error) {
      console.log("Error fetching temprature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },

  // get the temprature details of device of the User
  getTemperatureData: async () => {
    try {
      //SELECT * FROM temperatures WHERE timestamp > NOW() - INTERVAL 1 HOUR
      const sql =
        "SELECT * FROM temperatures WHERE timestamp > NOW() - INTERVAL 1 HOUR";
      const result = await query(sql);
      return result;
    } catch (error) {
      console.log("Error fetching temprature data:", error.message);
      throw new Error("Network timeout Error");
    }
  },
};

export default temperature;
