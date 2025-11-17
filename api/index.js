// Vercel serverless function wrapper for the backend API
// This file allows Vercel to run the Express app as a serverless function

const path = require('path');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.VERCEL = '1';

// Adjust paths for Vercel serverless environment
// In Vercel, the api folder is at the root, so we need to go up one level
const backendPath = path.resolve(__dirname, '../backend');

// Import the Express app from backend
const app = require(path.join(backendPath, 'index.js'));

// Export as Vercel serverless function
module.exports = app;

