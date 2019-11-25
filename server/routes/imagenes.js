const express = require('express');
const app = express();

const fs = require('fs')
const path = require('path');
const {verific} = require('../middleware/auth');

app.get('/imagen/:tipo/:img', verific,(req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathimg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathimg)) {
        res.sendFile(pathimg)
    } else {
        let noimagen = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noimagen)
    }

})


module.exports = app;