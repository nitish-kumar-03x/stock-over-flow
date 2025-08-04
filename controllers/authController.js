const userCollection = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authLogAction } = require('../helper/logs');
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
      authLogAction(email, 'User', 'Register', 'New user registered');
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

    authLogAction(user.email, 'User', 'Login', 'User logged in');

    if (token) {
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

const getUser = async (req, res) => {
  try {
    const userEmail = req.userEmail;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is missing in the request.',
      });
    }

    const user = await userCollection.findOne(
      { email: userEmail },
      { password: 0 }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully.',
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, username, phone, country, state_town } = req.body;

    if (!name || !email || !username || !phone || !country || !state_town) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const user = await userCollection.findOne({ email: req.userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.name = name;
    user.username = username;
    user.phone = phone;
    user.country = country;
    user.state_town = state_town;

    await user.save();

    authLogAction(user.email, 'User', 'Update', 'User profile updated');

    return res.status(201).json({
      success: true,
      message: 'User updated successfully.',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

module.exports = { register, login, getUser, updateUser };
