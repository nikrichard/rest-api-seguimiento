const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pedidoSchema = new Schema({
    numSeguimiento: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    valorTotal: {
        type: Number
    },
    clientId : {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'    
        },
        cantidad: {
            type: Number
        }
    }]
})

module.exports = mongoose.model('Pedido', pedidoSchema)