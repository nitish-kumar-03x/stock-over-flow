const express = require('express');
const {
  register,
  login,
  getUser,
  updateUser,
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/get-user', authMiddleware, getUser);
authRouter.put('/update-user', authMiddleware, updateUser);

module.exports = authRouter;
