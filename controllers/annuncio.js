const Annuncio = require('../models/annuncio');
const Locale = require('../models/locale');

const publish = async (req, res) => {
	// create a new user
	console.log(arredato);
	const nuovoAnnuncio = new Annuncio({
		foto: req.body.foto,
		numero_bagni: req.body.numero_bagni,
		numero_locali: req.body.numero_locali,
		locali: req.body.locali,
		prezzo: req.body.prezzo,
		classe_energetica: req.body.classe_energetica,
		indirizzo: req.body.indirizzo,
		arredato: req.body.arredato,
		vetrina: {
			data_inizio: {type: Date},
			data_fine: {type: Date}, 
    	}
	});

	// save the user
	nuovoUtente.save((err) => {
		if (err) {
			return res.status(500).json({ Error: "Internal server error: " + err });
		}
		return res.status(201).json({ success: true, message: 'User created successfully.' });
	});
}

module.exports = {
	publish: publish
};