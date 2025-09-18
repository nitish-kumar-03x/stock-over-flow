const { sequelize } = require('../config/mysql');

const logAction = async (
  table,
  email,
  collection,
  action,
  description = '',
  comments = ''
) => {
  try {
    await sequelize.query(
      `INSERT INTO \`${table}\` (email, collection, action, description, comments, timestamp) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [email, collection, action, description, comments],
      }
    );
  } catch (err) {
    console.error(`Log error (${table}):`, err.message);
  }
};

const authLogAction = (email, collection, action, description, comments) =>
  logAction(
    'stock-over-flow-auth-logs',
    email,
    collection,
    action,
    description,
    comments
  );

const categoryLogAction = (email, collection, action, description, comments) =>
  logAction(
    'stock-over-flow-category-logs',
    email,
    collection,
    action,
    description,
    comments
  );

const productLogAction = (email, collection, action, description, comments) =>
  logAction(
    'stock-over-flow-product-logs',
    email,
    collection,
    action,
    description,
    comments
  );

module.exports = { authLogAction, categoryLogAction, productLogAction };
