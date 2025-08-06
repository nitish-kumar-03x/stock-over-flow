const express = require('express');
const {
  addCategory,
  editCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const categoryRouter = express.Router();

categoryRouter.post('/add-category', authMiddleware, addCategory);
categoryRouter.put('/edit-category/:id', authMiddleware, editCategory);
categoryRouter.delete('/delete-category/:id', authMiddleware, deleteCategory);
categoryRouter.get('/get-categories', authMiddleware, getCategories);

module.exports = categoryRouter;
