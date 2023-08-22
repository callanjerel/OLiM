const socket = io.connect('http://localhost:6060');
const messageContainer = document.getElementById('messages');
const form = document.getElementById('message-form');
const sendButton = document.getElementById('b')
const input = document.getElementById('message-input');

//////////////////////////////  User ID  //////////////////////////////

const getUserId = () => {
    let storedId = localStorage.getItem('user_id')
    if (storedId && typeof(storedId) === 'number') {
        console.log(`user_id already stored: ${storedId}`)
        return storedId()
    }
    storedId = Math.floor((Math.random() * 10000))
    console.log(`user_id not stored or not number, new id: ${storedId}`)
    localStorage.setItem('user_id', storedId)
    return storedId
}

const userId = getUserId() 

socket.on('connect', () => {
    console.log('Connected to the server.')
});

//////////////////////////////  Recieve Message   //////////////////////////////

const formatDate = (isoString) => {
    let dateObj = new Date(isoString);

    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
}

const displayMessage = (data) => {
    console.log(`Received: ${data.user_id}: ${data.content}`)
    // Format date for local time
    const formattedDate = formatDate(data.timestamp)

    // Create messageElement and assign text
    const messageElement = document.createElement('li')


    if (data.user_id === userId) {
        messageElement.innerHTML = `<div class="metadata">me (${data.user_id}) @ ${formattedDate}:</div><div class="messageContent">${data.content}</div>`;
    } else {
        messageElement.innerHTML = `<div class="metadata"> (${data.user_id}) @ ${formattedDate}:</div><div class="messageContent">${data.content}</div>`;

    }
    // Add messageElement to the messageContainer
    messageContainer.appendChild(messageElement)

    scrollToBottom()
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

//////////////////////////////  Send Message   //////////////////////////////

// sends the message, you just pass in the message body
const sendMessage = (content) => {
    content = content.trim()
    if (!content || content.length === 0) {
        return
    }
    if (content == '/clearId') {
        localStorage.clear()
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
    scrollToBottom();
})

form.addEventListener('submit', (event) => {//code to fix enter bug
    event.preventDefault();
    const content = input.value;
    input.value = '';
    sendMessage(content)
    scrollToBottom();
})


const messagesContainer = document.getElementById("messages");

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}