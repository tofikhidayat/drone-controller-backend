const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const dotenv = require('dotenv').config()
const cors = require('cors')
const redis = require('redis')
const {rejects} = require('assert')
const e = require('express')
const client = redis.createClient()
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const getOldPayload = () => {
  return new Promise((resolve, reject) => {
    client.get('old-payload', (err, data) => {
      if (err) reject(err)
      resolve(data ? JSON.parse(data) : {})
    })
  })
}

io.on('connection', async (socket) => {
  let oldPayload = await getOldPayload()
  socket.emit('message', ' ========= WELCOME ========')
  socket.emit('fetch', oldPayload)
  socket.on('pushUpdate', (newData) => {
    oldPayload = {...oldPayload, ...newData}
    client.set('old-payload', JSON.stringify(oldPayload))
    client.publish('push-update', JSON.stringify(oldPayload))
    // io.emit('update', oldPayload)
  })
})

http.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`listening on *:${process.env.PORT}`)
})
