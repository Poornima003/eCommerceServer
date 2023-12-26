const express = require('express')
const { registerController, loginController, testController, forgotPasswordController } = require('../controllers/authController')
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

router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ok: true})
})

router.get('/admin-auth', requireSignIn,isAdmin, (req,res) => {
    res.status(200).send({ok: true})
})




module.exports = router

