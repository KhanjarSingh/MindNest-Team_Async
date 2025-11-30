const { Router } = require('express');
const { 
  handleCreateIdea,
  handleGetAllIdeas,
  handleGetIdeaById,
  handleGetMyIdeas,
  handleUpdateStatus,
  handleUpdateScore,
  handleUpdateFundingAmount,
  handleUpdateNote,
  handleUpdateTags,
} = require('../../controllers/idea.controller.js');

const router = Router();

// Create idea (requires auth - userId from req.user)
router.post('/', handleCreateIdea);
router.post('/create', handleCreateIdea); // Alias for consistency

// Get all ideas (for admin dashboard)
router.get('/', handleGetAllIdeas);
router.get('/all', handleGetAllIdeas); // Alias for consistency

// Get current user's ideas (for participants)
router.get('/my-ideas', handleGetMyIdeas);

// Get single idea by ID
router.get('/:id', handleGetIdeaById);

// Admin update endpoints (PATCH)
router.patch('/:id/status', handleUpdateStatus);
router.patch('/:id/score', handleUpdateScore);
router.patch('/:id/funding', handleUpdateFundingAmount);
router.patch('/:id/note', handleUpdateNote);
router.patch('/:id/tags', handleUpdateTags);

module.exports = router;