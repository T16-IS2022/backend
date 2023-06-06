const Messaggio = require('../models/messaggio'); // get our mongoose model
const Chat = require('../models/chat'); // get our mongoose model

const invia_messaggio = async (req, res) => {
	const { id_chat, messaggio } = req.body;

	const id_mittente = req.loggedUser.id;

    let data = new Date();

    if (!id_mittente)
		return res.status(401).json({ 
			code: 401, 
			message: 'Utente non autorizzato.' 
		});
		
	const nuovoMessaggio = new Messaggio({
	    messaggio: messaggio,
        data: data,
        mittente: id_mittente
	});

    //salviamo il messaggio nel database
	nuovoMessaggio.save((err) => {
		if (err)
			return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});			
	});

    //lo inseriamo nella chat dell'utente
	const chat = await Chat.findById(id_chat);
	if(!chat) {
		return res.status(404).json({
			code: 404,
			message: 'Chat inesistente.'
		});
	}
	if(!chat.messaggi) {
		chat.messaggi = [];
	}
	chat.messaggi.push(nuovoMessaggio._id);
	await chat.save();
    return res.status(200).json({ 
		code: 200, 
		message: 'Messaggio inviato con successo.' 
	});
}

module.exports = {
	invia_messaggio: invia_messaggio
};