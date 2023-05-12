const mongoose = require("mongoose"); //import mongoose

const LocaleSchema = new mongoose.Schema({
    nome_locale: String,
    superficie: Number,
    descrizione: String,
    arredamento: [String]
});

const Locale = mongoose.model('Locale', LocaleSchema);
module.exports = Locale;