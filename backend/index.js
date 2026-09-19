import express from 'express'

const app = express()


const PORT = 8000


app.get('/', (req, res) => {
    res.json("Hello from server")
})

app.listen(PORT, () => {
    console.log(`server started on Port ${PORT}`)
})