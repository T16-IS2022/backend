const express = require('express'); //import express

const router = express.Router();
const annuncioController = require('../controllers/annuncio');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker

router.get('/annuncio/list', annuncioController.get_annunci);

router.get('/annuncio/:id', annuncioController.get_annuncio);

router.delete('/annuncio/:id', tokenChecker, annuncioController.elimina_annuncio);

router.post('/annuncio/pubblica', tokenChecker, annuncioController.pubblica_annuncio);

router.get('/annuncio/salva/:id', tokenChecker, annuncioController.salva_annuncio);

router.delete('/annuncio/salva/:id', tokenChecker, annuncioController.rimuovi_annuncio_salvato);

module.exports = router; // export to use in server.js