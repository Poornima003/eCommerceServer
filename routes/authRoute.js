const express = require('express')
const { registerController } = require('../controllers/authController')

//router object
const router = express.Router()

//routing

//Register
router.post('/register', registerController)

module.exports = router