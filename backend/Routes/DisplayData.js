const express = require("express");
const router = express.Router();

router.post('/foodData', (req, res) => {
    try {
        console.log('📦 /foodData endpoint called');
        console.log('global.food_items type:', typeof global.food_items);
        console.log('global.foodcategory type:', typeof global.foodcategory);
        
        // Ensure we always have arrays (initialized in db.js, but double-check)
        const foodItems = Array.isArray(global.food_items) ? global.food_items : [];
        const foodCategories = Array.isArray(global.foodcategory) ? global.foodcategory : [];

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