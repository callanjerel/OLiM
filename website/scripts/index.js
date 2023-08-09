const button = document.getElementById('getApi')
const para = document.getElementById('text')

button.onclick = (event) => {
    fetch('http://localhost:6060/api')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            para.innerHTML = JSON.stringify(data)
        })
    console.log("we are clicked bois")
}