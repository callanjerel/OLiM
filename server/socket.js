const dal = require('./datahandler/datalayer.js')
const auth = require('./datahandler/auth.js')

const checkRoomExists = (roomId, callback = () => {}) => {
    dal.chatRooms.get(false, { invite_code:roomId }, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        const isExists = Boolean(result)
        console.log(`${roomId} exists: ${isExists}`)
        if (isExists) {
            callback(isExists, result.name)
        } else {
            callback(false, null)
        }
    })
}

const checkRoomPassword = (roomId, roomPassword, callback = () => {}) => {
    //this whole function is terrible lmao
    dal.chatRooms.get(false, { invite_code:roomId }, (err, roomResult) => {
        if (err) {
            console.error(err)
            return
        }

        auth.validatePassword(roomPassword, roomResult.password_hash, (err, result) => {
            if (err) {
                console.log(err)
                callback(false)
                return
            }
            if (result) {
                callback(roomResult)
            } else {
                callback(false)
            }
        })
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
        dal.chatRooms.update(false, { invite_code:roomId }, { $push: { messages:dal.lastId.messages } }, (err, result) => {
            if (err) {
                console.error(err)
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

const sendJoinAnnouncement = (io, roomId, isJoin, userId) => {
    let announcementMessage = {
        user_id:0,
        content: isJoin ? `${userId} joined room` : `${userId} left room`
    }
    addMetaData(announcementMessage)
    io.to(roomId).emit('chat message', announcementMessage)
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected')
    
        socket.on('room exists', (roomId) => {
            checkRoomExists(roomId, (isRoomExists, roomName) => {
                socket.emit('room exists', isRoomExists, roomName)
            })
        })

        socket.on('join room', (roomId, roomPassword, userId) => {
            checkRoomPassword(roomId, roomPassword, (result) => {
                if (result) {
                    console.log(`User joined room ${roomId}`)
                    socket.join(roomId)
                    sendJoinAnnouncement(io, roomId, true, userId)
                    sendMessageLog(socket, roomId)
                    socket.emit('join room', true, result.admin_user_id)
                } else {
                    socket.emit('join room', false, null)
                }
            })
        })

        socket.on('leave room', (roomId, userId) => {
            sendJoinAnnouncement(io, roomId, false, userId)
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