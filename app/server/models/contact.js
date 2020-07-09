const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let contactSchema = new Schema({
    nombre:String,
    apellido:String,
    email:String,
    fecha_nacimiento:String,
    imagen:String
});

module.exports = mongoose.model("contacts", contactSchema);
