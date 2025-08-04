const categoryCollection = require('../models/categoryModel');
const { categoryLogAction } = require('../helper/logs');

const addCategory = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category Name Required.',
      });
    }

    const isCategoryExist = await categoryCollection.findOne({
      name,
      email: userEmail,
    });

    if (isCategoryExist) {
      return res.status(400).json({
        success: false,
        message: 'Category Already Exists.',
      });
    }

    const newCategory = new categoryCollection({
      name,
      email: userEmail,
    });

    await newCategory.save();

    categoryLogAction(
      userEmail,
      'Category',
      'Add',
      `Category '${name}' added.`
    );

    return res.status(201).json({
      success: true,
      message: 'Category added successfully.',
      data: {
        catgeory: newCategory,
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

const EditCategory = async (req, res) => {};

const deleteCategory = async (req, res) => {};

const getCategories = async (req, res) => {
  try {
    const userEmail = req.userEmail;

    const categories = await categoryCollection
      .find({
        email: userEmail,
      })
      .sort({ createdAt: -1 });

    return res.status(201).json({
      success: true,
      message: 'Category Fetched successfully.',
      data: {
        categories,
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

module.exports = { addCategory, EditCategory, deleteCategory, getCategories };
