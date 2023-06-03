const Utente = require('../models/utente');
const Annuncio = require('../models/annuncio');

const ricerca_annunci = (req, res) => {
	const {
		superficie_tot,
		numero_bagni,
		numero_locali,
		prezzo,
		classe_energetica,
		indirizzo,
		arredato
	} = req.query;
	const filtro = {};

	/**
	 * $gte è un operatore di confronto nel linguaggio di query di MongoDB.
	 *	Sta per "greater than or equal", che significa "maggiore o uguale".
	 */

	if (superficie_tot) {
		filtro.superficie_tot = {
			$gte: parseInt(superficie_tot.min),
			$lte: parseInt(superficie_tot.max)
		};
	}

	if (numero_bagni) {
		filtro.numero_bagni = {
			$gte: parseInt(numero_bagni.min),
			$lte: parseInt(numero_bagni.max)
		};
	}

	if (numero_locali) {
		filtro.numero_locali = {
			$gte: parseInt(numero_locali.min),
			$lte: parseInt(numero_locali.max)
		};
	}

	if (prezzo) {
		filtro.prezzo = {
			$gte: parseInt(prezzo.min),
			$lte: parseInt(prezzo.max)
		};
	}

	if (classe_energetica) {
		filtro.classe_energetica = {
			$gte: parseInt(classe_energetica.min),
			$lte: parseInt(classe_energetica.max)
		};
	}
	/*
		Imposta un filtro per l'indirizzo dell'annuncio nella query di ricerca.
		Utilizza l'operatore $regex di MongoDB per effettuare una corrispondenza
		con il valore della variabile indirizzo all'interno dell'indirizzo dell'annuncio.
		L'opzione $options con il valore 'i' indica una corrispondenza case-insensitive.
	*/
	if (indirizzo)
		filtro.indirizzo = { $regex: indirizzo, $options: 'i' };

	if (arredato)
		filtro.arredato = arredato === 'true' ? true : false;

	Annuncio.find(filtro, (err, data) => {
		if (err)
			return res.status(500).json({
				code: 500,
				message: 'Internal server error.'
			});
		else if (!data || data.length === 0)
			return res.status(404).json({
				code: 404,
				message: 'Annunci non trovati.'
			});
		else
			return res.status(200).json({
				code: 200,
				message: 'Elenco degli annunci ottenuto correttamente.', 
				annunci: data
			});
	});
};


// Quando un utente salva una ricerca, l'id della ricerca viene inserita in ricerche_salvate
const salva_ricerca = async (req, res) => {
	const id = req.loggedUser.id;
	const {
		superficie_tot,
		numero_bagni,
		numero_locali,
		prezzo,
		classe_energetica,
		indirizzo,
		arredato
	} = req.query;

	const filtri = {
		superficie_tot,
		numero_bagni,
		numero_locali,
		prezzo,
		classe_energetica,
		arredato
	};

	// Rimuovi i parametri nulli o vuoti
	Object.keys(filtro).forEach(key => filtro[key] == null && delete filtro[key]);

	const nuovaRicerca = new Ricerca({
		testo: indirizzo,
		filtri: filtri
	});

	//salviamo l'annuncio nel database
	nuovaRicerca.save((err) => {
		if (err)
			return res.status(500).json({
				code: 500,
				message: 'Internal server error.'
			});
	});

	Utente.findOneAndUpdate({ _id: id }, { $push: { ricerche_salvate: nuovaRicerca._id } }, (err, data) => {
		if (err)
			return res.status(500).json({
				code: 500,
				message: 'Internal server error.'
			});
		else if (!data)
			return res.status(404).json({
				code: 404, message: 'Utente non trovato.'
			});
		else
			return res.status(200).json({
				code: 200,
				message: "Ricerca salvata con successo."
			});
	});
}

// Elimina una ricerca che era stata salvata
const rimuovi_ricerca_salvata = async (req, res) => {
	const { id } = req.params;
	Utente.findOneAndUpdate({ _id: req.loggedUser.id }, { $pull: { ricerche_salvate: id } }, (err, data) => {
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
				message: "Ricerca rimossa con successo."
			});
	});
}

module.exports = {
	ricerca_annunci: ricerca_annunci,
	salva_ricerca: salva_ricerca,
	rimuovi_ricerca_salvata: rimuovi_ricerca_salvata
};