const express = require('express'); //import express

const router = express.Router();
const utenteController = require('../controllers/utente');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker

router.post('/utente/registrazione', utenteController.registrazione);

router.post('/utente/login', utenteController.login);

router.get('/utente/annunci-pubblicati', tokenChecker, utenteController.get_annunci_pubblicati);

router.get('/utente/logout', tokenChecker, utenteController.logout);
 
router.delete('/utente/:id', tokenChecker, utenteController.cancella_account);

router.get('/utente/annunci-salvati', tokenChecker, utenteController.get_annunci_salvati);

module.exports = router; // export to use in server.js