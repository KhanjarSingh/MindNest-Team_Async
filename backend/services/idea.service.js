const prisma = require('../config/prisma.js');

const createIdea = async (ideaData, userId) => {
  const { title, pitch, description, demoLink, pitchDeckUrl, ppt_Url } = ideaData;

  try {
    console.log('=== idea.service.createIdea called ===');
    console.log('Creating idea with data:', { title, pitch, description, demoLink, pitchDeckUrl, ppt_Url, userId });
    
    const newIdea = await prisma.idea.create({
      data: {
        title,
        pitch,
        description,
        demoLink,
        pitchDeckUrl,
        ppt_Url,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
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

const getAllIdeas = async () => {
  return await prisma.idea.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getIdeaById = async (id) => {
  return await prisma.idea.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

const updateIdeaStatus = async (id, status) => {
  console.log('updateIdeaStatus called with:', { id, status });
  try {
    const result = await prisma.idea.update({
      where: { id: id },
      data: { status: status },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    console.log('Update successful:', result);
    return result;
  } catch (error) {
    console.error('Error in updateIdeaStatus:', error);
    throw error;
  }
};

const updateIdeaScore = async (id, score) => {
  return await prisma.idea.update({
    where: { id },
    data: { score },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

const updateIdeaFunding = async (id, fundingAmount) => {
  return await prisma.idea.update({
    where: { id },
    data: { fundingAmount },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

const updateIdeaNote = async (id, note) => {
  return await prisma.idea.update({
    where: { id },
    data: { note },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

const updateIdeaTags = async (id, tags) => {
  return await prisma.idea.update({
    where: { id },
    data: { tags },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
};

const getIdeasByUser = async (userId) => {
  return await prisma.idea.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  getIdeasByUser,
  updateIdeaStatus,
  updateIdeaScore,
  updateIdeaFunding,
  updateIdeaNote,
  updateIdeaTags,
};