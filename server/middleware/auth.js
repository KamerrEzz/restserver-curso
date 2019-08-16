const jwt = require('jsonwebtoken');

let verific = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token invalido"
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}

let adminrol = (req, res, next) => {

    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: "No eres administrador"
            }
        })
    }
}
module.exports = {
    verific,
    adminrol
}