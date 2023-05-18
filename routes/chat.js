const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const tokenChecker = require('../middleware/tokenChecker');

router.post('/chat/:id', chatController.get_chat);

module.exports = router;