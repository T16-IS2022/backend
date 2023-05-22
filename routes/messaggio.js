const express = require('express');
const router = express.Router();
const messaggioController = require('../controllers/messaggio');
const tokenChecker = require('../middleware/tokenChecker');

router.post('/messaggio', tokenChecker, messaggioController.invia_messaggio);

module.exports = router;