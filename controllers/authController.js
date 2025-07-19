const userCollection = require('../models/userModel');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
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
      data: {
        user: {
          username,
          email,
        },
      },
    });
  } else {
    return res.status(400).json({
      success: true,
      message: 'An error occurred',
    });
  }
};

module.exports = { register };
