const mysqlPool = require('../config/mysql');

const authLogAction = (
  email,
  collection,
  action,
  description = null,
  comments = null
) => {
  mysqlPool.query(
    'INSERT INTO `stock-over-flow-auth-logs` (email, collection, action, description, comments) VALUES (?, ?, ?, ?, ?)',
    [email, collection, action, description, comments],
    (err) => {
      if (err) {
        console.error('Failed to log action:', err);
      }
    }
  );
};

const categoryLogAction = (
  email,
  collection,
  action,
  description = null,
  comments = null
) => {
  mysqlPool.query(
    'INSERT INTO `stock-over-flow-category-logs` (email, collection, action, description, comments) VALUES (?, ?, ?, ?, ?)',
    [email, collection, action, description, comments],
    (err) => {
      if (err) {
        console.error('Failed to log action:', err);
      }
    }
  );
};

module.exports = { authLogAction, categoryLogAction };
