const express = require('express');
const {
  addProduct, getProducts, deleteProduct, editProduct
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const {uploadProductMiddleware} = require('../middlewares/uploadMiddleware');


const productRouter = express.Router();

productRouter.post('/add-product', authMiddleware,uploadProductMiddleware, addProduct);
productRouter.post('/edit-product', authMiddleware, editProduct);
productRouter.get('/get-products', authMiddleware, getProducts);
productRouter.delete('/delete-product/:id', authMiddleware, deleteProduct);

module.exports = productRouter;
