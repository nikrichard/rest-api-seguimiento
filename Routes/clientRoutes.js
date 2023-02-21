'use strict'
const express = require('express')
const app = express.Router()

const clientCtrl = require('../Controllers/clientControllers')

app.post('/signupClient', clientCtrl.signUpClient)
app.delete('/deleteClient/:numDocument', clientCtrl.deleteClient)
app.get('/getClients', clientCtrl.getClients)

module.exports = app
