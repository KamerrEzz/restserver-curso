require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose')

const bodyparser = require('body-parser');

//middlewares
app.use(bodyparser.urlencoded({
    extended: false
})) //aplicacion/x-www-form-urlencoded
app.use(bodyparser.json()) //iniciar aplicacion/json

// Configuracion de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (err, res) => {

    if (err) throw err;

    console.log('Base de Datos ONLINE');

});
app.listen(process.env.PORT, () => {
    console.log("escuchando: http://localhost:" + process.env.PORT + "/");
})