const datalayer = {}

const recieveMessage = (data) => {
        console.log("Message recieved: " + data)
        msg.timestamp = '12:00:00'
        io.emit('chat message', msg)
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected')
    
        socket.on('chat message', recieveMessage)
    
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}