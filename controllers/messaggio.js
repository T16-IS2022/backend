const Messaggio = require('../models/messaggio'); // get our mongoose model
const Chat = require('../models/chat'); // get our mongoose model

const invia_messaggio = async (req, res) => {
	let mittente = req.body.userId;
	let messaggio = req.body.message;
    let data = new Date();
    let chatId = req.body.chatId;

    if (!userId)
		return res.status(401).json({ code: 401, message: 'Utente non autorizzato.' });
		
	const nuovoMessaggio = new Messaggio({
	    messaggio: messaggio,
        data: data,
        mittente: mittente
	});

    //salviamo il messaggio nel database
	nuovoMessaggio.save((err) => {
		if (err)
			return res.status(500).json({ code: 500, message: 'Internal server error.' });			
	});

    //lo inseriamo nella chat dell'utente
	const chat = await Chat.findById(chatId);
	chat.messaggi.push(nuovoMessaggio._id);
	await chat.save();
    return res.status(201).json({ code: 201, message: 'Messaggio inviato con successo.' });
}

module.exports = {
	invia_messaggio: invia_messaggio
};