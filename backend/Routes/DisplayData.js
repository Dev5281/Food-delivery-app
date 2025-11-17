const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

// Helper function to fetch data from MongoDB
const fetchFoodData = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState !== 1) {
            const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:Devbullet500@cluster0.v48a9.mongodb.net/gofoodmern?retryWrites=true&w=majority';
            await mongoose.connect(mongoURI);
            console.log('📦 MongoDB connected in DisplayData route');
        }

        const db = mongoose.connection.db;
        const foodItems = await db.collection('food_items').find({}).toArray();
        const foodCategories = await db.collection('foodcategory').find({}).toArray();

        return { foodItems, foodCategories };
    } catch (error) {
        console.error('❌ Error fetching from MongoDB:', error);
        throw error;
    }
};

router.post('/foodData', async (req, res) => {
    try {
        console.log('📦 /foodData endpoint called');
        
        // Check if global variables have data
        let foodItems = Array.isArray(global.food_items) ? global.food_items : [];
        let foodCategories = Array.isArray(global.foodcategory) ? global.foodcategory : [];

        // If globals are empty, fetch directly from MongoDB (for serverless functions)
        if (foodItems.length === 0 || foodCategories.length === 0) {
            console.log('⚠️ Global variables empty, fetching directly from MongoDB...');
            const data = await fetchFoodData();
            foodItems = data.foodItems || [];
            foodCategories = data.foodCategories || [];
            
            // Update globals for future requests
            global.food_items = foodItems;
            global.foodcategory = foodCategories;
        }

        console.log(`✅ Sending ${foodItems.length} food items and ${foodCategories.length} categories`);

        // Always return JSON, even if arrays are empty
        res.json([foodItems, foodCategories]); 
    } catch (error) {
        console.error("❌ Error in /foodData:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            message: "Server Error: " + (error.message || 'Unknown error'),
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});


module.exports = router;