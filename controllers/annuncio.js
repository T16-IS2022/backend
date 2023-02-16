const Annuncio = require('../models/annuncio');
const Utente = require('../models/utente');
const Locale = require('../models/locale');

const publish = async (req, res) => {
	// create a new ad
	const nuovoAnnuncio = new Annuncio({
		foto: req.body.foto,
		numero_bagni: req.body.numero_bagni,
		numero_locali: req.body.numero_locali,
		locali: null,
		prezzo: req.body.prezzo,
		classe_energetica: req.body.classe_energetica,
		indirizzo: req.body.indirizzo,
		arredato: null,
		vetrina: {
			data_inizio: new Date(),
			data_fine: null
    	}
	});

	//salviamo l'annuncio nel db
	nuovoAnnuncio.save((err) => {
		if (err) {
			return res.status(500).json({ Error: "Internal server error: " + err });
		}
		return res.status(201).json({ success: true, message: 'Ad created successfully.' });
	});

	//lo inseriamo nella lista degli annunci salvati dell'utente
	const utente = await Utente.findById(req.body.userId);
	utente.annunci_pubblicati.push(nuovoAnnuncio._id);
	await utente.save();
}

module.exports = {
	publish: publish
};