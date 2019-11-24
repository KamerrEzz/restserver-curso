const express = require('express');
let app = express()

let {
    verific,
    adminrol
} = require('../middleware/auth');

let Categoria = require('../models/categoria');


// Mostrar Todas la categoria
app.get('/categoria', (req, res) => {
   
    Categoria.find({})
    .populate('user', "name")
    .exec((err, cateDB) => {

        if (err) {
            res.status(404).json({
                ok: false,
                err
            })
        }
        Categoria.countDocuments({}, (err, count) => {
            res.json({
                ok: true,
                registered: count,
                cateDB
            })
        })
    });

})
// Mostrar la categoria por ID
app.get('/categoria/:id', (req, res) => {
    //categoria.findById()
    let cateID = req.params.id;
    
    Categoria.findById(cateID, (err, cateDB) => {

        if(err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!cateDB){
            return res.status(500).json({
                ok: false,
                err: {
                    message: "ID no valido"
                }
            })
        }

        res.json({
            ok: true,
            cateDB
        })
    })
})
// crear categoria
app.post('/categoria', [verific, adminrol], (req, res) => {
    //regreas la nueva categoria
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        name: body.name,
        user: req.usuario._id
    })

    categoria.save((err, cateDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!cateDB) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(202).json({
            ok: true,
            categoria: cateDB
        })
    })
})
// actualizar categoria
app.put('/categoria/:id', (req, res) => {
    let cateID = req.params.id;

    let cateUp = {
        name: req.body.name
    }

    Categoria.findOneAndUpdate(cateID, cateUp, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }, (err, cateDB) => {
        if (err) {
            res.status(404).json({
                ok: false,
                error: e
            })
        }

        res.json({
            cateDB
        })

    })

})
// eliminar categoria
app.delete('/categoria/:id', [verific, adminrol], (req, res) => {
    let cateID = req.params.id
    Categoria.findByIdAndRemove(cateID, (err, cateDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!cateDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: "Categoria No Encontrada"
                }
            })
        }

        res.json({
            ok: true,
            Category: cateDB
        })
    })
})

module.exports = app;