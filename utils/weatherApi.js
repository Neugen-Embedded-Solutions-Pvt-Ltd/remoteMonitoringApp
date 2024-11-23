const weatherApiData = async () => {
    const weatherUrls = 'http://api.weatherapi.com/v1/forecast.json?key=877c85b3db6c4a4c997165011241211&q=bangalore&days=10&aqi=no&alerts=no'; // Replace with your actual weather API URL
    try {
        const resp = await fetch(weatherUrls);
        if (!resp.ok) {
            throw new Error(`Failed to get weather data ${resp.status}`);
        }
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        throw error
    }
};

export default weatherApiData;