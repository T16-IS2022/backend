const Utente = require('../models/utente'); // get our mongoose model
const Annuncio = require('../models/annuncio'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const crypto = require('crypto');

// login
const login = async (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res.status(400).json({ success: false, message: 'Please, pass an email, password.' });
	}
	
	let user = await Utente.findOne({ email: req.body.email }).exec().catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!user) {
		console.log("User not found");
		return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
	}

	let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');

	if (user.password != hash) {
		return res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
	}
	// if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id	
	}

	var options = {
		expiresIn: 86400 // expires in 24 hours
	}

	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	return res.status(200).json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		id: user.id,
		nome: user.nome,
		cognome: user.cognome,
		email: user.email
	});
};

// registrazione
const registrazione = async (req, res) => {
	if (!req.body.nome || !req.body.cognome || !req.body.data_nascita || !req.body.numero_tel || !req.body.email || !req.body.password) {
		res.status(400).json({ success: false, message: 'Please, complete the form' });
		return;
	}
	// check if email is already taken
	let user;
	await Utente.findOne({ email: req.body.email }).exec().then((result) => {
		user = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (user) {
		res.status(409).json({ success: false, message: 'Email already taken.' });
		return;
	}

	// create a new user
	const nuovoUtente = new Utente({
		nome: req.body.nome,
		cognome:  req.body.cognome,
		data_nascita: req.body.data_nascita,
		numero_tel: req.body.numero_tel,
		email: req.body.email,
		password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
		annunci_salvati: [],
		annunci_pubblicati: [],
		ricerche_salvate: []
	});

	nuovoUtente.save((err) => {
		if (err) {
			return res.status(500).json({ Error: "Internal server error: " + err });
		}
		return res.status(201).json({ success: true, message: 'User created successfully.' });
	});
};

const logout = (req, res) => { 
	/* non dovendo fare operazioni sul backend, il logout è implementato nel frontend,
	 * ossia in /views/LogoutView.vue
	 */
};

const cancella_account = (req, res) => {
    console.log("Deleting user: ", req.params.id);

    Utente.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(500).json({ Error: err });
        }
        else if (data) {
            return res.status(204).json({ message: "User deleted" });
        } else {
            // if user is not found return 404 error
            return res.status(404).json({ message: "User not found" });
        }
    })

	//TO-DO Cancellare gli annunci dell'utente
};

const get_annunci_pubblicati = async (req, res) => {
	userId = req.loggedUser.id;

	if (!userId) {
		res.status(401).json({ success: false, message: 'Unauthorized.' });
		return;
	}

	let profile;
	await Utente.findOne({ _id: userId }).exec().then((result) => {
		profile = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!profile) {
		res.status(404).json({ success: false, message: 'User not found.' });
		return;
	}

	const annunci = await Annuncio.find({ _id: { $in: profile.annunci_pubblicati } });

	return res.status(200).json({ success: true, annunci_pubblicati: annunci });
};

const get_annunci_salvati = async (req, res) => {
	userId = req.loggedUser.id;

	if (!userId) {
		res.status(401).json({ success: false, message: 'Unauthorized.' });
		return;
	}

	let profile;
	await Utente.findOne({ _id: userId }).exec().then((result) => {
		profile = result;
	}).catch((err) => {
		return res.status(500).json({ Error: "Internal server error: " + err });
	});

	if (!profile) {
		res.status(404).json({ success: false, message: 'User not found.' });
		return;
	}

	const annunci = await Annuncio.find({ _id: { $in: profile.annunci_salvati } });

	return res.status(200).json({ success: true, annunci_salvati: annunci });
};

module.exports = {
	login: login,
	registrazione: registrazione, 
	logout: logout,
	cancella_account: cancella_account,
	get_annunci_pubblicati: get_annunci_pubblicati,
	get_annunci_salvati: get_annunci_salvati
};