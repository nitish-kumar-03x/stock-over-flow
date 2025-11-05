const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createOrder, getOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const orderRouter = express.Router();

orderRouter.post('/create-order', authMiddleware, createOrder);
orderRouter.get('/get-orders', authMiddleware, getOrders);
orderRouter.put('/update-order/:id', authMiddleware, updateOrder);
orderRouter.delete('/delete-order/:id', authMiddleware, deleteOrder);

module.exports = orderRouter;

