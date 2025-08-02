const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedUser.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token payload.',
      });
    }

    req.userEmail = decodedUser.email;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
