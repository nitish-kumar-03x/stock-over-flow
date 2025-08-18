const express = require('express');
const {
  addProduct, getProducts, deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const {uploadProductMiddleware} = require('../middlewares/uploadMiddleware');


const productRouter = express.Router();

productRouter.post('/add-product', authMiddleware,uploadProductMiddleware, addProduct);
productRouter.get('/get-products', authMiddleware, getProducts);
productRouter.delete('/delete-product/:id', authMiddleware, deleteProduct);

module.exports = productRouter;
