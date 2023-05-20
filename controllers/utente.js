const Utente = require('../models/utente'); // get our mongoose model
const Annuncio = require('../models/annuncio'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const crypto = require('crypto');

const hash = (password) => crypto.createHash('sha256').update(password).digest('hex');
const getToken = (data) => jwt.sign(data, process.env.SUPER_SECRET, { expiresIn: 86400 });

const login = async (req, res) => {
	if (!req.body)
		return res.status(400).json({ code: 400, message: 'Alcuni parametri sono assenti.' });
	
	//salvo nella variabile email la email che mi ha passato l'utente nella richiesta POST 
	let email = req.body.email;
	//salvo nella variabile password la password che mi ha passato l'utente nella richiesta POST
	let password = req.body.password;
	
	//se la email o la password sono vuote
	if (!email || !password)
		return res.status(400).json({ code: 400, message: 'Alcuni parametri sono assenti.' });

	let user = await Utente.findOne({ email: email }).exec().catch((err) => {
		return res.status(500).json({ code: 500, message: 'Internal server error.' });
	});

	//se non ho trovato l'utente nel database
	if (!user)
		return res.status(404).json({ code: 404, message: 'Email non presente nel sistema.' });

	//se la password hashata dell'utente è diversa da hash(password inserita)
	if (user.password != hash(password))
		return res.status(401).json({ code: 401, message: 'Password errata.' });
	
	var token = getToken(user);

	return res.status(200).json({
		code: 200,
		message: 'L\'accesso è avvenuto correttamente.',
		token: token,
		id: user.id,
		nome: user.nome,
		cognome: user.cognome,
		email: user.email
	});
};

const registrazione = async (req, res) => {
	if (!req.body)
		return res.status(400).json({ code: 400, message: 'L\'input non è formattato correttamente.' });
	
	let nome = req.body.nome;
	let cognome = req.body.nome;
	let data_nascita = req.body.data_nascita;
	let numero_tel = req.body.numero_tel;
	let email = req.body.email;
	let password = req.body.password;

	if (!req.body.nome || !req.body.cognome || !req.body.data_nascita || !req.body.numero_tel || !req.body.email || !req.body.password)
		return res.status(400).json({ code: 400, message: 'L\'input non è formattato correttamente.' });

	let user = await Utente.findOne({ email: email }).exec().catch((err) => {
		return res.status(500).json({ code: 500, message: 'Internal server error.' });
	});

	//se l'utente è già registrato
	if (user)
		return res.status(409).json({ code: 409, message: 'Indirizzo email già presente nel sistema.' });

	// create a new user
	const nuovoUtente = new Utente({
		nome: nome,
		cognome:  cognome,
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
			return res.status(500).json({ code: 500, message: 'Internal server error.' });
		
		return res.status(201).json({ code: 201, message: 'La registrazione è avvenuta con successo.' });
	});
};

const logout = (req, res) => { 
	/* non dovendo fare operazioni sul backend, il logout è implementato nel frontend,
	 * ossia in /views/LogoutView.vue
	 */
};

const cancella_account = (req, res) => {
    Utente.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err)
            return res.status(500).json({ code: 500, message: "Internal server error." });
        else if (!data)
            return res.status(404).json({ code: 404, message: "L'utente richiesto non esiste." });
        else
        	return res.status(204).json({ code: 204, message: "Utente cancellato correttamente." });
    });

	//TO-DO Cancellare gli annunci dell'utente
};

const get_annunci_pubblicati = async (req, res) => {
	userId = req.loggedUser.id;

	if (!userId)
		return res.status(401).json({ code: 401, message: 'Unauthorized.' });

	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ code: 500, message: 'Internal server error.' });
	});
	
	if (!user)
		return res.status(404).json({ code: 404, message: 'Utente non trovato.' });

	const annunci = await Annuncio.find({ _id: { $in: user.annunci_pubblicati } });

	return res.status(200).json({ code: 200, annunci_pubblicati: annunci });
};

const get_annunci_salvati = async (req, res) => {
	userId = req.loggedUser.id;

	if (!userId)
		return res.status(401).json({ code: 401, message: 'Unauthorized.' });

	let user = await Utente.findOne({ _id: userId }).exec().catch((err) => {
		return res.status(500).json({ code: 500, message: 'Internal server error.' });
	});
	
	if (!user)
		return res.status(404).json({ code: 404, message: 'Utente non trovato.' });

	const annunci = await Annuncio.find({ _id: { $in: user.annunci_salvati } });

	return res.status(200).json({ code: 200, annunci_salvati: annunci });
};

const get_ricerche_salvate = async (req, res) => {
}

const get_chat = async (req, res) => {
}

const modifica_profilo = async (req, res) => {
}

const recupero_password = async (req, res) => {
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