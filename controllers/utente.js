const Utente = require('../models/utente'); // get our mongoose model
const Annuncio = require('../models/annuncio'); // get our mongoose model
const Ricerca = require('../models/ricerca'); // get our mongoose model
const Chat = require('../models/chat'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const crypto = require('crypto');

const hash = (password) => crypto.createHash('sha256').update(password).digest('hex');
const getToken = (data) => jwt.sign({ data }, process.env.SUPER_SECRET, { expiresIn: 86400 });

const login = async (req, res) => {
	//salvo nella variabile email la email che mi ha passato l'utente nella richiesta POST 
	//salvo nella variabile password la password che mi ha passato l'utente nella richiesta POST
	const { email, password } = req.body;

	//se la email o la password sono vuote
	if (!email || !password)
		return res.status(400).json({
			code: 400,
			message: 'Alcuni parametri sono assenti.'
		});

	let user = await Utente.findOne({ email: email }).exec().catch((err) => {
		return res.status(500).json({
			code: 500,
			message: 'Internal server error.'
		});
	});

	//se non ho trovato l'utente nel database
	if (!user)
		return res.status(404).json({
			code: 404,
			message: 'Email non presente nel sistema.'
		});

	//se la password hashata dell'utente è diversa da hash(password inserita)
	if (user.password != hash(password))
		return res.status(401).json({
			code: 401,
			message: 'Password errata.'
		});

	var payload = { id: user._id }
	var token = getToken(payload);

	return res.status(200).json({
		code: 200,
		message: 'L\'accesso è avvenuto correttamente.',
		token: token,
		id: user.id,
		nome: user.nome,
		cognome: user.cognome,
		email: user.email
	});
}

const registrazione = async (req, res) => {
	//questa dicitura permette di salvare ogni campo nella rispettiva variabile
	const {
		nome,
		cognome,
		data_nascita,
		numero_tel,
		email,
		password
	} = req.body;

	if (!nome || !cognome || !data_nascita || !numero_tel || !email || !password)
		return res.status(400).json({
			code: 400,
			message: 'L\'input non è formattato correttamente.'
		});

	let user = await Utente.findOne({ email: email }).exec().catch((err) => {
		return res.status(500).json({
			code: 500,
			message: 'Internal server error.'
		});
	});

	//se l'utente è già registrato
	if (user)
		return res.status(409).json({
			code: 409,
			message: 'Indirizzo email già presente nel sistema.'
		});

	// creo un nuovo utente
	const nuovoUtente = new Utente({
		nome: nome,
		cognome: cognome,
		data_nascita: data_nascita,
		numero_tel: numero_tel,
		email: email,
		password: hash(password),
		annunci_salvati: [],
		annunci_pubblicati: [],
		ricerche_salvate: []
	});

	nuovoUtente.save((err) => {
		if (err)
			return res.status(500).json({
				code: 500,
				message: 'Internal server error.'
			});

		return res.status(201).json({
			code: 201,
			message: 'La registrazione è avvenuta con successo.'
		});
	});
}

const logout = (req, res) => {
	/* non dovendo fare operazioni sul backend, il logout è implementato nel frontend,
	 * ossia in /views/LogoutView.vue
	 */
	return res.status(200).json({
		code: 200,
		message: 'Ok'
	});
}

const get_annunci_pubblicati = async (req, res) => {
	const userId = req.loggedUser.id;
	if (!userId)
		return res.status(401).json({ 
			code: 401, 
			message: 'Utente non autorizzato.' 
		});

	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ 
			code: 500, 
			message: 'Internal server error.' 
		});
	});

	if (!user)
		return res.status(404).json({ 
			code: 404, 
			message: 'Utente non trovato.' 
		});

	const annunci_pubblicati = await Annuncio.find({ _id: { $in: user.annunci_pubblicati } });

	return res.status(200).json({ 
		code: 200, 
		message: 'Elenco degli annunci pubblicati ottenuto correttamente', 
		annunci_pubblicati: annunci_pubblicati 
	});
}

const get_annunci_salvati = async (req, res) => {
	const userId = req.loggedUser.id;

	if (!userId)
		return res.status(401).json({ 
			code: 401, 
			message: 'Utente non autorizzato.' 
		});

	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ 
			code: 500, 
			message: 'Internal server error.' 
		});
	});

	if (!user)
		return res.status(404).json({ 
			code: 404, 
			message: 'Utente non trovato.' 
		});

	const annunci_salvati = await Annuncio.find({ _id: { $in: user.annunci_salvati } });

	return res.status(200).json({ 
		code: 200, 
		message: 'Elenco degli annunci salvati ottenuto correttamente.', 
		annunci_salvati: annunci_salvati 
	});
}

const get_ricerche_salvate = async (req, res) => {
	const userId = req.loggedUser.id;

	if (!userId)
		return res.status(401).json({ 
			code: 401, 
			message: 'Utente non autorizzato.' 
		});

	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ 
			code: 500, 
			message: 'Internal server error.' 
		});
	});

	if (!user)
		return res.status(404).json({ 
			code: 404, 
			message: 'Utente non trovato.' 
		});

	const ricerche_salvate = await Ricerca.find({ _id: { $in: user.ricerche_salvate } });

	return res.status(200).json({ 
		code: 200, 
		message: 'Elenco delle ricerche salvate ottenuto correttamente.', 
		ricerche_salvate: ricerche_salvate 
	});
}

const get_chat = async (req, res) => {
	const userId = req.loggedUser.id;

	if (!userId)
		return res.status(401).json({ 
			code: 401, 
			message: 'Utente non autorizzato.' 
		});

	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ 
			code: 500, 
			message: 'Internal server error.' 
		});
	});

	if (!user)
		return res.status(404).json({ 
			code: 404, 
			message: 'Utente non trovato.' 
		});

	const lista_chat = await Chat.find({ _id: { $in: user.lista_chat } });

	return res.status(200).json({ 
		code: 200, 
		message: 'Elenco delle chat ottenuto correttamente.', 
		lista_chat: lista_chat 
	});
}

const modifica_profilo = async (req, res) => {
	const userId = req.params.id; // ID dell'utente da modificare
	const { 
		nome, 
		cognome, 
		data_nascita, 
		numero_tel, 
		email, 
		password 
	} = req.body;

	// Esegui la ricerca dell'utente nel database per verificare l'esistenza
	Utente.findById(userId)
		.then((utente) => {
			if (!utente)
				return res.status(404).json({ 
					code: 404, 
					message: 'Utente non trovato.' 
				});

			// Aggiorna i campi del profilo con i nuovi valori
			utente.nome = nome || utente.nome;
			utente.cognome = cognome || utente.cognome;
			utente.data_nascita = data_nascita || utente.data_nascita;
			utente.numero_tel = numero_tel || utente.numero_tel;
			utente.email = email || utente.email;
			utente.password = password || utente.password;

			// Salva le modifiche
			return utente.save();
		})
		.then(() => {
			res.status(200).json({ 
				code: 200, 
				message: 'Modifica del profilo riuscita.' 
			});
		})
		.catch((err) => {
			res.status(500).json({ 
				code: 500, 
				message: 'Internal server error.' 
			});
		});
}

const cancella_account = async (req, res) => {
	const userId = req.params.id;
	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ 
			code: 500, 
			message: 'Internal server error.' 
		});
	});

	//controllo se l'utente esiste nel database
	if(!user)
		return res.status(404).json({ 
			code: 404, 
			message: "L'utente richiesto non esiste." 
		});

	//prima di cancellare un utente devo cancellare tutti gli annunci che ha pubblicato
	Annuncio.deleteMany({ _id: { $in: user.annunci_pubblicati } }, (err) => {
		if (err)
			return res.status(500).json({
				message: 'Errore durante la cancellazione degli annunci.' 
			});
	});

	Utente.findOneAndDelete({ _id: userId }, (err, data) => {
		if (err)
			return res.status(500).json({ 
				code: 500, 
				message: "Internal server error." 
			});		
		else
			return res.status(200).json({ 
				code: 200, 
				message: "Utente cancellato correttamente." 
			});
	});
}

const recupero_password = async (req, res) => {
	const { email, password } = req.body;

	// TO DO

	return res.status(500).json({
		code: 500,
		message: "Internal server error."
	});
}

module.exports = {
	login: login,
	registrazione: registrazione,
	logout: logout,
	cancella_account: cancella_account,
	get_annunci_pubblicati: get_annunci_pubblicati,
	get_annunci_salvati: get_annunci_salvati,
	get_ricerche_salvate: get_ricerche_salvate,
	get_chat: get_chat,
	recupero_password: recupero_password,
	modifica_profilo: modifica_profilo
};