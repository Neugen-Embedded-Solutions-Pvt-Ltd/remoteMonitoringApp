const AutoTemprature = require('../services/tempratureService');
const dotenv = require('dotenv');
const mqttClient = require('../config/mqtt');

dotenv.config();
const BASEURI = process.env.WEATHER_API_URI;
const weatherKey = process.env.WEATHER_API_KEY;
const cityWeather = "india"
let currentTemperature;
const proxyMiddlwware = async () => {
    const weatherUrl = `${BASEURI}/${cityWeather}?unitGroup=us&key=${weatherKey}&Content-Type=json`; // Replace with your actual weather API URL

    try {
        const resp = await fetch(weatherUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (resp.status !== 200) {
            throw new Error(`Failed to get weather data ${resp.status}`);
        }
        const {
            days
        } = await resp.json();
        currentTemperature = await days[0]?.temp;
        return currentTemperature
    } catch (error) {
        console.error("Error fetching weather data: ", error);
    }
};
proxyMiddlwware().then(currentTemperature => {
    console.log(currentTemperature);
});
exports.setTemprature = async (req, res) => {
    try {
        const {
            manualTemparature
        } = req.body;
        const temp = new AutoTemprature(currentTemperature, manualTemparature);
        let topic = 'Temperature';
        let setTemprature = temp.deviceTempraure;
        mqttClient.subscribe([topic], ((err) => {
            if (err) {
                console.log(err.message);
            }
            console.log(`Subscribed to topic ${topic}`);
        }))
        setInterval(() => {
            mqttClient.publish([topic], JSON.stringify({
                setTemprature
            }));
            console.log(`IOT temprature: ${setTemprature}°c`)
        }, 50000); // 5mins interval for refresh
        mqttClient.on('message', ([topic], message) => {
            const data = JSON.parse(message.toString());
           
            console.log(`received temperature: ${data.setTemprature}°C`);
        })
        res.status(200).send({
            data: temp,
            message: "Temprature sent to device"
        })
    } catch (err) {
        console.log(err.message);

        res.status(500).send({
            message: "server side error"
        })
    }
}; 

exports.setAutomaticTemprature = async (req, res) => {
    try {
        const {
            typeTemprature
        } = req.body;
        console.log(typeTemprature)
        const temp = new AutoTemprature(null,null,typeTemprature);
        let newSetupTemprature = temp.setTemperatureMode()
        console.log(newSetupTemprature);
        let topic = 'Temperature'
        mqttClient.subscribe([topic], ((err) => {
            if (err) {
                console.log(err.message);
            }
            console.log(`Subscribed to topic ${topic}`);
        }));
        
        setInterval(() => {
            mqttClient.publish([topic], JSON.stringify({
                newSetupTemprature
            }));
            console.log(`IOT temprature: ${newSetupTemprature}°c`)
        }, 5000); // 5mins interval for refresh

        mqttClient.on('message', ([topic], message) => {
            const data = JSON.parse(message.toString()); 
            console.log(`received temperature: ${data.setTemprature}°C`);
        })

        res.status(200).send({
            data: newSetupTemprature,
            message: `${newSetupTemprature}°c ${typeTemprature} temprature applied to device successfully`
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "server side error"
        })
    }
}