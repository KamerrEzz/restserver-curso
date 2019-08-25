const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const Usuario = require('../models/usuario');
const { verific, adminrol } = require('../middleware/auth');

app.get('/usuario',  (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)


    Usuario.find({status: true}, "name email status")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                res.status(404).json({
                    ok: false,
                    err
                })
            }
            Usuario.countDocuments({status: true}, (err, count) => {
                res.json({
                    ok: true,
                    paginas: "desde= donde empieza / limite= donde termina",
                    registered: count,
                    usuarios
                })
            })
        });
});

app.post('/usuario', [verific, adminrol], (req, res) => {
    let body = req.body

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(404).json({
                ok: false,
                err
            })

            // usuarioDB.password = null;

        } else {

            res.status(202).json({
                ok: true,
                usuarioDB
            })
        }
    })


});
app.put('/usuario/:id', [verific, adminrol], (req, res) => {
    let usuarioID = req.params.id
    let body = _.pick(req.body, ["name", "email", "img", "role", "status"])

    Usuario.findOneAndUpdate(usuarioID, body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }, (e, usuarioDB) => {

        if (e) {
            res.status(404).json({
                ok: false,
                error: e
            })
        }

        res.json({
            usuarioDB
        })

    })

});
app.delete('/usuario/:id', [verific, adminrol], (req, res) => {
    
    let id = req.params.id;
    console.log(id);
    let cambiarEstado = {
        status: false
    }
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {
 
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };
 
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "Usuario no encontrado"
                }
            })
 
        }
 
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
 
    })
}) 

module.exports = app;