const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/chatroom/:id', (req, res) => {
    console.log(req.params.id)
    res.sendFile(path.resolve('../website/chatroom.html'))
})

module.exports = router