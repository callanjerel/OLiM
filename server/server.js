const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const port = 6060

// app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve('../website')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve('../website/index.html'))
})

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('chat message', (msg) => {
        console.log("Message recieved: " + msg)
        io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

http.listen(port, () => {
    console.log(`Server listening on localhost:${port}`)
})