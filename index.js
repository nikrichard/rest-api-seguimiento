const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()

const config = require('./Config/config')

const clientRoute = require('./Routes/clientRoutes')
const productRoute = require('./Routes/productRoutes')
const pedidoRoute = require('./Routes/pedidoRoute')

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev'))

//Rutas
app.use('/api', clientRoute)
app.use('/api', productRoute)
app.use('/api', pedidoRoute)

mongoose.connect(
    //Conexión a la base de datos
	config.db, 
	{
		useUnifiedTopology: true,
		useNewUrlParser: true, 
		useFindAndModify: false,
		useCreateIndex: true
	}, (err)=>{
        if (err) {
            return console.log(`Error al conectar a la base de datos: ${err}`)
        }else{
            console.log('Conexión a la base de datos exitosa')
        }
    
    //Puesta en marcha del servidor
	app.listen(config.port, ()=>{
		console.log(`Servidor corriendo en el Puerto: ${config.port}`)
	})
   
})