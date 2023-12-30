const express = require('express')
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware')
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController')

const router = express.Router()

router.post('/create-category', requireSignIn,isAdmin,createCategoryController)


router.put('/update-category/:id',requireSignIn,isAdmin, updateCategoryController)

//get all categories
router.get('/get-category',categoryController)

//singlw category
router.get('/single-category/:slug', singleCategoryController)

router.delete('/delete-category/:id',requireSignIn,isAdmin, deleteCategoryController)

module.exports = router