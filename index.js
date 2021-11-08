const express = require("express");
const connectToMongo = require("./Database");
const cors = require('cors')

// Connect Database(Mongo)
connectToMongo();

const app = express()
const port = 5000

// For Direct Browser Request
app.use(cors())
// For getting request body
app.use(express.json())

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/note"));
app.get('/', (req, res) => {
    res.send('This API belongs to Jasir Ullah Khan.')
})

app.listen(port, () => {
    console.log(`Application is running at http://localhost:${port}`)
})