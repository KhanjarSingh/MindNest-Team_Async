const express = require('express')
const router = express.Router()
const {signup, getUser, updateUserController,login, logout} = require('../../controllers/auth.controller')
const {verifyJWT} =require('../../controllers/jwt.controller')
router.get('/',(req,res)=>{
    return res.send("working")
}) // I have just used it so it will show working, if this shows error then u r useless



// router.get('/user', getUser);

// Signup & Login Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);



// Protected Routes (need valid token)
router.get('/users', getUser);
router.get('/user/:id', verifyJWT, getUser);
router.put('/user/:id', verifyJWT, updateUserController);




module.exports = router