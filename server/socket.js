const dal = require('./datahandler/datalayer.js')

const addMetaData = (data) => {
    let date = new Date()
    data.timestamp = date.toISOString()
}

const recieveMessage = (data, io, roomId) => {
    console.log("Message recieved: " + data.content)
    addMetaData(data)
    dal.messages.create(false, data, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        if (!result.acknowledged) {
            return
        }
        console.log("Message persisted")
        console.log(result)
        dal.chatRooms.update(false, {invite_code:'asdf', id:1}, {$push: {messages:data.id}}, (err, result) => {
            if (err) {
                console.error(err)
            }
            console.log(result)
        })
    })
    io.to(roomId).emit('chat message', data)
}

const sendMessageLog = (specificSocket) => {
    let messageLog = []
    dal.chatRooms.get(false, {invite_code:'asdf', id:1}, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        
        if (result.message == null) {
            return
        }

        result.messages.forEach((messageId) => {
            dal.messages.get(false, {id:messageId}, (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                messageLog.push(result)
            })
        })
        if (messageLog.length > 0) {
            specificSocket.emit('message log', messageLog)
        }
    })
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected')
        sendMessageLog(socket)

        socket.on('join room', (roomId) => {
            socket.join(roomId)
            sendMessageLog(socket, roomId)
        })

        socket.on('leave room', (roomId) => {
            socket.leave(roomId)
        })

        socket.on('chat message', (data, roomId) => {
            recieveMessage(data, io, roomId)
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}