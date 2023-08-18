const socket = io.connect('http://localhost:6060');
const messageContainer = document.getElementById('messages');
const form = document.getElementById('message-form');
const sendButton = document.getElementById('b')
const input = document.getElementById('message-input');

const getUserId = () => {
    let storedId = localStorage.getItem('user_id')
    if (storedId) {
        console.log(`user_id already stored: ${storedId}`)
        return storedId.toString()
    }
    storedId = Math.floor((Math.random() * 10000))
    console.log(`user_id not stored, new id: ${storedId}`)
    localStorage.setItem('user_id', storedId.toString())
    return storedId
}

const userId = getUserId() 

socket.on('connect', () => {
    console.log('Connected to the server.')
});

const displayMessage = (data) => {
    console.log(`Received: ${data.user_id}: ${data.content}`)
    // Create messageElement and assign text
    const messageElement = document.createElement('li')
    messageElement.textContent = `${data.user_id}: ${data.content}`;
    // Add messageElement to the messageContainer
    messageContainer.appendChild(messageElement)
} 

// Recieve and display message history
socket.on('message log', (data) => {
    if (!data) return
    for (index in data) {
        displayMessage(data[index])
    }
})

// Recieve, and display message
socket.on('chat message', (data) => {
    displayMessage(data)
})

// sends the message, you just pass in the message body
const sendMessage = (content) => {
    content = content.trim()
    if (!content || content.length === 0) {
        return
    }
    let data = {
        'id':null,
        'user_id':userId, // <- This needs to be converted to an int in the future, when liam finished dal update
        'timestamp':null,
        'content':content
    }
    socket.emit('chat message', data)
}

// On sendButton click, send the message to the server
sendButton.addEventListener('click', (event) => {
    event.preventDefault();
    const content = input.value;
    input.value = '';
    sendMessage(content)
})

form.addEventListener('submit', (event) => {//code to fix enter bug
    event.preventDefault();
    const content = input.value;
    input.value = '';
    sendMessage(content)
})