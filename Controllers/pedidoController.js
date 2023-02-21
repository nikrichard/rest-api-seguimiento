'use strict'
const Pedido = require('../Models/pedidoModel')
const EstadoPedido = require('../Models/estadoPedidoModel')
const Client = require('../Models/clientModel')

//Función para registrar los pedidos realizados
async function registrarPedido(req,res){
    const numSeguimiento = req.body.numSeguimiento
    const valorTotal = req.body.valorTotal
    const clientId = req.body.clientId
    const productos = req.body.products

    try {
        const numSeguimientoSearch = await Pedido.findOne({numSeguimiento: numSeguimiento}, (error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al realizar la petición: ${error}`
                })
            }
        })
        if(numSeguimientoSearch){
            res.status(200).json({
                success: false,
                message: `El código de segumiento ya está en uso o ya existe`
            })
        }else{
            let productsArray = []

            const pedido = new Pedido({
                numSeguimiento: numSeguimiento,
                valorTotal: valorTotal,
                clientId: clientId,
                products: null
            })

            //Recorremos la matriz de productos
            for(var posicion in productos){
                productsArray.push({
                    productId: productos[posicion].productId,
                    cantidad: productos[posicion].cantidad
                })
            }
            pedido.products = productsArray //Modificamos el valor de products
            await pedido.save(async (error, pedido)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al registrar pedido: ${error}`
                    })
                }else{
                    const estadoPedido = new EstadoPedido({
                        pedidoId: pedido._id
                    })
                    await estadoPedido.save()
                    res.status(200).json({
                        success: true,
                        message: `Pedido registrado correctamente`
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    }
}

//Función para eliminar el pedido
async function eliminarPedido(req,res){
    const numSeguimiento = req.params.numSeguimiento
    try {
        const pedidoSearch = await Pedido.findOne({numSeguimiento: numSeguimiento}, (error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al realizar la petición: ${error}`
                })
            }
        })
        if(!pedidoSearch){
            res.status(404).json({
                success: false,
                message: `No existe el código ingresado`
            })
        }else{
            await EstadoPedido.deleteOne({pedidoId: pedidoSearch._id},(error)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al eliminar estados del pedido: ${error}`
                    })
                }
            })
            await Pedido.deleteOne({_id: pedidoSearch._id},(error)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al eliminar el pedido: ${error}`
                    })
                }
            })
            res.status(200).json({
                success: true,
                message: `Se eliminó correctamente el pedido`
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    }
}

//Función para modificar estados y observaciones
async function modificarEstados(req,res){
    const numSeguimiento = req.params.numSeguimiento
    const nombreEstado = req.body.nombreEstado
    const valorEstado = req.body.valorEstado //Booleano
    
    try {
        const pedidoSearch = await Pedido.findOne({numSeguimiento: numSeguimiento},(error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al realizar la petición: ${error}`
                })
            }  
        })
        if(!pedidoSearch){
            res.status(404).json({
                success: false,
                message: `No existe el número de seguimiento`
            })
        }else{
            const estadoPedidoSearch = await EstadoPedido.findOneAndUpdate({pedidoId: pedidoSearch._id}, {[nombreEstado]:valorEstado}, (error)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al buscar los estados del pedido: ${error}`
                    })
                } 
            })
            if(!estadoPedidoSearch){
                res.status(404).json({
                    success: false,
                    message: `No existen los estados del pedido`
                })
            }else{
                res.status(200).json({
                    success: true,
                    message: `Se actualizó el estado correctamente`
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    }
}

//Función para mostrar pedidos por estados
async function mostrarPedidosPorEstados(req,res){
    const estado = req.query.estado
    let valor = req.query.valor
    if(valor == "true"){
        valor = true
    }else{
        valor = false
    }
    try {
        const estadosPedido = await EstadoPedido.find({[estado]: valor},(error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al buscar el pedido: ${error}`
                })
            }
        })
        if(!estadosPedido){
            res.status(404).json({
                success: false,
                message: `No existe pedidos con ese estado`
            })
        }else{
            let pedidos = []
            for(var posicion in estadosPedido){
                const estadoPedido = await Pedido.findOne({_id: estadosPedido[posicion].pedidoId})
                const client = await Client.findOne({_id: estadoPedido.clientId})
                const pedidosSearch = {
                    client: client,
                    pedido: estadoPedido,
                    estadosPedido: estadosPedido[posicion] 
                }
                pedidos.push(pedidosSearch)
            }
            res.status(200).json({
                success: true,
                pedidos: pedidos
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    }
}

//Función para buscar pedido por DNI o codigo de pedido
async function buscarPedido(req,res){
    const tipo = req.query.tipo
    const valor = req.query.valor
    try {
        if(tipo == "numSeguimiento"){
            const pedidoSearch = await Pedido.findOne({numSeguimiento: valor}, (error)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al buscar el pedido: ${error}`
                    })
                } 
            })
            if(!pedidoSearch){
                res.status(404).json({
                    success: false,
                    message: `No existe el pedido`
                })
            }else{
                const estadoPedido = await EstadoPedido.findOne({pedidoId: pedidoSearch._id}, (error)=>{
                    if(error){
                        res.status(500).json({
                            success: false,
                            message: `Error al buscar el estado del pedido: ${error}`
                        })
                    } 
                })
                if(!estadoPedido){
                    res.status(404).json({
                        success: false,
                        message: `No existe el estado del pedido`
                    }) 
                }else{
                    const client = await Client.findById(pedidoSearch.clientId, (error)=>{
                        if(error){
                            res.status(500).json({
                                success: false,
                                message: `Error al buscar el estado del pedido: ${error}`
                            })
                        }
                    })
                    if(!client){
                        res.status(404).json({
                            success: false,
                            message: `No existe el cliente`
                        })  
                    }else{
                        res.status(200).json({
                            success: true,
                            client: client,
                            pedido: pedidoSearch,
                            estadoPedido: estadoPedido
                        })
                    }
                }
            }
        }else if(tipo == "numDocument"){
            let pedidos = []

            const clientSearch = await Client.findOne({numDocument: valor},(error)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al buscar el estado del pedido: ${error}`
                    })
                }
            })
            if(!clientSearch){
                res.status(404).json({
                    success: false,
                    message: `No existe el número de documento`
                })
            }else{
                const pedidoSearch = await Pedido.find({clientId: clientSearch._id},(error)=>{
                    if(error){
                        res.status(500).json({
                            success: false,
                            message: `Error al buscar el estado del pedido: ${error}`
                        })
                    }
                })
                if(!pedidoSearch){
                    res.status(404).json({
                        success: false,
                        message: `No tiene pedidos`
                    })
                }else{
                    //Recorremos la matriz de productos
                    for(var posicion in pedidoSearch){
                        const estadoPedido = await EstadoPedido.findOne({pedidoId: pedidoSearch[posicion]._id})
                        const informacion = {
                            pedido: pedidoSearch[posicion],
                            estadoPedido: estadoPedido 
                        }
                        pedidos.push(informacion)
                    }
                    res.status(200).json({
                        client: clientSearch,
                        pedidos: pedidos
                    })
                }
                
            }
        }else{
            res.status(404).json({
                success: false,
                message: `No existe el tipo de busqueda`
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        }) 
    }
}

//Función para insertar observación
async function insertaObservacion(req,res){
    const numSeguimiento = req.params.numSeguimiento
    const observacionPedido = req.body.observacionPedido
    try {
        const pedido = await Pedido.findOne({numSeguimiento: numSeguimiento},(error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al buscar el estado del pedido: ${error}`
                })
            }
        })
        if(!pedido){
            res.status(404).json({
                success: false,
                message: `No existe el pedido`
            })
        }else{
            const pedidoId = pedido._id
            EstadoPedido.findOneAndUpdate({pedidoId: pedidoId},
                { $push: { 
                    observaciones: { 
                            observacion: observacionPedido
                        }
                    } 
                },
                {safe: true },(error)=>{
                    if (error) {
                        res.status(500).json({
                            success: false,
                            message: `Error al ingresar la observacion: ${error}`
                        })                           
                    }else{
                        res.status(200).json({
                            success: true,
                            message: `Observacion ingresada satisfactoriamente`
                        })
                    }
                }
            )
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    } 
}

module.exports = {
    registrarPedido,
    eliminarPedido,
    modificarEstados,
    mostrarPedidosPorEstados,
    buscarPedido,
    insertaObservacion
}