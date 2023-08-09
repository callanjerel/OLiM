const express = require('express')
const cors = require('cors')
const app = express()
const port = 6060

app.use(cors())

app.get('/api', (req, res) => {
    res.json({message: 'Backend connected :)'})
})

app.listen(port, () => {
    console.log(`Server listening on localhost:${port}`)
})