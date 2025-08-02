const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/get-user', authMiddleware, getUser);

module.exports = authRouter;
