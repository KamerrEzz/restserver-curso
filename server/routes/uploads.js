const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());

let Usuario = require('../models/usuario');
let Producto = require('../models/producto');

let fs = require('fs');
let path = require('path');

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files)
    return res.status(400).json({
        ok: false,
        message: "No se selecciono ningun archivo"
    })

    
    let tipovalido = ["usuarios", "productos"]
    if(tipovalido.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            message: "Los tipos permitidos son " + tipovalido.join(', ')
        })
    }


    let file = req.files.file;
    let nombrecortado = file.name.split('.');
    let formato = nombrecortado[nombrecortado.length - 1]

    // extenciones permitidas
    let extenciones = ["png", "jpg", "gif", "jpeg"]

    if(extenciones.indexOf(formato ) < 0){
        return res.status(400).json({
            ok: false,
            message: "Los formatos permisitos son " + extenciones.join(", ")
        })
    }

    //renombrar
    let nombre = `${id}-${ new Date().getMilliseconds()}.${formato}`

    file.mv(`uploads/${tipo}/${nombre}`, function(err) {
        if (err)
          return res.status(500).send(err);
    
          if(tipo === "usuarios"){
              UM(id, res, nombre)
            } else {
            PM(id, res, nombre)
        }
        
      });
});

function UM(id, res, nombre) {
    
    Usuario.findById(id,(err, u) => {
        if(err){
            borrar("usuarios", nombre)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!u){
            borrar("usuarios", nombre)
            return res.status(404).json({
                ok: false,
                message: "Usuario no existe"
            })
        }

        borrar("usuarios", u.img)
        u.img = nombre

        u.save( (err, ug) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                img: nombre,
                Usuario: ug
            })
        })
    })


}

function PM(id, res, nombre) {
    
    Producto.findById(id,(err, u) => {
        if(err){
            borrar("productos", nombre)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!u){
            borrar("productos", nombre)
            return res.status(404).json({
                ok: false,
                message: "Producto no existe"
            })
        }

        borrar("productos", u.img)
        u.img = nombre

        u.save( (err, ug) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                img: nombre,
                Usuario: ug
            })
        })
    })


}
function borrar(tipo,usuario) {
    let pathimg = path.resolve(__dirname, `../../uploads/${tipo}/${usuario}`)
    if(fs.existsSync(pathimg)){
        fs.unlinkSync(pathimg)
    }  
}
module.exports = app;