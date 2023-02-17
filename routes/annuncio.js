const express = require('express'); //import express

const router = express.Router();
const annuncioController = require('../controllers/annuncio');
const tokenChecker = require('../middleware/tokenChecker'); //import tokenChecker

router.post('/annuncio/pubblica', tokenChecker, annuncioController.publish);

router.get('/annuncio/list', annuncioController.getAnnunci);

module.exports = router; // export to use in server.js