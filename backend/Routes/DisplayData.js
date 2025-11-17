const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

// Helper function to ensure MongoDB connection
const ensureConnection = async () => {
    try {
        // Check connection state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:Devbullet500@cluster0.v48a9.mongodb.net/gofoodmern?retryWrites=true&w=majority';
            
            // Set connection options to avoid conflicts
            const options = {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };
            
            await mongoose.connect(mongoURI, options);
            console.log('📦 MongoDB connected in DisplayData route');
        } else if (mongoose.connection.readyState === 2) {
            // If connecting, wait for connection
            await new Promise((resolve, reject) => {
                mongoose.connection.once('connected', resolve);
                mongoose.connection.once('error', reject);
                setTimeout(() => reject(new Error('Connection timeout')), 10000);
            });
        }
        
        // Wait a bit to ensure connection is fully ready
        if (!mongoose.connection.db) {
            throw new Error('MongoDB connection not ready');
        }
        
        return mongoose.connection.db;
    } catch (error) {
        console.error('❌ Error ensuring MongoDB connection:', error);
        throw error;
    }
};

// Helper function to fetch data from MongoDB
const fetchFoodData = async () => {
    try {
        const db = await ensureConnection();
        
        const foodItems = await db.collection('food_items').find({}).toArray();
        const foodCategories = await db.collection('foodcategory').find({}).toArray();

        console.log(`📊 Fetched ${foodItems.length} food items and ${foodCategories.length} categories from MongoDB`);
        
        return { foodItems, foodCategories };
    } catch (error) {
        console.error('❌ Error fetching from MongoDB:', error);
        throw error;
    }
};

router.post('/foodData', async (req, res) => {
    try {
        console.log('📦 /foodData endpoint called');
        console.log('MongoDB connection state:', mongoose.connection.readyState);
        
        // Check if global variables have data
        let foodItems = Array.isArray(global.food_items) ? global.food_items : [];
        let foodCategories = Array.isArray(global.foodcategory) ? global.foodcategory : [];

        // If globals are empty, fetch directly from MongoDB (for serverless functions)
        if (foodItems.length === 0 || foodCategories.length === 0) {
            console.log('⚠️ Global variables empty, fetching directly from MongoDB...');
            try {
                const data = await fetchFoodData();
                foodItems = data.foodItems || [];
                foodCategories = data.foodCategories || [];
                
                // Update globals for future requests
                global.food_items = foodItems;
                global.foodcategory = foodCategories;
                
                console.log(`✅ Successfully fetched ${foodItems.length} items and ${foodCategories.length} categories`);
            } catch (fetchError) {
                console.error('❌ Failed to fetch from MongoDB:', fetchError);
                // Return empty arrays instead of crashing
                foodItems = [];
                foodCategories = [];
            }
        }

        console.log(`✅ Sending ${foodItems.length} food items and ${foodCategories.length} categories`);

        // Always return JSON, even if arrays are empty
        res.json([foodItems, foodCategories]); 
    } catch (error) {
        console.error("❌ Error in /foodData:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Return empty arrays on error instead of crashing (frontend expects [items, categories])
        console.error("Returning empty arrays due to error");
        res.status(200).json([[], []]);
    }
});


module.exports = router;