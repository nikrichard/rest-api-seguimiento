'use strict'
const userControllers = require('../../../Atlanta/rest-api-evans-edwin/controllers/userControllers')
const { countDocuments } = require('../Models/clientModel')
const Client = require('../Models/clientModel')

//Función para crear cliente
async function signUpClient(req,res){
    const name = req.body.name
    const surname = req.body.surname
    const numDocument = req.body.numDocument
    const canal = req.body.canal

    try {
        const clientSearch = await Client.findOne({numDocument: numDocument}, (error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al realizar la petición: ${error}`
                })
            }
        })
        if(clientSearch){
            res.status(200).json({
                success: true,
                message: `El número de documento ya está en uso`
            })
        }else{
            const client = new Client({
                name: name,
                surname: surname,
                numDocument: numDocument,
                canal: canal
            })
            await client.save((error,client)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al crear usuario: ${error}`
                    })
                }else{
                    res.status(200).json({
                        success: true, 
                        message: 'Cliente registrado satisfactoriamente'
                    });    
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

//Función para eliminar cliente
async function deleteClient(req,res){
    const numDocument = req.params.numDocument
    try {
        await Client.findOneAndDelete({numDocument: numDocument}, (error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al realizar la petición: ${error}`
                })
            }else{
                res.status(200).json({
                    success: true,
                    message: `Eliminación satisfactoria`
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    }
}

//Función para mostrar clientes registrados de 10 en 10
async function getClients(req,res){
    const desde = req.query.desde || 0
    try {
        const clients = await Client.find({},
            {
                name: 1,
                surname: 1,
                numDocument: 1,
                canal: 1
            }
        )
        .skip(parseInt(desde))
        .limit(10)
        .sort({ _id: -1 }); //-1 para descendente y 1 para ascendente
        const countClients = await Client.countDocuments();
        return res.status(200).json({
            status: true, 
            clients, 
            total: countClients
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error: ${error}`
        });
    }
}

module.exports = {
    signUpClient,
    deleteClient,
    getClients
}