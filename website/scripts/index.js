const button = document.getElementById('getApi')
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