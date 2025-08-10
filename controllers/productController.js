const productCollection = require('../models/productModel');
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
      images,
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
      !images ||
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
      images,
      tags,
      email: userEmail,
    });

    await newProduct.save();
    productLogAction(userEmail, 'Product', 'Add', `Product '${name}' added.`);

    return res.status(201).json({
      success: true,
      message: 'product added successfully.',
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
module.exports = { addProduct };
