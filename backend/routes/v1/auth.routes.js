const express = require('express')
const router = express.Router()
const {signup, getUser, updateUserController} = require('../../controllers/auth.controller')

router.get('/',(req,res)=>{
    return res.send("working")
}) // I have just used it so it will show working if this shows error then u r useless

router.post('/signup',signup)
router.get('/user', getUser);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUserController);

module.exports = router