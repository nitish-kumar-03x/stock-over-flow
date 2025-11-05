const orderCollection = require('../models/orderModel');
const stockCollection = require('../models/stockModel');

// Create Order
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

  if (type == 'purchase') {
    await stockCollection.updateOne(
      { productId, email },
      { $inc: { quantity }, $setOnInsert: { productId, email } },
      { upsert: true }
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
    await newOrder.save();
    return res.status(201).json({
      success: true,
      message: 'Order Created Successfully.',
      data: newOrder
    });
  } else if (type == 'sell') {
    // Check stock availability
    const stock = await stockCollection.findOne({ productId, email });
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock to sell.'
      });
    }
    // Decrement stock
    await stockCollection.updateOne(
      { productId, email },
      { $inc: { quantity: -quantity } }
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
    await newOrder.save();
    return res.status(201).json({
      success: true,
      message: 'Order Created Successfully.',
      data: newOrder
    });
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

// Update Order (edit)
const updateOrder = async (req, res) => {
  try {
    const email = req.userEmail;
    const { id } = req.params;
    const updateData = req.body;

    // Find the old order
    const oldOrder = await orderCollection.findOne({ _id: id, email });
    if (!oldOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // If productId, quantity, or type changes, adjust stock
    let stockDelta = 0;
    let stockProductId = oldOrder.productId;
    let oldType = oldOrder.type;
    let oldQuantity = oldOrder.quantity;
    let newType = updateData.type || oldOrder.type;
    let newQuantity = updateData.quantity !== undefined ? updateData.quantity : oldOrder.quantity;
    let newProductId = updateData.productId || oldOrder.productId;

    // Only update stock if relevant fields changed
    if (oldType !== newType || oldQuantity !== newQuantity || stockProductId !== newProductId) {
      // Revert old stock effect
      if (oldType === 'purchase') {
        await stockCollection.updateOne(
          { productId: stockProductId, email },
          { $inc: { quantity: -oldQuantity } }
        );
      } else if (oldType === 'sell') {
        await stockCollection.updateOne(
          { productId: stockProductId, email },
          { $inc: { quantity: oldQuantity } }
        );
      }
      // Apply new stock effect
      if (newType === 'purchase') {
        await stockCollection.updateOne(
          { productId: newProductId, email },
          { $inc: { quantity: newQuantity }, $setOnInsert: { productId: newProductId, email } },
          { upsert: true }
        );
      } else if (newType === 'sell') {
        // Check stock availability
        const stock = await stockCollection.findOne({ productId: newProductId, email });
        if (!stock || stock.quantity < newQuantity) {
          return res.status(400).json({ success: false, message: 'Insufficient stock for update.' });
        }
        await stockCollection.updateOne(
          { productId: newProductId, email },
          { $inc: { quantity: -newQuantity } }
        );
      }
    }

    // Update order
    const order = await orderCollection.findOneAndUpdate(
      { _id: id, email },
      updateData,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, message: 'Order updated successfully.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const email = req.userEmail;
    const { id } = req.params;
    const order = await orderCollection.findOne({ _id: id, email });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const stock = await stockCollection.findOne({ productId: order.productId, email });
    if (!stock) {
      return res.status(400).json({ success: false, message: 'Cannot revert stock: stock record not found.' });
    }
    let newQty;
    if (order.type === 'purchase') {
      newQty = stock.quantity - order.quantity;
      if (newQty < 0) {
        return res.status(400).json({ success: false, message: 'Cannot revert: stock would go negative.' });
      }
      await stockCollection.updateOne(
        { productId: order.productId, email },
        { $inc: { quantity: -order.quantity } }
      );
    } else if (order.type === 'sell') {
      newQty = stock.quantity + order.quantity;
      await stockCollection.updateOne(
        { productId: order.productId, email },
        { $inc: { quantity: order.quantity } }
      );
    }
    await orderCollection.deleteOne({ _id: id, email });
    res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };

