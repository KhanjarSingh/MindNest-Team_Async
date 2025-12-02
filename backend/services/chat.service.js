const prisma = require('../config/prisma');

const createMessage = async (senderId, receiverId, content) => {
    try {
        // Verify users exist before creating message
        const [sender, receiver] = await Promise.all([
            prisma.user.findUnique({ where: { id: senderId } }),
            prisma.user.findUnique({ where: { id: receiverId } })
        ]);

        if (!sender) {
            throw new Error('Sender not found');
        }
        if (!receiver) {
            throw new Error('Receiver not found');
        }

        const message = await prisma.chat.create({
            data: {
                content,
                sender: { connect: { id: senderId } },
                receiver: { connect: { id: receiverId } }
            },
            include: {
                sender: {
                    select: { id: true, username: true }
                },
                receiver: {
                    select: { id: true, username: true }
                }
            }
        });
        return message;
    } catch (error) {
        console.error('Chat creation error:', error);
        if (error.code === 'P2002') {
            throw new Error('Database constraint violation');
        }
        if (error.code === 'P2025') {
            throw new Error('Invalid sender or receiver ID');
        }
        throw new Error(`Failed to create message: ${error.message}`);
    }
};

const getMessages = async (senderId, receiverId) => {
    try {
        // Convert IDs to integers if they're strings
        const sId = parseInt(senderId);
        const rId = parseInt(receiverId);
        
        const messages = await prisma.chat.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { senderId: sId },
                            { receiverId: rId }
                        ]
                    },
                    {
                        AND: [
                            { senderId: rId },
                            { receiverId: sId }
                        ]
                    }
                ]
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        console.log('Found messages:', messages); 
        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error(`Failed to fetch messages: ${error.message}`);
    }
};

const getConversations = async (userId) => {
    try {
        // Get all chat messages and group by student (non-admin users)
        const conversations = await prisma.chat.findMany({
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Group by student users (non-admin)
        const conversationMap = new Map();
        
        conversations.forEach(message => {
            let student = null;
            let studentId = null;
            
            // Identify the student (non-admin) in the conversation
            if (message.sender.role.name !== 'ADMIN') {
                student = message.sender;
                studentId = message.senderId;
            } else if (message.receiver.role.name !== 'ADMIN') {
                student = message.receiver;
                studentId = message.receiverId;
            }
            
            // Only include conversations involving students
            if (student && !conversationMap.has(studentId)) {
                conversationMap.set(studentId, {
                    partnerId: studentId,
                    partnerName: student.username,
                    partnerEmail: student.email,
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt,
                    unreadCount: 0
                });
            }
        });
        
        return Array.from(conversationMap.values());
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
};

module.exports = {
    createMessage,
    getMessages,
    getConversations
};
