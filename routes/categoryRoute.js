const express = require('express');
const {
  addCategory,
  EditCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const categoryRouter = express.Router();

categoryRouter.post('/add-category', authMiddleware, addCategory);
categoryRouter.put('/edit-category', authMiddleware, EditCategory);
categoryRouter.delete('/delete-category', authMiddleware, deleteCategory);
categoryRouter.get('/get-categories', authMiddleware, getCategories);

module.exports = categoryRouter;
