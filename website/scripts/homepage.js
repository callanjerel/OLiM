const inviteElement = document.getElementById('url')
const joinElement = document.getElementById('joinUrl')
const passwordElement = document.getElementById('password')
const nameElement = document.getElementById('name')

document.getElementById('chatroomForm').addEventListener('submit', function(event) {
    event.preventDefault()

    const roomData = {
        invite_code:inviteElement.value,
        password:passwordElement.value,
        name:nameElement.value
    }

    inviteElement.value = ""
    passwordElement.value = ""
    nameElement.value = ""

    fetch('http://localhost:6060/new/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)})
        .then(response => response.json())
        .then((data) => {
            if (data.created) {
                window.location.replace(`http://localhost:6060/chatroom/${roomData.invite_code}`)
            } else {
                alert("That invite code is already in use!")
            }
        })
});

document.getElementById('joinroomForm').addEventListener('submit', function(event) {
    event.preventDefault()
    let joinCode = joinElement.value
    joinCode = joinCode.replace('http://', '')
    joinCode = joinCode.replace('localhost:6060', '')
    joinCode = joinCode.replace('chatroom', '')
    joinCode = joinCode.replace('/', '').trim()
    joinElement.value = ''
    window.location.replace(`http://localhost:6060/chatroom/${joinCode}`)   
})