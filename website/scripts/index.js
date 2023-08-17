const button = document.getElementById('b')
const message = document.getElementById('m')

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

//Outside: Sets up a listener for the event 'chat message' coming from the server, indicating incoming messages from other users..
socket.on('chat message', (message) => {
    
   const tMessage = input.value.trim();
    if (tMessage === '') {
        // If the message is empty after trimming, then don't send it.
        console.warn("Empty message not sent");
        return;
    }
console.log("hello")
console.log(message.body)

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
const b = document.getElementById('b')

//Local: Finds the HTML <input> element with the ID 'message-input', where the local user can type their messages.
//this <input> element will be between the <form></form> tags
const input = document.getElementById('message-input');






// Local: Sets up an event listener, activates when user enters a message
b.addEventListener('click', (event) => {

// Local: Prevents the default behavior of the form submission, which avoids reloading the page.
event.preventDefault();

// Local: Retrieves the current value (text) of the input field where the local user typed their message.
const message = input.value;

// Local: Clears the input field by setting its value to an empty string after sending the message.
input.value = '';


// Local: Sends the message typed by the local user to the server using the 'chat message' event, 
// so the server can broadcast it to other connected clients (including outside users).
socket.emit('chat message', message);
});

form.addEventListener('submit', (event) => {//code to fix enter bug
    event.preventDefault();

    const message = input.value.trim();
  
    if (message === '') {
        // If the message is empty after trimming, then don't send it.
        console.warn("Empty message not sent");
        return;
    }

    input.value = '';
    socket.emit('chat message', message);
});