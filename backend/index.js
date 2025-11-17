require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), debug: true });


const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require('./db');

mongoDB();

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://food-delivery-app-yv9d.onrender.com',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
    ].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }
    
    // In production, check allowed origins or allow Vercel domains
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
        return callback(null, true);
      }
    }
    
    callback(null, true); // Allow all for now - you can restrict this later
  },
  credentials: true,
}));
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

// Only listen if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
