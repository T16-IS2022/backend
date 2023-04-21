const Annuncio = require('../models/annuncio');
const Utente = require('../models/utente');
const Locale = require('../models/locale');
const { getAnnunciPubblicati } = require('./utente');

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

//GET annuncio by name
const getAnnuncio = (req, res) => {
    console.log("Getting ad: ", req.params.id);
    
    Annuncio.findOne({ _id: req.params.id }, (err, data) => {
		if (err) {
            return res.status(500).json({ Error: err });
        }
        if (data) {
            return res.status(200).json({ message: "Ad found", annuncio: data });
        } else {
            // if annuncio not found return 404 error
            return res.status(404).json({ message: "Ad not found" });
        }
    })
};

//DELETE annuncio by name
const deleteAnnuncio = (req, res) => {
    console.log("Deleting Ad: ", req.params.id);

    Annuncio.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(500).json({ Error: err });
        }
        if (data) {
            // delete ad name from user in the db
            Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $pull: { annunci_salvati: req.params.id } }, (err, data) => {
                if (err) {
                    return res.status(500).json({ Error: err });
                }
            });
            return res.status(204).json({ message: "Ad deleted" });
        } else {
            // if ad not found return 404 error
            return res.status(404).json({ message: "Ad not found" });
        }
    })
};

const saveAnnuncio = async (req, res) => {
	let utente;
	await Utente.findById(req.loggedUser.id).exec().then((result) => {
		utente = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!utente)
		return res.status(404).json({ success: false, message: 'User not found.' });

	utente.annunci_salvati.push(req.params.id);
	await utente.save();
	return res.status(200).json({ success: true, message: 'Ad saved' });
}

const deleteSavedAnnuncio = async (req, res) => {
    let utente;
	await Utente.findById(req.loggedUser.id).exec().then((result) => {
		utente = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!utente)
		return res.status(404).json({ success: false, message: 'User not found.' });

	utente.annunci_salvati.pull(req.params.id);
	await utente.save();
	return res.status(200).json({ success: true, message: 'Ad removed correctly.' });
};

module.exports = {
	publish: publish,
	getAnnunci: getAnnunci,
	getAnnuncio: getAnnuncio,
	deleteAnnuncio: deleteAnnuncio,
	saveAnnuncio: saveAnnuncio,
	deleteSavedAnnuncio: deleteSavedAnnuncio
};