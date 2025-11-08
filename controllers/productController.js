const productCollection = require('../models/productModel');
const stockCollection = require('../models/stockModel');

const { productLogAction } = require('../helper/logs');

const addProduct = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const {
      name,
      description,
      category,
      brand,
      costPrice,
      sellingPrice,
      unit,
      location,
      expiryDate,
      manufactureDate,
      batchNumber,
      status,
      image,
      tags,
    } = await req.body;

    if (
      !name ||
      !description ||
      !category ||
      !brand ||
      !costPrice ||
      !sellingPrice ||
      !unit ||
      !location ||
      !expiryDate ||
      !manufactureDate ||
      !batchNumber ||
      !status ||
      !image ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: 'All Fields Required.',
      });
    }

    const isProductExist = await productCollection.findOne({
      name,
      email: userEmail,
    });

    if (isProductExist) {
      return res.status(400).json({
        success: false,
        message: 'Product Already Exists.',
      });
    }
    const newProduct = await new productCollection({
      name,
      description,
      category,
      brand,
      costPrice,
      sellingPrice,
      unit,
      location,
      expiryDate,
      manufactureDate,
      batchNumber,
      status,
      image,
      tags,
      email: userEmail,
    });

    await newProduct.save();
    const newStock = await new stockCollection({
      productId: newProduct._id,
      email: userEmail,
      quantity: 0,
    });
    await newStock.save();
    productLogAction(userEmail, 'Product', 'Add', `Product '${name}' added.`);

    return res.status(201).json({
      success: true,
      message: 'product added successfully.',
      data: { product: newProduct },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.userEmail;
    const {
      name,
      description,
      category,
      brand,
      costPrice,
      sellingPrice,
      unit,
      location,
      expiryDate,
      manufactureDate,
      batchNumber,
      status,
      tags,
      // image, // Don't update image for now
    } = req.body;

    if (
      !id ||
      !name ||
      !description ||
      !category ||
      !brand ||
      !costPrice ||
      !sellingPrice ||
      !unit ||
      !location ||
      !expiryDate ||
      !manufactureDate ||
      !batchNumber ||
      !status ||
      !tags
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields except image are required.',
      });
    }

    // Find the product
    const oldProduct = await productCollection.findOne({
      _id: id,
      email: userEmail,
    });

    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized.',
      });
    }

    // Update fields (do not update image)
    oldProduct.name = name;
    oldProduct.description = description;
    oldProduct.category = category;
    oldProduct.brand = brand;
    oldProduct.costPrice = costPrice;
    oldProduct.sellingPrice = sellingPrice;
    oldProduct.unit = unit;
    oldProduct.location = location;
    oldProduct.expiryDate = expiryDate;
    oldProduct.manufactureDate = manufactureDate;
    oldProduct.batchNumber = batchNumber;
    oldProduct.status = status;
    oldProduct.tags = tags;

    await oldProduct.save();

    productLogAction(
      userEmail,
      'Product',
      'Updated',
      `Product '${oldProduct.name}' updated.`
    );

    return res.status(201).json({
      success: true,
      message: 'Product updated successfully.',
      data: {
        product: oldProduct,
      },
    });
  } catch (error) {
    console.error('EditProduct Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const { name, category, brand, batchNumber, unit, status } = req.query;

    // Build filter object
    const filter = {};
    filter.email = userEmail;
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (batchNumber)
      filter.batchNumber = { $regex: batchNumber, $options: 'i' };
    if (unit) filter.unit = unit;
    if (status) filter.status = status;

    const products = await productCollection
      .find(filter)
      .sort({ createdAt: -1 });

    // Fetch quantities for all products from stockCollection
    const productIds = products.map((p) => p._id);
    const stocks = await stockCollection.find({
      productId: { $in: productIds },
      email: userEmail,
    });
    const stockMap = {};
    stocks.forEach((s) => {
      stockMap[s.productId.toString()] = s.quantity;
    });

    // Attach quantity to each product
    const productsWithQty = products.map((p) => {
      const obj = p.toObject ? p.toObject() : p;
      obj.quantity = stockMap[p._id.toString()] || 0;
      return obj;
    });

    return res.status(201).json({
      success: true,
      message: 'Products Fetched.',
      data: {
        products: productsWithQty,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const { id } = req.params;

    const oldProduct = await productCollection.findOne({
      email: userEmail,
      _id: id,
    });

    const isDeleted = await productCollection.findOneAndDelete({
      email: userEmail,
      _id: id,
    });

    if (isDeleted) {
      productLogAction(
        userEmail,
        'Product',
        'Deleted',
        `Product '${oldProduct.name}' Deleted.`
      );

      return res.status(201).json({
        status: true,
        message: 'Product Deleted.',
        data: {},
      });
    } else {
      return res.status(400).json({
        message: 'Product Deleted Failed.',
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const getOutOfStockProducts = async (req, res) => {
  try {
    const userEmail = req.userEmail;

    const outOfStock = await stockCollection
      .find(
        { email: userEmail, quantity: { $lte: 0 } },
        { productId: 1, _id: 0 }
      )
      .sort({ createdAt: -1 });
    console.log(outOfStock);

    const productIds = outOfStock.map((p) => p.productId);
    const products = await productCollection.find({
      _id: { $in: productIds },
      email: userEmail,
    });

    return res.status(201).json({
      success: true,
      message: 'Out of Stock Products Fetched.',
      data: {
      products,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  editProduct,
  getOutOfStockProducts,
};
