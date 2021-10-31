const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const noteSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("note",noteSchema)