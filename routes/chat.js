const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const tokenChecker = require('../middleware/tokenChecker');

router.post('/chat', chatController.crea_chat);

router.get('/chat/:id', chatController.get_chat);

module.exports = router;