'use strict'
const express = require('express')
const app = express.Router()

const productCtrl = require('../Controllers/productControllers')

app.post('/registerProduct', productCtrl.registerProduct)
app.delete('/deleteProduct/:code', productCtrl.deleteProduct)
app.get('/getProducts', productCtrl.getProducts)

module.exports = app