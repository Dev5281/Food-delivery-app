const express = require("express");
const router = express.Router();

router.post('/foodData', (req, res) => {
    try {
        console.log("food_items:", global.food_items);
        console.log("foodcategory:", global.foodcategory);

        if (!global.food_items || !global.foodcategory) {
            return res.status(500).json({ message: "Data not loaded yet" });
        }

        res.json([global.food_items, global.foodcategory]); 
    } catch (error) {
        console.error("Error in /foodData:", error.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;