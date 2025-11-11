const ideaService = require('../services/idea.service.js');


const handleCreateIdea = async (req, res) => {
  try {
    console.log('=== handleCreateIdea called ===');
    console.log('req.body:', req.body);
    
    const ideaData = req.body;

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

module.exports = {
  handleCreateIdea,
};