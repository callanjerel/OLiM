const dal = require('./datahandler/datalayer.js')

const addMetaData = (data) => {
    let date = new Date()
    data.timestamp = date.toISOString()
}

const recieveMessage = (data, io) => {
    console.log("Message recieved: " + data.content)
    addMetaData(data)
    dal.messages.create(false, data, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        if (result.acknowledged) {
            console.log("Message persisted")
        }
    })
    io.emit('chat message', data)
}

const sendMessageLog = (specificSocket) => {
    dal.messages.get(true, {}, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        specificSocket.emit('message log', result)
    })
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected')
        sendMessageLog(socket)
        socket.on('chat message', (data) => {
            recieveMessage(data, io)
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}