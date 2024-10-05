function tempratureMqtt(topic) {
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
    client.publish(topic, 'nodejs mqtt test', {
        qos: 0,
        retain: false
    }, (error) => {
        if (error) {
            console.error(error)
        }
    })

    client.on('message', (topic, payload) => {
        console.log('Received Message:', topic, payload.toString())
    })
}