// Fetching Weather data from Public API
const WeatherApiData = async () => {
  const weatherUrls = `${process.env.WEATHER_API_URI}?key=${process.env.WEATHER_API_KEY}&q=bangalore&days=10&aqi=no&alerts=no`; // Replace with your actual weather API URL
  try {
    const resp = await fetch(weatherUrls);
    if (!resp.ok) {
      throw new Error(`Failed to get weather data ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data: ", error);
    throw error;
  }
};

export default WeatherApiData;
