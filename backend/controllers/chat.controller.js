const { createMessage, getMessages, getConversations } = require('../services/chat.service');

const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    try {
        const message = await createMessage(senderId, receiverId, content);
        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChatHistory = async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user.id;  // From auth middleware

    try {
        console.log('Fetching chat history for:', { senderId, receiverId }); // Debug log
        const messages = await getMessages(senderId, receiverId);
        return res.status(200).json({ 
            success: true,
            data: messages 
        });
    } catch (error) {
        console.error('Chat history error:', error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getConversationsList = async (req, res) => {
    const userId = req.user.id;

    try {
        const conversations = await getConversations(userId);
        return res.status(200).json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error('Conversations error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getChatHistory,
    getConversationsList
};
