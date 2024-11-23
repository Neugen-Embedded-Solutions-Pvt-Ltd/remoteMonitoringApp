import dotenv from 'dotenv';
import {
    promisify
} from 'util'; // Promise to async function
dotenv.config();

import mqttClient from '../config/mqtt.js'; // importing mqtt configuration
import AutoTemprature from '../services/tempratureService.js'; // basic information of temprature 

const subscribeAsync = promisify(mqttClient.subscribe).bind(mqttClient); // using in async instead of PROMISE
const publishAsync = promisify(mqttClient.publish).bind(mqttClient);

const BASEURI = process.env.WEATHER_API_URI;
const weatherKey = process.env.WEATHER_API_KEY;
const cityWeather = "india"
let currentTemperature;
let lastTemperature = null;

// getting todays's weather details
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

// pulish temprature the data using MQTT
let topic = 'Temperatures'; // topic for mqtt connectiuon 
async function publishTemperature(newTemperature) {
    if (newTemperature !== lastTemperature) {
        try {
            // makes the subcribe
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
};

// mqtt receive the message 
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log(`received temperature: ${data.temperature}°C`);
});

// end-point for user view and send temperature
const setAutomaticTemprature = async (req, res) => {
    try {
        const {
            typeTemprature,
            manualTemparature
        } = req.body;
        if (typeTemprature) {
            const temp = new AutoTemprature(currentTemperature, null, typeTemprature); // class for basic information about temprature to device
            let newSetupTemprature = temp.setTemperatureMode();
            const tempratureValue = await publishTemperature(newSetupTemprature); // sending temperature to MQTT            
            res.status(200).send({
                data: tempratureValue,
                message: `${newSetupTemprature}°C ${typeTemprature} temperature applied to device successfully`
            }); // conformation of temperature to client
        } else {
            const temp = new AutoTemprature(currentTemperature, manualTemparature, null);
            let setTemprature = temp.deviceTempraure;
            const tempratureValue = await publishTemperature(setTemprature); // sending temperature to MQTT  
            res.status(200).send({
                data: tempratureValue,
                message: `${setTemprature}°C temperature applied to device successfully`
            }); // conformation of temperature to client
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Internal Server error"
        });
    }
};

 
export default setAutomaticTemprature;