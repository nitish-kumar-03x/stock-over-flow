const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: 'pcs', // e.g., kg, g, litre, ml, pcs, box
    },
    location: {
      type: String,
      default: '', // Warehouse or store location
    },
    expiryDate: {
      type: Date, // optional: for perishable goods
    },
    manufactureDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
    },
    images: [
      {
        type: [String], // array of strings
        required: true,
      },
    ],
    tags: [String], // for search and filtering
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const productCollection = mongoose.model('product', productSchema);
module.exports = productCollection;
