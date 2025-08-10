const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routes/authRoute');
const categoryRouter = require('./routes/categoryRoute');
const productRouter = require('./routes/productRoute');
require('dotenv').config();

const connectMongoDB = require('./config/mongodb');
const mysqlPool = require('./config/mysql');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Welcome to Backend');
});
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);

// Connect to MongoDB and start server
connectMongoDB()
  .then(() => {
    // Test MySQL connection (optional, since pool already connects)
    mysqlPool.getConnection((err, connection) => {
      if (err) {
        console.error('MySQL connection error:', err);
        process.exit(1);
      } else {
        console.log('MySQL pool is ready');
        connection.release();

        app.listen(PORT, () => {
          console.log(`Server is listening at http://${HOST}:${PORT}`);
        });
      }
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
