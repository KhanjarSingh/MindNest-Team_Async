const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getConversationsList } = require('../../controllers/chat.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.post('/send', authenticateToken, sendMessage);
router.get('/history/:receiverId', authenticateToken, getChatHistory);
router.get('/conversations', authenticateToken, getConversationsList);

module.exports = router;
