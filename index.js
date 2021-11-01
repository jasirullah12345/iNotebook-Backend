const express = require("express");
const connectToMongo = require("./Database");

// Connect Database(Mongo)
connectToMongo();

const app = express()
const port = 3000

// For getting request body
app.use(express.json())

// Available routes
app.use("/api",require("./routes/auth"));
app.get('/', (req, res) => {
    res.send('Its me buddy.')
})

app.listen(port, () => {
    console.log(`Application is running at http://localhost:${port}`)
})