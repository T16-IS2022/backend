 const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessaggioSchema = new Schema({
    messaggio: String,
    data: { type: Date, default: Date.now },
    mittente: { type: Schema.Types.ObjectId, ref: 'Utente' }
});

const Messaggio = mongoose.model('Messaggio', MessaggioSchema);
module.exports = Messaggio;