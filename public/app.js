const root = document.querySelector('#payload')
let oldValue = {}

const socket = io.connect()
socket.on('connect', () => {
  socket.on('fetch', (payload) => {
    oldValue = payload
    console.log(oldValue)
    root.textContent = JSON.stringify(oldValue)
  })
  socket.on('message', (msg) => {
    console.log(msg)
  })
  socket.on('update', (update) => {
    oldValue = {...oldValue, update}
    root.textContent = JSON.stringify(oldValue)
  })
})
