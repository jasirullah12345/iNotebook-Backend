const express = require("express");
const connectToMongo = require("./Database");

// Connect Database(Mongo)
connectToMongo();

const app = express()
const port = 3000

// Available routes
app.use("/api",require("./routes/auth"));
app.get('/', (req, res) => {
    res.send('Its me buddy.')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})