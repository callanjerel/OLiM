const dal = require('../datahandler/datalayer')
const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    console.log('imagine a home page')
    res.sendFile(path.resolve('')) // <- put index.html
})

router.post('/create', (req, res) => {
    const params = req.body
    dal.chatRooms.create(false, {admin_user_id:0, invite_code:params.invite_code, password_hash:params.password, users:[], messages:[] },
    (err, result) => {
        if (err) {
            res.sendStatus(500)
            return
        }
        console.log(result)
        res.send(`Created chatroom with invite code ${params.invite_code} and password ${params.password}`)
    })
})

module.exports = router