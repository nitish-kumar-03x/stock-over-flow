const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    phone: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    state_town: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userCollection = mongoose.model('user', userSchema);
module.exports = userCollection;
