const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    //i partecipanti saranno 2: mittente e destinatario
    participanti: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messaggi: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

const Chat = mongoose.model('Chat', ChatSchema); //convert to model named Chat
module.exports = Chat; //export for controller use
