const redis = require('redis')
const client = redis.createClient()

const createPayload = (type = 'application/json', topic, payload, qos = 2) => {
  return {
    qos: qos,
    topic: topic,
    payload: Buffer.from(payload),
    properties: {
      contentType: type
    }
  }
}

const getOldPayload = (name = 'old-payload') => {
  return new Promise((resolve, reject) => {
    client.get(name, (err, data) => {
      if (err) reject(err)
      resolve(data ? JSON.parse(data) : {})
    })
  })
}

module.exports = {createPayload, getOldPayload}
