const orderCollection = require('../models/orderModel');
const stockCollection = require('../models/stockModel');

const createOrder = async (req, res) => {
  const {
    productId,
    productName,
    type,
    quantity,
    price,
    date,
    contactPerson,
    contactPhone,
  } = await req.body;
  const email = req.userEmail;
  if (!type) {
    return res.status(400).json({
      success: false,
      message: 'Type is Required.',
    });
  }
  if (
    !productId ||
    !productName ||
    !quantity ||
    !price ||
    !date ||
    !contactPerson ||
    !contactPhone
  ) {
    return res.status(400).json({
      success: false,
      message: 'All fields are Required.',
    });
  }

  if (type === 'purchase') {
    await stockCollection.updateOne(
      { productId, email }, // filter
      { $inc: { quantity }, $setOnInsert: { productId, email } }, // update
      { upsert: true } // create if not found
    );
    const newOrder = new orderCollection({
      productName,
      productId,
      quantity,
      type,
      price,
      date,
      contactPerson,
      contactPhone,
      email,
    });
    newOrder.save();
    return res.status(201).json({
      success: true,
      message: 'Order Created Sucessfully.',
      data : newOrder
    });
  } else if (type == 'sell') {

  }
};

const getOrders = async (req, res) => {
  try {
    const email = req.userEmail;
    const { productId, type, contactPerson, startDate, endDate } = req.query;

    const filter = { email };

    if (productId) filter.productId = productId;
    if (type) filter.type = type;
    if (contactPerson) filter.contactPerson = { $regex: contactPerson, $options: 'i' };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const sd = new Date(startDate);
        filter.date.$gte = sd;
      }
      if (endDate) {
        const ed = new Date(endDate);
        ed.setHours(23, 59, 59, 999);
        filter.date.$lte = ed;
      }
    }

    const orders = await orderCollection.find(filter).sort({ date: -1 });

    return res.status(201).json({
      success: true,
      message: 'Orders fetched successfully.',
      data:  orders ,
    });
  } catch (error) {
    console.error('getOrders Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
module.exports = { createOrder, getOrders };
