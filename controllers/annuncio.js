const Annuncio = require('../models/annuncio');
const Utente = require('../models/utente');
const Locale = require('../models/locale');

const publish = async (req, res) => {
	// create a new ad
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

const getAnnunci = async (req, res) => {
	await Annuncio.find({ }).exec().then((result) => {
		annunci = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!annunci) {
		res.status(404).json({ success: false, message: 'Ads not found.' });
		return;
	}

	return res.status(200).json({ success: true, annunci: annunci });
};

module.exports = {
	publish: publish,
	getAnnunci: getAnnunci
};