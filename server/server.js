require('./config/config');

const express = require('express');
const app = express();

const bodyparser = require('body-parser');

//middlewares

app.use(bodyparser.urlencoded({extended: false}))//aplicacion/x-www-form-urlencoded
app.use(bodyparser.json())//iniciar aplicacion/json

app.get('/usuario', (req, res) => {
    res.send("get usuario");
});

app.post('/usuario', (req, res) => {
    let usuario = req.body

    if(usuario.nombre === undefined){
        res.status(404).json({
            "ok":"falso",
            "mensaje":"El Nombre es Obligatorio"
        })
    } else {

    res.json({
        usuario
    })
}

});
app.put('/usuario/:id', (req, res) => {
    let usuarioID = req.params.id
    res.json({
        usuarioID
    })
});
app.delete('/', (req, res) => {
    res.send("Hola mundito !!");
});

app.listen(process.env.PORT, () => {
    console.log("escuchando: http://localhost:"+process.env.PORT+"/");
})