const userCollection = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      phone,
      country,
      state_town,
      password,
      confirm_password,
    } = req.body;

    if (
      !name ||
      !email ||
      !username ||
      !phone ||
      !country ||
      !state_town ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: true,
        message: 'All fields required.',
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: true,
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
    }

    if (password != confirm_password) {
      return res.status(400).json({
        success: true,
        message: 'Passwords must be same.',
      });
    }

    const isUserExist = await userCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res.status(400).json({
        success: true,
        message: 'A user with this username or email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userCollection({
      name,
      email,
      username,
      phone,
      country,
      state_town,
      password: hashedPassword,
    });

    const isSaved = await newUser.save();
    if (isSaved) {
      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
      });
    } else {
      return res.status(400).json({
        success: true,
        message: 'An error occurred',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { unique, password } = req.body;
    if (!unique || !password) {
      return res.status(400).json({
        success: true,
        message: 'All fields required.',
      });
    }

    const user = await userCollection.findOne({
      $or: [{ username: unique }, { email: unique }],
    });
    if (!user) {
      return res.status(400).json({
        success: true,
        message: 'Invalid Credentials.',
      });
    }

    const isPassMatched = await bcrypt.compare(password, user.password);
    if (!isPassMatched) {
      return res.status(400).json({
        success: true,
        message: 'Invalid Credentials.',
      });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: '7d',
    });

    if (token) {
      console.log(token);
      return res.status(201).json({
        success: true,
        message: 'User login successfully',
        data: {
          token,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

module.exports = { register, login };
