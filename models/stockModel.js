const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);
const stockCollection =  mongoose.model('stock', stockSchema);
module.exports = stockCollection;