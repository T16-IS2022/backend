const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    utente: { type: Schema.Types.ObjectId, ref: 'Utente' },
    locatore: { type: Schema.Types.ObjectId, ref: 'Utente' },
    messaggi: [{ type: Schema.Types.ObjectId, ref: 'Messaggio' }],
    annuncio: { type: Schema.Types.ObjectId, ref: 'Annuncio' }
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat; 