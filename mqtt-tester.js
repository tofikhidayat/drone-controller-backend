var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://127.0.0.1')

client.on('connect', function () {
  client.subscribe('control', function (err) {
    if (!err) {
      client.publish('sensor', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(topic)
  console.log(message.toString())
  //   client.end()
})

client.on('data', function (topic, mesage) {
  console.log('From data')
  console.log(topic)
  console.log(message)
})
