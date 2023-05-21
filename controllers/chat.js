const Chat = require('../models/chat'); // get our mongoose model
const Utente = require('../models/utente'); // get our mongoose model

const crea_chat = async (req, res) => {
	const annuncioId = req.body.annuncioId;
    const mittenteId = req.body.mittenteId;
    const destinatarioId = req.body.destinatarioId;

    if (!userId)
		return res.status(401).json({ code: 401, message: 'Utente non autorizzato.' });
    
    let chat = await Chat.findOne({ annuncio: annuncioId, utente: mittenteId, locatore: destinatarioId });
    if(chat)
        return res.status(409).json({ code: 409, message: "Chat già esistente." });
    else {
        const nuovaChat = new Chat({
            utente: mittenteId,
            locatore: destinatarioId,
            annuncio: annuncioId
        });

        //salviamo la chat nel database
        nuovaChat.save((err) => {
            if (err)
                return res.status(500).json({ code: 500, message: 'Internal server error.' });			
        });

        //inseriamo l'id della chat nella lista_chat dell'utente
        const mittente = await Utente.findById(mittenteId);
        mittente.lista_chat.push(nuovaChat._id);
        await mittente.save();
        //inseriamo l'id della chat nella lista_chat del locatore
        const locatore = await Utente.findById(destinatarioId);
        locatore.lista_chat.push(nuovaChat._id);
        await locatore.save();
        return res.status(201).json({ code: 401, message: 'Annuncio creato con successo.' });
    }
    
}

const get_chat = async (req, res) => {
	Chat.findOne({ _id: req.params.id }, (err, data) => {
		if (err)
            return res.status(500).json({ code: 500, message: 'Internal server error.' });
        else if (!data)
			return res.status(404).json({ code: 404, message: "Chat non trovata." });
        else
			return res.status(200).json({ code: 200, message: "Chat ottenuta correttamente.", chat: data });
    });
}

module.exports = {
	get_chat: get_chat,
    crea_chat: crea_chat
};