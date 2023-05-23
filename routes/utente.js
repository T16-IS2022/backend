const express = require('express');

const router = express.Router();
const utenteController = require('../controllers/utente');
const tokenChecker = require('../middleware/tokenChecker');

// API di un utente anonimo
router.post('/utente/login', utenteController.login);

router.post('/utente/registrazione', utenteController.registrazione);

router.put('/utente/recupero-password', utenteController.recupero_password);

// API di un utente generico
router.get('/utente/ricerche-salvate', tokenChecker, utenteController.get_ricerche_salvate);

router.get('/utente/annunci-salvati', tokenChecker, utenteController.get_annunci_salvati);

//API di un utente autenticato

router.patch('/utente/:id', tokenChecker, utenteController.modifica_profilo);

router.delete('/utente/:id', tokenChecker, utenteController.cancella_account);

router.get('/utente/annunci-pubblicati', tokenChecker, utenteController.get_annunci_pubblicati);

router.get('/utente/chat', tokenChecker, utenteController.get_chat);

router.get('/utente/logout', tokenChecker, utenteController.logout);

module.exports = router;