const express = require('express'); //import express

const router = express.Router();
const utenteController = require('../controllers/utente');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker

router.post('/utente/registrazione', utenteController.registrazione);

router.post('/utente/login', utenteController.login);

router.get('/utente/annunci-pubblicati', tokenChecker, utenteController.getAnnunciPubblicati);

router.get('/utente/logout', tokenChecker, utenteController.logout);
 
router.delete('/utente/cancella', tokenChecker, utenteController.deleteUtente);

router.get('/utente/annunci-salvati', tokenChecker, utenteController.getAnnunciSalvati);

module.exports = router; // export to use in server.js