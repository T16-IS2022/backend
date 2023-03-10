const Utente = require('../models/utente'); // get our mongoose model
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
		cognome: user.cognome
	});
};

// signup
const signup = async (req, res) => {
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
	/* non dovendo fare operazioni sul backend, il logout ?? implementato nel frontend,
	 * ossia in /views/LogoutView.vue
	 */
};

const deleteUtente = (req, res) => {
    console.log("Deleting user: ", req.body.userId);

    Utente.findOneAndDelete({ _id: req.body.userId }, (err, data) => {
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
};

module.exports = {
	login: login,
	signup: signup, 
	logout: logout,
	deleteUtente: deleteUtente
};