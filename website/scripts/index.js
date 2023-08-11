const button = document.getElementById('b')
const message = document.getElementById('m')

// Connect to the server
const socket = io.connect('http://localhost:6060')

// On a successful connection, log a connection success
socket.on('connect', () => {
    console.log('connected to server')
})

button.addEventListener("click", () => {
    console.log("your mother")
    socket.emit('chat message', message['value'])
})
