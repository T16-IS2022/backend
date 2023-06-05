const express = require('express');
const router = express.Router();
const annuncioController = require('../controllers/annuncio');
const { tokenChecker } = require('../middleware/tokenChecker');

router.get('/annuncio/list', annuncioController.get_annunci);

router.get('/annuncio/:id', annuncioController.get_annuncio);

router.delete('/annuncio/:id', tokenChecker, annuncioController.elimina_annuncio);

router.patch('/annuncio/:id', tokenChecker, annuncioController.modifica_annuncio);

router.post('/annuncio', tokenChecker, annuncioController.pubblica_annuncio);

router.get('/annuncio/salva/:id', tokenChecker, annuncioController.salva_annuncio);

router.delete('/annuncio/salva/:id', tokenChecker, annuncioController.rimuovi_annuncio_salvato);

router.post('/annuncio/pagamento', tokenChecker, annuncioController.pagamento);

module.exports = router;