const express = require('express');
let app = express()

let {verific,adminrol} = require('../middleware/auth');

let Product = require('../models/producto');

app.get('/productos', (req,res) => {
//traer todos los productos
//pupulate: usuario categoria
//paginado

let desde = req.query.desde || 0;
desde = Number(desde)
let limite = req.query.limite || 5;
limite = Number(limite)

Product.find({disponible: true})
.skip(desde)
.limit(limite)
.populate('usuario', 'name')
.populate('categoria', 'name')
.exec((err, p) => {
    if(err){
        res.status(404).json({
            ok: false,
            err
        })
    }

    Product.countDocuments({disponible: true}, (err, acount) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            query: "desde= Empieza/ limite= termina",
            Paginas: acount,
            p
        })
    })
})

})
.get('/productos/:id', (req,res) => {
    //populate
    let id = req.params.id
    Product.findById(id)
    .populate('usuario', "name")
    .populate('categoria', "name")
    .exec((err, p) => {
        if(err){
            res.status(500).json({
                ok:false,
                err
            })
        }
        if(!p){
            res.status(404).json({
                ok: false,
                message: "Producto no encontrado"
            })
        }
    
        res.json({
            ok: true,
            p
        })

    })
})
.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    Product.find({nombre: regex})
        .populate('usuario', 'name')
        .populate('categoria', "name")
        .exec((err,p) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            }
            if(!p){
                res.status(404).json({
                    ok: false,
                    message: "Producto no encontrado"
                })
            }

            res.json({
                ok: true,
                p
            })
        })
})
.post('/productos', [verific], (req,res) => {
    //guardar el usuario
    //grabar una categoria del listado
    let body = req.body;

    let productos = new Product({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    productos.save((err, producdb) => {
        if(err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if(!producdb) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(202).json({
            ok: true,
            producto: producdb
        })
    })
})
.put('/productos/:id', [verific],(req,res) => {
    let body = req.body;
    let id = req.params.id;


    Product.findById(id,(err, producdb) => {
        if(err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if(!producdb){
            res.status(404).json({
                ok: false,
                message: "No Existe el producto"
            })
        }

        producdb.nombre  = body.nombre
        producdb.precioUni = body.precioUni
      producdb.descripcion = body.descripcion
       producdb.disponible = body.disponible
        producdb.categoria = body.categoria

        producdb.save((err, productsave) => {
            if(err) {
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productsave
            })
        })
    })
})
.delete('/productos/:id', (req, res) => {
    //actualizar el estado
    //estado por defecto true
    let id = req.params.id
    let CambiarEstado = {
        disponible: false
    }

    Product.findByIdAndUpdate(id, CambiarEstado, {new: true}, (err, pb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!pb){
            return res.status(404).json({
                ok: false,
                message: "Prodcuto no encontrado"
            })
        }

        res.json({
            ok: true,
            Producto: pb
        })
    })

})

module.exports = app;