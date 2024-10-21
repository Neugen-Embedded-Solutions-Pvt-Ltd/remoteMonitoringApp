const dotenv = require('dotenv');
dotenv.config();

const BASEURI = process.env.WEATHER_API_URI;
const weatherKey = process.env.WEATHER_API_KEY;
const cityWeather = "india";

// fetching the weather details
exports.weatherApi = async (req, res) => {
  const weatherUrl = `${BASEURI}/${cityWeather}?unitGroup=us&key=${weatherKey}&Content-Type=json`; // Replace with your actual weather API URL
  console.log(weatherUrl);
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

    const data = await resp.json();
    console.log("weather data: ", data);
    res.status(200).send(data.days);

  } catch (error) {
    console.error("Error fetching weather data: ", error);
    res.status(500).send({
      error: 'Failed to fetch weather data'
    });
  }
};

// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Bangalore?unitGroup=us&key=FH6NQ4SCXC99EJQMUEQED2QHW&contentType=json