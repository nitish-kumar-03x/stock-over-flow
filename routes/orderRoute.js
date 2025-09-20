const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {createOrder} = require('../controllers/orderController');
const orderRouter = express.Router();

orderRouter.post('/create-order',authMiddleware,createOrder);
module.exports = orderRouter;
