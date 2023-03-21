const express = require('express'); //import express

const router = express.Router();
const annuncioController = require('../controllers/annuncio');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker

router.get('/annuncio/list', annuncioController.getAnnunci);

router.get('/annuncio/:id/info', annuncioController.getAnnuncio);

router.post('/annuncio/pubblica', tokenChecker, annuncioController.publish);

router.delete('/annuncio/:id', tokenChecker, annuncioController.deleteAnnuncio);

module.exports = router; // export to use in server.js