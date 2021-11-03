const express = require("express");
const connectToMongo = require("./Database");

// Connect Database(Mongo)
connectToMongo();

const app = express()
const port = 3000

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