const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {createOrder, getOrders} = require('../controllers/orderController');
const orderRouter = express.Router();

orderRouter.post('/create-order',authMiddleware,createOrder);
orderRouter.get('/get-orders',authMiddleware,getOrders);
module.exports = orderRouter;
