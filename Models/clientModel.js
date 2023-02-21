const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    numDocument: {
        type: String,
        required: true
    },
    canal: {
        type: String,
        required: true
    },
    signUpDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Client', clientSchema)