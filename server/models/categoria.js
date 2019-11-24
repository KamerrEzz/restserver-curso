const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;



let categoria = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es Obligatorio"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Categoria', categoria);