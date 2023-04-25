const express = require('express'); //import express

const router = express.Router();
const annuncioController = require('../controllers/annuncio');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker

router.get('/annuncio/list', annuncioController.getAnnunci);

router.get('/annuncio/:id', annuncioController.getAnnuncio);

router.delete('/annuncio/:id', tokenChecker, annuncioController.deleteAnnuncio);

router.post('/annuncio/pubblica', tokenChecker, annuncioController.addAnnuncio);

router.get('/annuncio/:id/salva', tokenChecker, annuncioController.saveAnnuncio);

router.delete('/annuncio/:id/salva', tokenChecker, annuncioController.deleteAnnuncioSalvato);

module.exports = router; // export to use in server.js