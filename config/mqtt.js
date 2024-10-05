const mqtt = require('mqtt')

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqttx_8efbd117`;

const connectUrl = `mqtt://${host}:${port}`
const mqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})
mqttClient.on('connect', () => {
  console.log('mqtt Connected')
  // client.subscribe([topic], () => {
  //   console.log(`Subscribe to topic '${topic}'`)
  // })
  // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
  //   if (error) {
  //     console.error(error)
  //   }
  // })
});
// client.on('message', (topic, payload) => {
//   console.log('Received Message:', topic, payload.toString())
// })

module.exports = mqttClient;