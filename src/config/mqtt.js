// configuration for MQTT broker
import mqtt from 'mqtt';

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

 

export default mqttClient;