const mongoose = require("mongoose"); //import mongoose
const FiltroSchema = require('./filtro');

const RicercaSchema = new mongoose.Schema({
    testo: String,
    filtri: [FiltroSchema.schema]
});

const Ricerca = mongoose.model('Ricerca', RicercaSchema);
module.exports = Ricerca;