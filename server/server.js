const config = require('./config.json')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const sockethandler = require('./socket')
const path = require('path')

const dal = require('./datahandler/datalayer')
dal.init(() => {
    app.use(express.static(path.resolve('../website')))

    app.get('/:id', (req, res) => {
        console.log(req.params.id)
        res.sendFile(path.resolve('../website/index.html'))
    })
    
    sockethandler(io)
    
    http.listen(config.server.port, () => {
        console.log(`Server listening on localhost: ${config.server.port}`)
    })
})