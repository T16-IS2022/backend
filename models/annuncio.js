const mongoose = require("mongoose"); //import mongoose
const LocaleSchema = require('./locale');

const AnnuncioSchema = new mongoose.Schema({
    foto: [String],
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

const Annuncio = mongoose.model('Annuncio', AnnuncioSchema); //convert to model named Annuncio
module.exports = Annuncio; //export for controller use