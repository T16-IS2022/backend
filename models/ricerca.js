const mongoose = require("mongoose"); //import mongoose
const FiltroSchema = require('./filtro');

const RicercaSchema = new mongoose.Schema({
    testo: { type: String, required: true },
    filtri: [FiltroSchema.schema]
});

const Ricerca = mongoose.model('Ricerca', RicercaSchema); //convert to model named Ricerca
module.exports = Ricerca; //export for controller use