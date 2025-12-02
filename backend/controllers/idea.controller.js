const ideaService = require('../services/idea.service.js');

const handleCreateIdea = async (req, res) => {
  try {
    console.log('=== handleCreateIdea called ===');
    console.log('req.body:', req.body);
    
    const ideaData = req.body;
    const userId = req.user?.id; // Get user ID from auth middleware

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
    const newIdea = await ideaService.createIdea(ideaData, userId);

    console.log('Idea created successfully:', newIdea);
    res.status(201).json({ success: true, message: 'Idea created successfully!', idea: newIdea, data: newIdea });
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
    res.status(200).json({ data: ideas });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ message: 'Failed to fetch ideas', error: error.message });
  }
};

const handleGetIdeaById = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await ideaService.getIdeaById(id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.status(200).json({ data: idea });
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ message: 'Failed to fetch idea', error: error.message });
  }
};

const handleUpdateIdeaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedIdea = await ideaService.updateIdeaStatus(id, status);
    res.status(200).json({ data: updatedIdea });
  } catch (error) {
    console.error('Error updating idea status:', error);
    res.status(500).json({ message: 'Failed to update idea status', error: error.message });
  }
};

const handleUpdateIdeaScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const updatedIdea = await ideaService.updateIdeaScore(id, score);
    res.status(200).json({ data: updatedIdea });
  } catch (error) {
    console.error('Error updating idea score:', error);
    res.status(500).json({ message: 'Failed to update idea score', error: error.message });
  }
};

const handleUpdateIdeaFunding = async (req, res) => {
  try {
    const { id } = req.params;
    const { fundingAmount } = req.body;
    const updatedIdea = await ideaService.updateIdeaFunding(id, fundingAmount);
    res.status(200).json({ data: updatedIdea });
  } catch (error) {
    console.error('Error updating idea funding:', error);
    res.status(500).json({ message: 'Failed to update idea funding', error: error.message });
  }
};

const handleUpdateIdeaNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const updatedIdea = await ideaService.updateIdeaNote(id, note);
    res.status(200).json({ data: updatedIdea });
  } catch (error) {
    console.error('Error updating idea note:', error);
    res.status(500).json({ message: 'Failed to update idea note', error: error.message });
  }
};

const handleUpdateIdeaTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    const updatedIdea = await ideaService.updateIdeaTags(id, tags);
    res.status(200).json({ data: updatedIdea });
  } catch (error) {
    console.error('Error updating idea tags:', error);
    res.status(500).json({ message: 'Failed to update idea tags', error: error.message });
  }
};

const handleGetUserIdeas = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const ideas = await ideaService.getIdeasByUser(userId);
    res.status(200).json({ data: ideas });
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    res.status(500).json({ message: 'Failed to fetch user ideas', error: error.message });
  }
};

module.exports = {
  handleCreateIdea,
  handleGetAllIdeas,
  handleGetIdeaById,
  handleGetUserIdeas,
  handleUpdateIdeaStatus,
  handleUpdateIdeaScore,
  handleUpdateIdeaFunding,
  handleUpdateIdeaNote,
  handleUpdateIdeaTags,
};