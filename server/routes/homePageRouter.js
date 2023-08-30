const dal = require('../datahandler/datalayer')
const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.sendFile(path.resolve('../website/homepage.html'))
})

router.post('/create', (req, res) => {
    const params = req.body

    dal.chatRooms.get(false, { invite_code:params.invite_code }, (err, result) => {
        if (err) {
            console.error(err)
            res.sendStatus(500)
            return
        }

        if (Boolean(result)) {
            res.json({ created:false })
            return
        } 

        dal.chatRooms.create(false, { 
            admin_user_id:0, 
            invite_code:params.invite_code, 
            password_hash:params.password, 
            users:[], 
            messages:[] },
            (err, result) => {
                if (err) {
                    console.error(err)
                    res.sendStatus(500)
                    return
                }
                res.json( { created:Boolean(result) })
            })
    })
})

module.exports = router