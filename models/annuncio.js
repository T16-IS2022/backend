const mongoose = require("mongoose"); //import mongoose
const LocaleSchema = require('./locale');

const AnnuncioSchema = new mongoose.Schema({
    foto: [String],
    superficie_tot: Number,
    numero_bagni: Number,
    numero_locali: Number,
    locali: [LocaleSchema.schema],
    prezzo: Number,
    classe_energetica: String,
    indirizzo: String,
    arredato: Boolean,
    vetrina: {
        data_inizio: {type: Date},
        data_fine: {type: Date}, 
    }
});

const Annuncio = mongoose.model('Annuncio', AnnuncioSchema); 
module.exports = Annuncio;