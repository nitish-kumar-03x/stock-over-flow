const express = require('express');
const {
  addProduct, getProducts
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const {uploadProductMiddleware} = require('../middlewares/uploadMiddleware');


const productRouter = express.Router();

productRouter.post('/add-product', authMiddleware,uploadProductMiddleware, addProduct);
productRouter.get('/get-products', authMiddleware, getProducts);

module.exports = productRouter;
