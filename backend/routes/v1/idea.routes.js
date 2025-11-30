const { Router } = require('express');
const { 
  handleCreateIdea, 
  handleGetAllIdeas, 
  handleGetIdeaById, 
  handleGetUserIdeas,
  handleUpdateIdeaStatus, 
  handleUpdateIdeaScore, 
  handleUpdateIdeaFunding, 
  handleUpdateIdeaNote, 
  handleUpdateIdeaTags 
} = require('../../controllers/idea.controller.js');
const { authenticateToken } = require('../../middlewares/auth.middleware.js');

const router = Router();

router.get('/', handleGetAllIdeas);
router.get('/user', authenticateToken, handleGetUserIdeas);
router.get('/:id', handleGetIdeaById);
router.post('/', authenticateToken, handleCreateIdea);
router.patch('/:id/status', handleUpdateIdeaStatus);
router.patch('/:id/score', handleUpdateIdeaScore);
router.patch('/:id/fundingAmount', handleUpdateIdeaFunding);
router.patch('/:id/note', handleUpdateIdeaNote);
router.patch('/:id/tags', handleUpdateIdeaTags);

module.exports = router;