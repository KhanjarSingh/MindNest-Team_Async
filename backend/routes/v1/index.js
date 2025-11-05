const express = require('express')
const router = express.Router()
const authRoutes = require('./auth.routes')
const chatRoute = require('./chat.route')



router.use('/auth', authRoutes)
router.use('/chat', chatRoute)

module.exports = router