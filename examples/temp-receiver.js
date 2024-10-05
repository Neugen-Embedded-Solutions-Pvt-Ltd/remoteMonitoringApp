const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});
client.on('error', (error) => {
    console.error('Connection error:', error);
}); 
client.subscribe('Temperatures', (err) => {
    if (!err) {
        console.log('subscribed to temperature topic');
    }
})

let topic = 'Temperatures';
client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log(`received temperature: ${data.temperature}°C`);
})