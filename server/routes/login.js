const express = require('express');

const bcrypt = require('bcrypt'); //escriptador 
const jwt = require('jsonwebtoken');//token

const app = express();

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
           return res.status(504).json({
                ok: false,
                err
            })
        }

        if(!userDB){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })  
        }
        if(!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(404).json({
                ok: false,
                err: {
                    message: "usuario o Contraseña incorrectos"
                }
            })  
        }
         let token = jwt.sign({
             usuario: userDB
         },process.env.SEED)
        res.json({
            ok: true,
            usuario: userDB,
            token
        })

    })
})

module.exports = app;