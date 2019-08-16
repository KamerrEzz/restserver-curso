const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


//roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es Un Rol Valido'
};

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es Obligatorio"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El Correo es Necesario"]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} Debe ser Unico'});
module.exports = mongoose.model('Usuario', usuarioSchema)