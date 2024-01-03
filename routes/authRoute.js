const express = require('express')
const { registerController, loginController, testController, forgotPasswordController, updateProfileController } = require('../controllers/authController')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware')


//router object
const router = express.Router()

//routing

//Register
router.post('/register', registerController)

//Login 
router.post('/login', loginController)

//forgot password
router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test', requireSignIn, isAdmin, testController)

//protected route
//for user
router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ok: true})
})
//for admin
router.get('/admin-auth', requireSignIn,isAdmin, (req,res) => {
    res.status(200).send({ok: true})
})

//update profile
router.put('/profile', requireSignIn, updateProfileController)




module.exports = router

