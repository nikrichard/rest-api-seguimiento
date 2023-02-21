'use strict'
const express = require('express')
const app = express.Router()

const pedidoCtrl = require('../Controllers/pedidoController')

app.post('/registrarPedido', pedidoCtrl.registrarPedido)
app.delete('/eliminarPedido/:numSeguimiento', pedidoCtrl.eliminarPedido)
app.put('/modificarEstados/:numSeguimiento', pedidoCtrl.modificarEstados)
app.get('/mostrarPedidosPorEstados', pedidoCtrl.mostrarPedidosPorEstados)
app.get('/buscarPedido', pedidoCtrl.buscarPedido)
app.post('/insertaObservacion/:numSeguimiento', pedidoCtrl.insertaObservacion)

module.exports = app