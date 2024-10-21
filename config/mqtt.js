// configuration for MQTT broker
const mqtt = require('mqtt');

const host = 'broker.hivemq.com';
const port = '1883'
const clientId = `mqttx_1af71cf2`;
const connectUrl = `mqtt://${host}:${port}`;

// create connection
const mqttClient = mqtt.connect(connectUrl);

// establish connection
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// if error is return it will be returned
// mqttClient.on('error', (error) => {
//   console.error('Connection error:', error);
// });

module.exports = mqttClient;