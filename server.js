const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRouter = require('./routes/authRoute');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.get('/', (req, res) => {
  res.send('Welcome to Backend');
});
app.use('/api/auth', authRouter);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('DB is connected');
    app.listen(PORT, () => {
      console.log(`Server is listening at http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
