const dal = require('./datahandler/datalayer.js')

const checkRoomExists = (roomId, callback = () => {}) => {
    dal.chatRooms.get(false, { invite_code:roomId }, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        callback(Boolean(result))
    })
}

const checkRoomPassword = (roomId, roomPassword, callback = () => {}) => {
    dal.chatRooms.get(false, { invite_code:roomId, password_hash:roomPassword }, (err, result) => {
        if (err) {
            console.error(err)
            return
        }

        callback(Boolean(result))
    })
}

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
        dal.chatRooms.update(false, { invite_code:roomId }, { $push: { messages:dal.lastId.messages } }, (err, result) => {
            if (err) {
                console.error(err)
            }
            if (result.acknowledged) {
                console.log("MessageId stored")
            }
        })
    })
    io.to(roomId).emit('chat message', data)
}

const sendMessageLog = (specificSocket, roomId) => {
    let messageLog = []
    dal.chatRooms.get(false, { invite_code:roomId }, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        
        if (!result) {
            return
        }

        console.log(result.messages.length)

        let completedCalls = 0;

        result.messages.forEach((messageId) => {
            dal.messages.get(false, { id:messageId }, (err, messageResult) => {
                completedCalls++
                if (err) {
                    console.error(err)
                    return
                }
                messageLog.push(messageResult)
                
                if (completedCalls == result.messages.length) {
                    specificSocket.emit('message log', messageLog)
                }
            })
        })
    })
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected')
    
        socket.on('room exists', (roomId) => {
            checkRoomExists(roomId, (isRoomExists) => {
                socket.emit('room exists', isRoomExists)
            })
        })

        socket.on('join room', (roomId, roomPassword) => {
            checkRoomPassword(roomId, roomPassword, (result) => {
            if (result) {
                socket.join(roomId)
                sendMessageLog(socket, roomId)
                socket.emit('join room', true)
            } else {
                socket.emit('join room', false)
            }
            })
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