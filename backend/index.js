const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoute = require('./routes/userRoutes');
const quizRoutes = require('./routes/testRoutes');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Configuration
const port = process.env.PORT || 5000;
const dbConnect = process.env.DB_CONNECT;
const tokenSecret = process.env.TOKEN_SECRET;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use(async (req, res, next) => {
  try {
    const reqString = `${req.method} ${req.url} ${Date.now()}\n`;
    await fs.appendFile('log.txt', reqString);
    next();
  } catch (err) {
    console.error('Logging error:', err);
    next();
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello');
});

app.use('/v1/auth', authRoute);
app.use('/v1/quiz', quizRoutes);

// Error handling middleware
app.use(async (err, req, res, next) => {
  try {
    const errorString = `${req.method} ${req.url} ${Date.now()} ${err.message}\n`;
    await fs.appendFile('error.txt', errorString);
    res.status(500).send('Internal Server Error');
  } catch (writeError) {
    console.error('Error logging error:', writeError);
    res.status(500).send('Internal Server Error');
  }
});

// Start server and connect to database
app.listen(port, () => {
  console.log(`Running on ${port}!`);
  mongoose.connect(dbConnect)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
});
