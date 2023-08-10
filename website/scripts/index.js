const button = document.getElementById('getApi')
const para = document.getElementById('text')

button.addEventListener('click', (event) => {
    fetch('http://localhost:6060/generateUniquePage')
        .then(response => response.json())
        .then(data => {
            fetch("http://localhost:6060"+data.uniqueURL)
                .then(resp => resp.text())
                .then(content => {
                    para.textContent = content
                })
        })
})