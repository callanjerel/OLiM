const button = document.getElementById('b')
const message = document.getElementById('m')

// Connect to the server
const socket = io.connect('http://localhost:6060')

// On a successful connection, log a connection success
socket.on('connect', () => {
    console.log('connected to server')
})

//This calls the callback when it recieves a message
//Recieves some data, under the variable 'data' from the server
//The parameter, 'chat message', is the name for the socket
socket.on('chat message', (data) => {
    console.log(data)
    console.log(data.user)
    console.log(data.body)
    console.log(data.timestamp)
})

//This is an eventListener, which calls the function inside when clicked
button.addEventListener("click", () => {
    console.log("Message sent")
    //socket.emit sends a message
    //sends it under the 'chat message' socket
    //the second parameter is the message that the server will recieve
    let messageJson = {
        user:'anon',
        body:message['value']
    }
    socket.emit('chat message', messageJson)
})
