const mongoose = require("mongoose"); //import mongoose
const RicercaSchema = require('./ricerca');
const Schema = mongoose.Schema;

const UtenteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome:  { type: String, required: true },
    data_nascita: { type: Date, required: true },
    numero_tel: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    annunci_salvati: [{ type: Schema.Types.ObjectId, ref: 'Annuncio' }],
    annunci_pubblicati: [{ type: Schema.Types.ObjectId, ref: 'Annuncio' }],
    ricerche_salvate: [RicercaSchema.schema]
});

const Utente = mongoose.model('Utente', UtenteSchema); //convert to model named Utente
module.exports = Utente; //export for controller use