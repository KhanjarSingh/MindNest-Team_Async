const { Router } = require('express');
const { handleCreateIdea } = require('../../controllers/idea.controller.js');

const router = Router();


router.post(
  '/',
  handleCreateIdea
);

module.exports = router;