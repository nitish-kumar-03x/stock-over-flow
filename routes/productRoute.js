const express = require('express');
const {
  addProduct,
  getProducts,
  deleteProduct,
  editProduct,
  getOutOfStockProducts
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadProductMiddleware } = require('../middlewares/uploadMiddleware');

const productRouter = express.Router();

productRouter.post(
  '/add-product',
  authMiddleware,
  uploadProductMiddleware,
  addProduct
);
productRouter.put('/edit-product/:id', authMiddleware, editProduct);
productRouter.get('/get-products', authMiddleware, getProducts);
productRouter.delete('/delete-product/:id', authMiddleware, deleteProduct);
productRouter.get('/get-out-of-stock-report', authMiddleware, getOutOfStockProducts);
module.exports = productRouter;
