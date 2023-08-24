document.getElementById('chatroomForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;
    window.location.href = `http://localhost:6060/${url}`;
});
