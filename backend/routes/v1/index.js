const express = require('express')
const router = express.Router()
const authRoutes = require('./auth.routes')
const chatRoute = require('./chat.route')
const ideaRoutes = require('./idea.routes.js') 

router.use('/auth', authRoutes)
router.use('/chat', chatRoute)
router.use('/ideas', ideaRoutes) 

module.exports = router