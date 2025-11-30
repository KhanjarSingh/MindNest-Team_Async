// Make sure to import your configured prisma client
// You likely have this in /config/prisma.js or /client.js
// I'm assuming it's exported as 'prisma'
const prisma = require('../config/prisma.js');

/**
 * Creates a new idea in the database.
 * @param {object} ideaData - The data for the new idea.
 * @returns {Promise<object>} The newly created idea.
 */
const createIdea = async (ideaData) => {
  const { userId, title, pitch, description, demoLink, pitchDeckUrl, ppt_Url } = ideaData;

  try {
    console.log('=== idea.service.createIdea called ===');
    console.log('Creating idea with data:', { userId, title, pitch, description, demoLink, pitchDeckUrl, ppt_Url });
    console.log('Prisma instance:', typeof prisma);
    console.log('Prisma.idea:', typeof prisma?.idea);
    
    if (!prisma || !prisma.idea) {
      throw new Error('Prisma client not initialized properly');
    }
    
    const newIdea = await prisma.idea.create({
      data: {
        userId,
        title,
        pitch,
        description,
        demoLink,
        pitchDeckUrl,
        ppt_Url,
      },
    });
    
    console.log('Idea created successfully:', newIdea);
    return newIdea;
  } catch (error) {
    console.error('=== ERROR in idea.service.createIdea ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Gets all ideas with user information, sorted by newest first
 * @returns {Promise<array>} Array of ideas with user details
 */
const getAllIdeas = async () => {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ideas;
  } catch (error) {
    console.error('=== ERROR in idea.service.getAllIdeas ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Gets a single idea by ID with user information
 * @param {string} ideaId - The ID of the idea
 * @returns {Promise<object>} The idea with user details
 */
const getIdeaById = async (ideaId) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return idea;
  } catch (error) {
    console.error('=== ERROR in idea.service.getIdeaById ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Gets all ideas for a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<array>} Array of ideas for the user
 */
const getIdeasByUserId = async (userId) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ideas;
  } catch (error) {
    console.error('=== ERROR in idea.service.getIdeasByUserId ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Updates the status of an idea
 * @param {string} ideaId - The ID of the idea
 * @param {string} status - The new status
 * @returns {Promise<object>} The updated idea
 */
const updateStatus = async (ideaId, status) => {
  try {
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: { status },
    });
    return updatedIdea;
  } catch (error) {
    console.error('=== ERROR in idea.service.updateStatus ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Updates the score of an idea
 * @param {string} ideaId - The ID of the idea
 * @param {number} score - The new score (1-10)
 * @returns {Promise<object>} The updated idea
 */
const updateScore = async (ideaId, score) => {
  try {
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: { score },
    });
    return updatedIdea;
  } catch (error) {
    console.error('=== ERROR in idea.service.updateScore ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Updates the funding amount of an idea
 * @param {string} ideaId - The ID of the idea
 * @param {number} fundingAmount - The new funding amount
 * @returns {Promise<object>} The updated idea
 */
const updateFundingAmount = async (ideaId, fundingAmount) => {
  try {
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: { fundingAmount },
    });
    return updatedIdea;
  } catch (error) {
    console.error('=== ERROR in idea.service.updateFundingAmount ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Updates the admin note of an idea
 * @param {string} ideaId - The ID of the idea
 * @param {string} note - The new admin note
 * @returns {Promise<object>} The updated idea
 */
const updateNote = async (ideaId, note) => {
  try {
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: { note },
    });
    return updatedIdea;
  } catch (error) {
    console.error('=== ERROR in idea.service.updateNote ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Updates the tags of an idea
 * @param {string} ideaId - The ID of the idea
 * @param {array} tags - The new tags array
 * @returns {Promise<object>} The updated idea
 */
const updateTags = async (ideaId, tags) => {
  try {
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: { tags },
    });
    return updatedIdea;
  } catch (error) {
    console.error('=== ERROR in idea.service.updateTags ===');
    console.error('Error message:', error.message);
    throw error;
  }
};

module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  getIdeasByUserId,
  updateStatus,
  updateScore,
  updateFundingAmount,
  updateNote,
  updateTags,
};