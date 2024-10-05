const AutoTemprature = require('../services/tempratureService');
const dotenv = require('dotenv');
const {
    promisify
  } = require('util'); 
dotenv.config();
const mqttClient = require('../config/mqtt');

const subscribeAsync = promisify(mqttClient.subscribe).bind(mqttClient);
const publishAsync = promisify(mqttClient.publish).bind(mqttClient); 

const BASEURI = process.env.WEATHER_API_URI;
const weatherKey = process.env.WEATHER_API_KEY;
const cityWeather = "india"
let currentTemperature;
// Variable to store the last sent temperature value
let lastTemperature = null;

const weatherApi = async () => {
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
weatherApi().then(currentTemperature => {
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
        }, 5000); // 5mins interval for refresh
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
            message: "Internal Server error "
        })
    }
};
  
let topic = 'Temperatures'; 
async function publishTemperature(newTemperature) {
    // return new Promise((resolve, reject) => {

    if (newTemperature !== lastTemperature) {


        try {
            await subscribeAsync([topic])
            console.log(`Subscribed to topic: ${topic}`);

            // Publish the new temperature to the topic
            await publishAsync(topic, JSON.stringify({
                temperature: newTemperature
            }));
       
            console.log(`Published new temperature: ${newTemperature}`);
            lastTemperature = newTemperature; // Update last temperature
            return `Temperature published successfully: ${newTemperature}`;

        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw new Error('Failed to publish temperature.');
        }
    } else {
        console.log('Temperature has not changed, no need to publish.');
        resolve('Temperature has not changed.');
    }
}
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
  
    console.log(`received temperature: ${data.temperature}°C`);
})

exports.setAutomaticTemprature = async (req, res) => {
    try {
        const {
            typeTemprature,
            manualTemparature
        } = req.body;  
        if (typeTemprature) {
            const temp = new AutoTemprature(currentTemperature, null, typeTemprature);
            let newSetupTemprature = temp.setTemperatureMode();
            const tempratureValue = await publishTemperature(newSetupTemprature);            
            res.status(200).send({
                data: tempratureValue,
                message: `${newSetupTemprature}°C ${typeTemprature} temperature applied to device successfully`
            });
        } else {
            const temp = new AutoTemprature(currentTemperature, manualTemparature, null);
            let setTemprature = temp.deviceTempraure;
            const tempratureValue = await publishTemperature(setTemprature); 
            res.status(200).send({
                data: tempratureValue,
                message: `${setTemprature}°C temperature applied to device successfully`
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Internal Server error"
        });
    }
};