const dal = require('./datahandler/datalayer.js')

const getDateTime = () => {

}

module.exports = (io) => {
    const recieveMessage = (data) => {
        console.log("Message recieved: " + data.content)
        dal.messages.create(false, data, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(result)
        })
        io.emit('chat message', data)
    }

    const sendMessageLog = () => {
        dal.messages.get(true, {}, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(result)
        })
    }

    io.on('connection', (socket) => {
        console.log('user connected')
        sendMessageLog()
        socket.on('chat message', (data) => {
            recieveMessage(data)
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}