import fs from 'fs';

import temprature from '../models/temprature.js';
import generateReport from '../utils/reportGenerator.js';
import weatherApiData from '../controllers/tempratureController.js';


const tempController = {
    // Report generator
    getTempratureAllData: async (req, res) => {
        try {
            const dates = req.body;
            const result = await temprature.getTempratureAllDatas(dates);
            if (result.length == 0) {
                throw new Error(`No temprature found`);
            }
            const file = await generateReport(result);
            console.log(file, "line-2");
            if (fs.existsSync(file)) {
                res.status(200).download(file, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send({
                            message: 'Error sending temperature report file'
                        });
                    } else {
                        console.log('File sent successfully');
                        fs.unlink(file, (unlinkErr) => {
                            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                        });
                    }
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(300).send({
                status: 300,
                message: "data not between that date",
            });
        }
    },
    // getting all temperature data from DB
    tempratureData: async (req, res) => {
        try {
            let weatherData = await weatherApiData();
            let weatherAllData = weatherData.forecast.forecastday;

            // Extract today's weather data
            let weatherDatas = weatherAllData[0];

            let todayData = {
                date: weatherDatas.date,
                temp: weatherDatas.day.avgtemp_f,
                tempmax: weatherDatas.day.maxtemp_f,
                tempmin: weatherDatas.day.mintemp_f,
                conditions: weatherDatas.day.condition.text
            };

            //Map all forcast data
            const weatherDataArray = weatherAllData.map(data => ({
                date: data.date,
                temp: data.day.avgtemp_f,
                tempmax: data.day.maxtemp_f,
                tempmin: data.day.mintemp_f,
                conditions: data.day.condition.text
            }));

            // Save today's forecast data yo DB
            const result = await temprature.createTempratureEntry(todayData);

            res.status(200).send({
                status: 200,
                message: 'success',
                dataupdate: 'date inserted',
                queryData: result,
                data: weatherDataArray,
            });
        } catch (error) {
            console.error('Error in tempratureData:', error);
            res.status(500).json({
                status: 500,
                message: 'Failed to process weather data',
                error: error.message
            });
        }
    }
}

export default tempController;