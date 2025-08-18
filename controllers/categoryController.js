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

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userEmail = req.userEmail;

    if (!name || !id) {
      return res
        .status(400)
        .json({ message: 'Both name and ID are required.' });
    }
    const oldCategory = await categoryCollection.findOne({
      _id: id,
      email: userEmail,
    });
    const updatedCategory = await categoryCollection.findOneAndUpdate(
      { _id: id, email: userEmail },
      { name }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: 'Category not found or unauthorized.' });
    }
    categoryLogAction(
      userEmail,
      'Category',
      'Updated',
      `Category '${oldCategory.name}' updated to '${name}'.`
    );
    return res.status(201).json({
      message: 'Category updated successfully.',
      data: {
        updatedCategory,
      },
    });
  } catch (err) {
    console.error('EditCategory Error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const { id } = req.params;

    const oldCategory = await categoryCollection.findOne({
      _id: id,
      email: userEmail,
    });
    const isDeleted = await categoryCollection.findOneAndDelete({
      _id: id,
      email: userEmail,
    });
    if (isDeleted) {
      categoryLogAction(
        userEmail,
        'Category',
        'Deleted',
        `Category '${oldCategory.name}' Deleted.`
      );

      return res.status(201).json({
        success: true,
        message: 'Category Deleted successfully.',
        data: {},
      });
    } else {
      return res.status(400).json({
        message: 'Category Deleted Failed.',
        data: {},
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

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

module.exports = { addCategory, editCategory, deleteCategory, getCategories };
