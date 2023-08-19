const config = require('./config.json')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const sockethandler = require('./socket')
const path = require('path')
const port = config.sever.port

const dal = require('./datahandler/datalayer')
dal.init(() => {
    app.use(express.static(path.resolve('../website')))

    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../website/index.html'))
    })
    
    sockethandler(io)
    
    http.listen(port, () => {
        console.log(`Server listening on localhost: ${port}`)
    })
})