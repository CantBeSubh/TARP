const express = require('express')
const app = express()

app.use(express.json())

var location = null
app
    .get('/', (req, res) => {
        res.status(200).json({
            "Hello": "World"
        })
    })
    .post('/location', (req, res) => {
        newData = req.body
        location = newData
        res.status(newData ? 200 : 400).json({
            status: `${newData ? 200 : 400}`,
            newData
        })
    })
    .get('/location', (req, res) => {
        res.status(location ? 200 : 400).json({
            status: `${location ? 'success' : 'error'}`,
            result: location
        })
    })

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})