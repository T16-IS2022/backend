const Chat = require('../models/chat'); // get our mongoose model
const Utente = require('../models/utente'); // get our mongoose model

const crea_chat = async (req, res) => {
    const { id_annuncio, id_mittente, id_destinatario } = req.body;
    
    const userId = req.loggedUser.id;

    if (!userId)
		return res.status(401).json({ 
            code: 401, 
            message: 'Utente non autorizzato.' 
        });
    

    if (!id_annuncio || !id_mittente || !id_destinatario) {
        return res.status(500).json({
            code: 500,
            message: "Internal server Error."
        });
    }
    let chat = await Chat.findOne({ annuncio: id_annuncio, utente: id_mittente, locatore: id_destinatario });

    if(chat)
        return res.status(409).json({ 
            code: 409, 
            message: "Chat già esistente." 
        });
    else {
        const nuovaChat = new Chat({
            utente: id_mittente,
            locatore: id_destinatario,
            annuncio: id_annuncio
        });

        //salviamo la chat nel database
        nuovaChat.save((err) => {
            if (err)
                return res.status(500).json({ 
                    code: 500, 
                    message: 'Internal server error.' 
                });			
        });

        //inseriamo l'id della chat nella lista_chat dell'utente
        const mittente = await Utente.findById(id_mittente);
        mittente.lista_chat.push(nuovaChat._id);
        await mittente.save();
        //inseriamo l'id della chat nella lista_chat del locatore
        const locatore = await Utente.findById(id_destinatario);
        locatore.lista_chat.push(nuovaChat._id);
        await locatore.save();
        return res.status(201).json({ 
            code: 201, 
            message: 'Chat creata con successo.' 
        });
    }
    
}

const get_chat = async (req, res) => {
    const { id } = req.params;
	Chat.findOne({ _id: id }, (err, data) => {
		if (err)
            return res.status(500).json({ 
                code: 500, 
                message: 'Internal server error.' 
            });
        else if (!data)
			return res.status(404).json({ 
                code: 404, 
                message: "Chat non trovata." 
            });
        else
			return res.status(200).json({ 
                code: 200, 
                message: "Chat ottenuta correttamente.", 
                chat: data 
            });
    });
}

module.exports = {
	get_chat: get_chat,
    crea_chat: crea_chat
};