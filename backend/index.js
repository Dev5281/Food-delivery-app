require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), debug: true });


const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require('./db');

mongoDB();

// CORS configuration - more permissive in development
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: 'https://food-delivery-app-yv9d.onrender.com',
    credentials: true,
  }));
} else {
  // In development, allow all origins
  app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
  }));
}
app.use(express.json());

// Load routes with error handling
try {
  console.log('Loading routes...');
  app.use('/api', require("./Routes/CreateUser"));
  console.log('✅ CreateUser route loaded');
  app.use('/api', require("./Routes/DisplayData"));
  console.log('✅ DisplayData route loaded');
  app.use('/api', require("./Routes/OrderData"));
  console.log('✅ OrderData route loaded');
} catch (error) {
  console.error('❌ Error loading routes:', error);
  throw error; // Re-throw to prevent server from starting with broken routes
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Global error handler - ensures all errors return JSON
// Must have 4 parameters to be recognized as error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message || err);
  console.error('Stack:', err.stack);
  
  // Don't send error if response already sent
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
