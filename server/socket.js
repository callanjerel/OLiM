const dal = require('./datahandler/datalayer.js')



module.exports = (io) => {
    const recieveMessage = (data) => {
        console.log("Message recieved: " + data.body)
        data.timestamp = '12:00:00'
        dal.chatRooms.create(false, {
            id:"thisisthefirstroom",
            admin_user_id:"0",
            invite_code:"",
            users:"",
            messages:[
                data
            ]
        }, (err, result) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(result)
        })
        io.emit('chat message', data)
    }

    io.on('connection', (socket) => {
        console.log('user connected')
    
        socket.on('chat message', (data) => {
            recieveMessage(data)
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}