const config = require('./config.json')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const sockethandler = require('./socket')
const path = require('path')

const newRoomRouter = require('./routes/homePageRouter')
const chatRoomRouter = require('./routes/chatRoomRouter')

const dal = require('./datahandler/datalayer')
dal.init(() => {
    app.use(express.json())
    app.use(express.static(path.resolve('../website')))

    app.use('/new', newRoomRouter)
    app.get('/chatroom/:id', chatRoomRouter)
    app.use((req, res) => {
        res.sendStatus(404).sendFile(path.resolve('../website/404.html'))
    })
    
    sockethandler(io)
    
    http.listen(config.server.port, () => {
        console.log(`Server listening on localhost: ${config.server.port}`)
    })
})