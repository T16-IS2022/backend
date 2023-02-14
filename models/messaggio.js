const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessaggioSchema = new Schema({
    messaggio: { type: String, required: true },
    data: { type: Date, default: Date.now, required: true },
    mittente: { type: Schema.Types.ObjectId, ref: 'Utente' }
});

const Messaggio = mongoose.model('Messaggio', MessaggioSchema); //convert to model named Messaggio
module.exports = Messaggio; //export for controller use
