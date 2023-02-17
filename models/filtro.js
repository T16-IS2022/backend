const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FiltroSchema = new Schema({
    nome_filtro: { type: String, required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true }
});

const Filtro = mongoose.model('Filtro', FiltroSchema); //convert to model named Filtro
module.exports = Filtro; //export for controller use
