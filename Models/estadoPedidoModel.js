const mongoose = require('mongoose')
const Schema = mongoose.Schema

const estadoPedidoSchema = new Schema({
    pedidoId: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido'
    },
    creado: {
        type: Boolean,
        default: true
    },
    pago: {
        type: Boolean,
        default: false
    },
    procesando: {
        type: Boolean,
        default: false
    },
    enviado: {
        type: Boolean,
        default: false
    },
    entregado: {
        type: Boolean,
        default: false
    },
    devuelto: {
        type: Boolean,
        default: false
    },
    novedad: {
        type: Boolean,
        default: false
    },
    reembolso: {
        type: Boolean,
        default: false
    },
    observaciones: [{
        observacion: {
            type: String
        },
        fechaObservación: {
            type: Date,
            default: Date.now()
        }
    }]
})

module.exports = mongoose.model('EstadoPedido', estadoPedidoSchema)