document.getElementById('chatroomForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    const name = document.getElementById('name').value;
    
    sessionStorage.setItem('chatroomName', name);


    window.location.href = `http://localhost:6060/${url}`;  
});

