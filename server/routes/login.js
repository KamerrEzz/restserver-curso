const express = require('express');

const bcrypt = require('bcrypt'); //escriptador 
const jwt = require('jsonwebtoken'); //token

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({
        email: body.email
    }, (err, userDB) => {
        if (err) {
            return res.status(504).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "usuario o Contraseña incorrectos"
                }
            })
        }
        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED)
        res.json({
            ok: true,
            usuario: userDB,
            token
        })

    })
})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async (req, res) => {

    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            })
        })



    Usuario.findOne({
        email: googleUser.email
    }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDB) {
            if (userDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debes Autenticarse de manera normal."
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED)

                return res.json({
                    ok: true,
                    usuario: userDB,
                    token
                })
            }
        } else {

            let usuario = new Usuario();

            usuario.name = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }


                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED)

                return res.json({
                    ok: true,
                    usuario: userDB,
                    token
                })
            })
        }
    });
})
module.exports = app;