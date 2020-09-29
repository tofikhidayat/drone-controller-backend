'use strict'

const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
require('dotenv').config()
const port = process.env.MQTT_PORT
const wsPort = process.env.MQTT_WEB_PORT
const redis = require('redis')
const client = redis.createClient()
const data = redis.createClient()
const util = require('./util')
server.listen(port, function () {
  console.log('server listening on port', port)
})

ws.createServer(
  {
    server: httpServer
  },
  aedes.handle
)
const broker = aedes

httpServer.listen(wsPort, function () {
  console.log('websocket server listening on port', wsPort)
})
broker.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack)
})
broker.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

broker.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id)
    if (packet.topic === 'sensor') {
      console.log(packet.payload.toString('utf8'))
    }
  }
})

// subscribe event
broker.on('subscribe', async (subscriptions, clientDevice) => {
  // console.log(subscriptions)
  if (clientDevice) {
    if (subscriptions[0]?.topic === 'control') {
      const oldPayload = await util.getOldPayload()
      // console.log(oldPayload)
      broker.publish(
        util.createPayload(
          'application/json',
          'control',
          JSON.stringify(oldPayload)
        )
      )
    }
  }
})

broker.on('unsubscribe', function (subscriptions, client) {
  if (client) {
    console.log('Client leave', subscriptions, client.id)
  }
})

broker.on('client', function (client) {
  console.log('new client', client.id)
})

client.on('message', (chanel, message) => {
  broker.publish(util.createPayload('application/json', 'control', message))
})

client.subscribe('push-update')
