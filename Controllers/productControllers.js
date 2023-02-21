'use strict'
const Product = require('../Models/productModel')

//Función para registrar un producto
async function registerProduct(req,res){
    const code = req.body.code
    const name = req.body.name
    const valor = req.body.valor
    const cantidad = req.body.cantidad

    try {
        const productSearch = await Product.findOne({code: code}, (error)=>{
            if(error){
                res.status(500).json({
                    success: false,
                    message: `Error al realizar la petición: ${error}`
                })
            }
        })
        if(productSearch){
            res.status(200).json({
                success: true,
                message: `El código de producto ya está en uso`
            })
        }else{
            const product = new Product({
                code: code,
                name: name,
                valor: valor,
                cantidad: cantidad
            })
            await product.save((error,product)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al crear producto: ${error}`
                    })
                }else{
                    res.status(200).json({
                        success: true, 
                        message: 'Producto registrado satisfactoriamente'
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

//Función para eliminar un producto
async function deleteProduct(req,res){
    const code = req.params.code
    try {
        await Product.findOneAndDelete({code: code}, (error)=>{
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

//Función para mostrar productos registrados de 10 en 10
async function getProducts(req,res){
    const desde = req.query.desde || 0
    try {
        const products = await Product.find({},
            {
                code: 1,
                name: 1,
                valor: 1,
                cantidad: 1
            }
        )
        .skip(parseInt(desde))
        .limit(10)
        .sort({ _id: -1 }); //-1 para descendente y 1 para ascendente
        const countProducts = await Product.countDocuments();
        res.status(200).json({
            status: true, 
            products, 
            total: countProducts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        });
    }
}

module.exports = {
    registerProduct,
    deleteProduct,
    getProducts
}

