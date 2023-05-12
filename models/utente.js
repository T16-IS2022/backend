const mongoose = require("mongoose"); //import mongoose
const RicercaSchema = require('./ricerca');
const Schema = mongoose.Schema;

const UtenteSchema = new mongoose.Schema({
    nome: String,
    cognome:  String,
    data_nascita: Date,
    numero_tel: String,
    email: String,
    password: String,
    annunci_salvati: [{ type: Schema.Types.ObjectId, ref: 'Annuncio' }],
    annunci_pubblicati: [{ type: Schema.Types.ObjectId, ref: 'Annuncio' }],
    ricerche_salvate: [RicercaSchema.schema],
    lista_chat: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
});

const Utente = mongoose.model('Utente', UtenteSchema);
module.exports = Utente;