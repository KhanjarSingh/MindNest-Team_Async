const ideaService = require('../services/idea.service.js');


const handleCreateIdea = async (req, res) => {
  try {
    console.log('=== handleCreateIdea called ===');
    console.log('req.body:', req.body);
    console.log('req.user:', req.user);
    
    // Get userId from authenticated user (set by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required. User ID not found.' 
      });
    }

    const userId = req.user.id;
    const ideaData = { ...req.body, userId };

    const requiredFields = ['title', 'pitch', 'description'];
    const missingFields = requiredFields.filter(field => !ideaData[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields: missingFields 
      });
    }

    console.log('All required fields present, calling service...');
    const newIdea = await ideaService.createIdea(ideaData);

    console.log('Idea created successfully:', newIdea);
    res.status(201).json({ message: 'Idea created successfully!', data: newIdea });
  } catch (error) {
    console.error('=== ERROR in handleCreateIdea ===');
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create idea.', 
      error: error.message,
      details: error.code || error.meta || null
    });
  }
};

const handleGetAllIdeas = async (req, res) => {
  try {
    const ideas = await ideaService.getAllIdeas();
    res.status(200).json({ message: 'Ideas retrieved successfully', data: ideas });
  } catch (error) {
    console.error('=== ERROR in handleGetAllIdeas ===');
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Failed to retrieve ideas.', 
      error: error.message 
    });
  }
};

const handleGetIdeaById = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await ideaService.getIdeaById(id);
    
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.status(200).json({ message: 'Idea retrieved successfully', data: idea });
  } catch (error) {
    console.error('=== ERROR in handleGetIdeaById ===');
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Failed to retrieve idea.', 
      error: error.message 
    });
  }
};

const handleGetMyIdeas = async (req, res) => {
  try {
    // Get userId from authenticated user (set by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required. User ID not found.' 
      });
    }

    const userId = req.user.id;
    const ideas = await ideaService.getIdeasByUserId(userId);
    res.status(200).json({ message: 'Ideas retrieved successfully', data: ideas });
  } catch (error) {
    console.error('=== ERROR in handleGetMyIdeas ===');
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Failed to retrieve ideas.', 
      error: error.message 
    });
  }
};

const handleUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updatedIdea = await ideaService.updateStatus(id, status);
    res.status(200).json({ message: 'Status updated successfully', data: updatedIdea });
  } catch (error) {
    console.error('=== ERROR in handleUpdateStatus ===');
    console.error('Error message:', error.message);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.status(500).json({ 
      message: 'Failed to update status.', 
      error: error.message 
    });
  }
};

const handleUpdateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    
    if (score === undefined || score === null) {
      return res.status(400).json({ message: 'Score is required' });
    }
    
    if (score < 1 || score > 10) {
      return res.status(400).json({ message: 'Score must be between 1 and 10' });
    }
    
    const updatedIdea = await ideaService.updateScore(id, score);
    res.status(200).json({ message: 'Score updated successfully', data: updatedIdea });
  } catch (error) {
    console.error('=== ERROR in handleUpdateScore ===');
    console.error('Error message:', error.message);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.status(500).json({ 
      message: 'Failed to update score.', 
      error: error.message 
    });
  }
};

const handleUpdateFundingAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { fundingAmount } = req.body;
    
    if (fundingAmount === undefined || fundingAmount === null) {
      return res.status(400).json({ message: 'Funding amount is required' });
    }
    
    const updatedIdea = await ideaService.updateFundingAmount(id, fundingAmount);
    res.status(200).json({ message: 'Funding amount updated successfully', data: updatedIdea });
  } catch (error) {
    console.error('=== ERROR in handleUpdateFundingAmount ===');
    console.error('Error message:', error.message);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.status(500).json({ 
      message: 'Failed to update funding amount.', 
      error: error.message 
    });
  }
};

const handleUpdateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    
    if (note === undefined) {
      return res.status(400).json({ message: 'Note is required' });
    }
    
    const updatedIdea = await ideaService.updateNote(id, note);
    res.status(200).json({ message: 'Note updated successfully', data: updatedIdea });
  } catch (error) {
    console.error('=== ERROR in handleUpdateNote ===');
    console.error('Error message:', error.message);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.status(500).json({ 
      message: 'Failed to update note.', 
      error: error.message 
    });
  }
};

const handleUpdateTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }
    
    const updatedIdea = await ideaService.updateTags(id, tags);
    res.status(200).json({ message: 'Tags updated successfully', data: updatedIdea });
  } catch (error) {
    console.error('=== ERROR in handleUpdateTags ===');
    console.error('Error message:', error.message);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.status(500).json({ 
      message: 'Failed to update tags.', 
      error: error.message 
    });
  }
};

module.exports = {
  handleCreateIdea,
  handleGetAllIdeas,
  handleGetIdeaById,
  handleGetMyIdeas,
  handleUpdateStatus,
  handleUpdateScore,
  handleUpdateFundingAmount,
  handleUpdateNote,
  handleUpdateTags,
};