const mqtt = require('mqtt')


const host = 'broker.hivemq.com';
// const host = 'broker.emqx.io';

const port = '1883'
const clientId = `mqttx_1af71cf2`;
const connectUrl = `mqtt://${host}:${port}`
// mqttx provider configuration
// const mqttClient = mqtt.connect(connectUrl, {
//   clientId,
//   clean: true,
//   connectTimeout: 4000,
//   username: 'emqx',
//   password: 'public',
//   reconnectPeriod: 1000,
// })
// const mqttClient = mqtt.connect('mqtt://broker.emqx.io:1883');

// mosquitto provider configuration

const mqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})



mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});
mqttClient.on('error', (error) => {
  console.error('Connection error:', error);
});
module.exports = mqttClient;