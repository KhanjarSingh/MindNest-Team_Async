const { prisma } = require('../config/prisma');

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

module.exports = {
    createMessage,
    getMessages
};
