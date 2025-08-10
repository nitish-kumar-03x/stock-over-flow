const express = require('express');
const {
  addProduct
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const productRouter = express.Router();

productRouter.post('/add-product', authMiddleware, addProduct);


module.exports = productRouter;
