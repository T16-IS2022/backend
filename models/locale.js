const mongoose = require("mongoose"); //import mongoose

const LocaleSchema = new mongoose.Schema({
    nome_locale: String,
    superficie: Number,
    arredamento: [String]
});

const Locale = mongoose.model('Locale', LocaleSchema); //convert to model named Locale
module.exports = Locale; //export for controller use