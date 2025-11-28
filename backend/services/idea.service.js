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
  const { title, pitch, description, demoLink, pitchDeckUrl, ppt_Url } = ideaData;

  try {
    console.log('=== idea.service.createIdea called ===');
    console.log('Creating idea with data:', { title, pitch, description, demoLink, pitchDeckUrl, ppt_Url });
    console.log('Prisma instance:', typeof prisma);
    console.log('Prisma.idea:', typeof prisma?.idea);
    
    if (!prisma || !prisma.idea) {
      throw new Error('Prisma client not initialized properly');
    }
    
    const newIdea = await prisma.idea.create({
      data: {
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

module.exports = {
  createIdea,
};