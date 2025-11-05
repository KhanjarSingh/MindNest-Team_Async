const { createMessage, getMessages } = require('../services/chat.service');

const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;
    if (!receiverId || !content) {
        return res.status(400).json({ message: "receiverId and content are required" });
    }
    if (typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: "content must be a non-empty string" });
    }
    if (receiverId === senderId) {
        return res.status(400).json({ message: "Cannot send message to yourself" });
    }
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
if (!receiverId || isNaN(parseInt(receiverId))) {
     return res.status(400).json({ 
         success: false,
        message: "Invalid receiverId" 
      });
       }
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

module.exports = {
    sendMessage,
    getChatHistory
};
