import query  from '../config/database.js';

const teamprature = {
    // insert global temprature to the database
    createTempratureEntry: async (tempdata) => {
        try {
            const sql = 'INSERT INTO temperature_records (record_date,temprature, min_temperature, max_temperature) VALUES(?, ?, ?, ?)';
            const result = await query(sql, [
                tempdata.date,
                tempdata.temp,
                tempdata.tempmin,
                tempdata.tempmax,
                tempdata.conditions,
            ]);
            return result;
        } catch (e) {
            console.log('error in query')
            throw new Error('Network timeout Error')
        }
    },
    // get all the deatils for report generation
    getTempratureAllDatas: async (dates) => {
        try {
            const sql = 'SELECT record_date,min_temperature,max_temperature FROM temperature_records WHERE record_date BETWEEN ? AND ? ORDER BY record_date ASC';
            const result = await query(sql, [dates.fromdate, dates.todate]);
            return result;
        } catch (e) {
            console.log('Error fetching temprature data:', e.message);
            throw new Error('Network timeout Error')
        }
    }
}

export default teamprature;