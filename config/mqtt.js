// configuration for MQTT broker

const mqtt = require('mqtt');

const host = 'broker.hivemq.com';
const port = '1883'
const clientId = `mqttx_1af71cf2`;
const connectUrl = `mqtt://${host}:${port}`;

const mqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (error) => {
  console.error('Connection error:', error);
});

module.exports = mqttClient;