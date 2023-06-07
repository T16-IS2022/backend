const express = require('express');
const router = express.Router();
const ricercaController = require('../controllers/ricerca');
const { tokenChecker } = require('../middleware/tokenChecker');

router.post('/ricerca', ricercaController.ricerca_annunci);

router.post('/ricerca/salva', tokenChecker, ricercaController.salva_ricerca);

router.delete('/ricerca/salva/:id', tokenChecker, ricercaController.rimuovi_ricerca_salvata);

module.exports = router;