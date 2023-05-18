const express = require('express');
const router = express.Router();
const ricercaController = require('../controllers/ricerca');
const tokenChecker = require('../middleware/tokenChecker');

router.get('/ricerca/:id', ricercaController.ricerca_annunci);

router.post('/ricerca/salva/:id', ricercaController.salva_ricerca);

router.delete('/ricerca/salva/:id', ricercaController.rimuovi_ricerca_salvata);

module.exports = router;