import query from "../config/database.js";

const Temperature = {
 
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
      console.log(
        "Error Retrieving aggregate temperature data:",
        error.message
      );
      throw new Error("Network timeout Error");
    }
  },
};

export default Temperature;
