const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FiltroSchema = new Schema({
    nome_filtro: String,
    min: Number,
    max: Number
});

const Filtro = mongoose.model('Filtro', FiltroSchema);
module.exports = Filtro;