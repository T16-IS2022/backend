const Annuncio = require('../models/annuncio');
const Utente = require('../models/utente');

// Restituisce tutti gli annunci presenti nel database
const get_annunci = async (req, res) => {
	Annuncio.find({ }, (err, data) => {
		if (err)
            return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});
        else if (!data)
			return res.status(404).json({ 
				code: 404, 
				message: "Annunci non trovati." 
			});
		else
            return res.status(200).json({ 
				code: 200, 
				message: "Elenco degli annunci ottenuto correttamente.", 
				annunci: data 
			});
    });
}

// Restituisce un annuncio dato il suo id
const get_annuncio = async (req, res) => {
    Annuncio.findOne({ _id: req.params.id }, (err, data) => {
		if (err)
            return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});
        else if (!data)
			return res.status(404).json({ 
				code: 404, 
				message: "Annuncio non trovato." 
			});
        else
			return res.status(200).json({ 
				code: 200, 
				message: "Annuncio ottenuto correttamente.", 
				annuncio: data 
			});
    });
}

// Quando un utente salva un annuncio, l'id dell'annuncio viene inserito in annunci_salvati
const salva_annuncio = async (req, res) => {
	Utente.findOne({ _id: req.loggedUser.id }, (err, user) => {
		if (err)
			return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});
		else if (!user)
			return res.status(404).json({ 
				code: 404, 
				message: 'Utente non trovato.' 
			});
	  
		// Verifica se l'annuncio è già presente negli annunci salvati dell'utente
		if (user.annunci_salvati.includes(req.params.id))
			return res.status(409).json({ 
				code: 409, 
				message: 'Annuncio già presente negli annunci salvati.' 
			});
		Annuncio.findOne({ _id: req.params.id }, (err, data) => {
			if(err) {
				return res.status(500).json({
					code: 500,
					message: 'Internal server error.'
				});
			}
			if(!data) {
				return res.status(404).json({
					code: 404,
					message: 'Annuncio non trovato.'
				});
			}
		});
		Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $push: { annunci_salvati: req.params.id } }, (err, data) => {
			if (err)
				return res.status(500).json({ 
					code: 500, 
					message: 'Internal server error.' 
				});
			else if (!data)
				return res.status(404).json({ 
					code: 404, 
					message: 'Annuncio non trovato.' 
				});
			else
				return res.status(200).json({ 
					code: 200, 
					message: "Annuncio salvato con successo." 
				});
		});
	});
}

function calcola_vetrina(durata_vetrina) {
	var scadenza_vetrina = new Date();
	scadenza_vetrina.setDate(scadenza_vetrina.getDate() + parseInt(durata_vetrina));
	return scadenza_vetrina;
}

// Aggiunge un annuncio nel database con i campi inseriti dall'utente
const pubblica_annuncio = async (req, res) => {
	const { 
		userId,
		foto, 
		numero_bagni, 
		numero_locali, 
		locali, 
		superficie_tot, 
		prezzo, 
		classe_energetica, 
		indirizzo, 
		arredato,
		durata_vetrina
	} = req.body;
	var scadenza_vetrina = calcola_vetrina(durata_vetrina);

	if (!(numero_bagni && 
		numero_locali && 
		superficie_tot && 
		prezzo && 
		classe_energetica && 
		indirizzo))
		return res.status(400).json({ 
			code: 400, 
			message: 'Alcuni parametri sono assenti.' 
		});
	if (!userId)
		return res.status(401).json({ 
			code: 401, 
			message: 'Utente non autorizzato.' 
		});
	
	const nuovoAnnuncio = new Annuncio({
		creatore: userId,
		foto: foto,
		numero_bagni: numero_bagni,
		numero_locali: numero_locali,
		locali: locali,
		superficie_tot: superficie_tot,
		prezzo: prezzo,
		classe_energetica: classe_energetica,
		indirizzo: indirizzo,
		arredato: arredato,
		vetrina: {
			data_inizio: new Date(),
			data_fine: scadenza_vetrina
    	}
	});

	//salviamo l'annuncio nel database
	nuovoAnnuncio.save((err) => {
		if (err)
			return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});			
	});

	//lo inseriamo nella lista degli annunci salvati dell'utente
	const user = await Utente.findById(userId);
	user.annunci_pubblicati.push(nuovoAnnuncio._id);
	await user.save();
	return res.status(201).json({ 
		code: 201, 
		message: 'Annuncio creato con successo.' 
	});
}

// Modifica un annuncio dati i dati dell'annuncio
const modifica_annuncio = async (req, res) => {
	const { id } = req.params; // ID dell'annuncio da modificare
	const { 
		foto, 
		numero_bagni, 
		numero_locali, 
		locali, 
		superficie_tot, 
		prezzo, 
		classe_energetica, 
		indirizzo, 
		arredato,
		durata_vetrina
	} = req.body;
	var scadenza_vetrina = calcola_vetrina(durata_vetrina);
	var vetrina = {
		data_inizio: new Date(),
		data_fine: scadenza_vetrina
	}
	// Esegui la ricerca dell'annuncio nel database per verificare l'esistenza
	Annuncio.findById(id)
    .then((annuncio) => {
    	if (!annuncio)
        	return res.status(404).json({ 
				code: 404, 
				message: 'Annuncio non trovato.' 
			});

    	// Aggiorna i campi del profilo con i nuovi valori
    	annuncio.foto = foto || annuncio.foto;
    	annuncio.numero_bagni = numero_bagni || annuncio.numero_bagni;
    	annuncio.numero_locali = numero_locali || annuncio.numero_locali;
    	annuncio.locali = locali || annuncio.locali;
    	annuncio.superficie_tot = superficie_tot || annuncio.superficie_tot;
    	annuncio.prezzo = prezzo || annuncio.prezzo;
    	annuncio.classe_energetica = classe_energetica || annuncio.classe_energetica;
    	annuncio.indirizzo = indirizzo || annuncio.indirizzo;
    	annuncio.arredato = arredato || annuncio.arredato;
		annuncio.vetrina = scadenza_vetrina ? vetrina : annuncio.vetrina;
    	
		// Salva le modifiche
    	annuncio.save();
    })
    .then(() => {
    	return res.status(200).json({ 
			code: 200, 
			message: 'Modifica dell\'annuncio riuscita.' 
		});
    })
    .catch((err) => {
    	return res.status(500).json({ 
			code: 500, 
			message: 'Internal server error.' 
		});
    });
}

// Elimina un annuncio dal database dato il suo id
const elimina_annuncio = (req, res) => {
	const id = req.params.id;
    Annuncio.findOneAndDelete({ _id: id }, (err, data) => {
        if (err)
            return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});
        else if (!data)
            return res.status(404).json({ 
				code: 404, 
				message: 'Annuncio non trovato.' 
			});
		else {
			// rimuoviamo l'id dell'annuncio dalla lista di annunci pubblicati dall'utente
            Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $pull: { annunci_pubblicati: req.params.id } }, (err, data) => {
                if (err)
                    return res.status(500).json({ 
						code: 500, 
						message: 'Internal server error.' 
					});
            });
            return res.status(200).json({ 
				code: 200, 
				message: 'Annuncio eliminato con successo.' 
			});
		}
    });
}

// Elimina un annuncio che era stato salvato
const rimuovi_annuncio_salvato = async (req, res) => {
	const { id } = req.params;
    Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $pull: { annunci_salvati: id } }, (err, data) => {
		if (err)
			return res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});
		else if (!data)
			return res.status(404).json({ 
				code: 404, 
				message: 'Utente non trovato.' 
			});
		else
			return res.status(200).json({ 
				code: 200, 
				message: "Annuncio rimosso con successo." 
			});
	});
}

const pagamento = async (req, res) => {
	const { annuncio_id } = req.body;

	if(!annuncio_id) {
		return res.status(500).json({
			code: 500,
			message: "Internal server error."
		});
	}

	return res.status(200).json({
		code: 200,
		message: "Pagamento effettuato."
	});
}

module.exports = {
	pubblica_annuncio: pubblica_annuncio,
	get_annunci: get_annunci,
	get_annuncio: get_annuncio,
	modifica_annuncio: modifica_annuncio,
	elimina_annuncio: elimina_annuncio,
	salva_annuncio: salva_annuncio,
	rimuovi_annuncio_salvato: rimuovi_annuncio_salvato,
	pagamento: pagamento
};