const Annuncio = require('../models/annuncio');
const Utente = require('../models/utente');
//const Locale = require('../models/locale');
//const { get_annunciPubblicati } = require('./utente');

/*
return res.status(200).json({ message: "Organisation found", data: data });
return res.status(201).json({ message: "Organisation created", data: data }); (dopo una post)
return res.status(204).json({ message: "Organisation deleted" }); (dopo una buona delete)
return res.status(400).json({ message: "Bad request, missing parameters" }); (se i campi sono incompleti)
return  res.status(401).json({ success: false, message: 'Unauthorized.' });
return res.status(404).json({ message: "Organisation not found" });
return res.status(409).json({ message: "Organisation already exists" });
return res.status(500).json({ Error: "Internal server error: " + err });
*/


// Aggiunge un annuncio nel database con i campi inseriti dall'utente
const pubblica_annuncio = async (req, res) => {
	var scadenza_vetrina = new Date();
	scadenza_vetrina.setDate(scadenza_vetrina.getDate() + parseInt(req.body.durata_vetrina));
	const nuovoAnnuncio = new Annuncio({
		foto: req.body.foto,
		numero_bagni: req.body.numero_bagni,
		numero_locali: req.body.numero_locali,
		locali: req.body.locali,
		superficie_tot: req.body.superficie,
		prezzo: req.body.prezzo,
		classe_energetica: req.body.classe_energetica,
		indirizzo: req.body.indirizzo,
		arredato: req.body.arredato,
		vetrina: {
			data_inizio: new Date(),
			data_fine: scadenza_vetrina
    	}
	});

	//salviamo l'annuncio nel database
	nuovoAnnuncio.save((err) => {
		if (err)
			return res.status(500).json({ Error: "Internal server error: " + err });
		else
			return res.status(201).json({ success: true, message: "Ad created successfully" });
	});

	//lo inseriamo nella lista degli annunci salvati dell'utente
	const utente = await Utente.findById(req.body.userId);
	utente.annunci_pubblicati.push(nuovoAnnuncio._id);
	await utente.save();
}

// Restituisce tutti gli annunci presenti nel database
const get_annunci = async (req, res) => {
	await Annuncio.find({ }).exec().then((result) => {
		annunci = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!annunci)
		return res.status(404).json({ success: false, message: 'Ads not found' });
	else
		return res.status(200).json({ success: true, message: 'Ads found', annunci: annunci });
};

// Restituisce un annuncio dato il suo id
const get_annuncio = (req, res) => {
    Annuncio.findOne({ _id: req.params.id }, (err, data) => {
		if (err)
            return res.status(500).json({ Error: "Internal server error: " + err });
        if (data)
            return res.status(200).json({ message: "Ad found", annuncio: data });
        else
            return res.status(404).json({ message: "Ad not found" });
    })
};

// Elimina un annuncio dal database dato il suo id
const elimina_annuncio = (req, res) => {
    Annuncio.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err)
            return res.status(500).json({ Error: "Internal server error: " + err });
        if (data) {
            // rimuoviamo l'id dell'annuncio dalla lista di annunci 
            Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $pull: { annunci_pubblicati: req.params.id } }, (err, data) => {
                if (err)
                    return res.status(500).json({ Error: "Internal server error: " + err });
            });
            return res.status(204).json({ message: "Ad deleted" });
        }
		else
            return res.status(404).json({ message: "Ad not found" });
    })
};

// Quando un utente salva un annuncio, l'id dell'annuncio viene inserito in annunci_salvati
const salva_annuncio = async (req, res) => {
	Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $push: { annunci_salvati: req.params.id } }, (err, data) => {
		if (err)
			return res.status(500).json({ Error: "Internal server error: " + err });
	});
	return res.status(200).json({ success: true, message: 'Ad saved' });
}

// Elimina un annuncio che era stato salvato
const rimuovi_annuncio_salvato = async (req, res) => {
    Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $pull: { annunci_salvati: req.params.id } }, (err, data) => {
		if (err)
			return res.status(500).json({ Error: "Internal server error: " + err });
	});
	return res.status(200).json({ success: true, message: 'Ad removed correctly' });
};

module.exports = {
	pubblica_annuncio: pubblica_annuncio,
	get_annunci: get_annunci,
	get_annuncio: get_annuncio,
	elimina_annuncio: elimina_annuncio,
	salva_annuncio: salva_annuncio,
	rimuovi_annuncio_salvato: rimuovi_annuncio_salvato
};