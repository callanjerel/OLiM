const button = document.getElementById('b')
const message = document.getElementById('m')
/* robs code
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
*/
// const button = document.getElementById('getApi')
const para = document.getElementById('text')
const socket = io.connect('http://localhost:6060');

socket.on('connect', function() {
    console.log('Connected to the server.');
});

// Listen for any custom events from the server
socket.on('chat message', function(msg) {
    // Handle the incoming message, maybe display it on the page
    console.log('Received:', msg);
});


// const socket = io();//creating an instance of the socket.io client

// Handle incoming messages from the server

//Outside: Sets up a listener for the event 'chatMessage' coming from the server, indicating incoming messages from other users..
socket.on('chatMessage', (message) => {

//Local: Finds the HTML element (<ul>) with the ID 'messages', where chat messages will be displayed.
const messages = document.getElementById('messages');

//Local: Creates a new list item (<li>) element to display each chat message, this is prepared for a local user action.
const li = document.createElement('li');

//Outside: Assigns the text content of the newly created <li>
//element with the message received from the server, which was sent by an outside user.
li.textContent = message;

//Local: Appends the newly created <li> element (with the received chat message) 
// to the <ul> element with the ID 'messages' for local display.
messages.appendChild(li);
});

// Local: Finds the HTML <form> (textbox) element with the ID 'message-form', where the local user can enter messages.
const form = document.getElementById('message-form');

//Local: Finds the HTML <input> element with the ID 'message-input', where the local user can type their messages.
//this <input> element will be between the <form></form> tags
const input = document.getElementById('message-input');

// Local: Sets up an event listener for when the local user submits the form (sends a message).
form.addEventListener('submit', (event) => {

// Local: Prevents the default behavior of the form submission, which avoids reloading the page.
event.preventDefault();

// Local: Retrieves the current value (text) of the input field where the local user typed their message.
const message = input.value;

// Local: Clears the input field by setting its value to an empty string after sending the message.
input.value = '';

// Local: Sends the message typed by the local user to the server using the 'chatMessage' event, 
// so the server can broadcast it to other connected clients (including outside users).
socket.emit('chatMessage', message);
});