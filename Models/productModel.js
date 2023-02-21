const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)