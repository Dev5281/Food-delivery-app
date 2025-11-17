const mongoose = require('mongoose');
// Use environment variable if available, otherwise use default
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Admin:Devbullet500@cluster0.v48a9.mongodb.net/gofoodmern?retryWrites=true&w=majority';

// Initialize global variables to prevent undefined errors
global.food_items = [];
global.foodcategory = [];

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

  
    const fetched_data = await mongoose.connection.db.collection('food_items').find({}).toArray();

  
    const fetched_category = await mongoose.connection.db.collection('foodcategory').find({}).toArray();

    if (fetched_data.length === 0) {
       console.log('⚠️ WARNING: No data found in food_items collection');
       global.food_items = [];
    } else {
      global.food_items = fetched_data;
      console.log(`✅ Loaded ${global.food_items.length} food items`);
    }

    if (fetched_category.length === 0) {
      console.log('⚠️ WARNING: No data found in foodCategory collection');
      global.foodcategory = [];
    } else {
      global.foodcategory = fetched_category;
      console.log(`✅ Loaded ${global.foodcategory.length} food categories`);
    }

    console.log('Fetched food_items:', global.food_items.length, 'items');
    console.log('Fetched foodcategory:', global.foodcategory.length, 'categories');
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Keep empty arrays so the server doesn't crash
    global.food_items = [];
    global.foodcategory = [];
  }
};

module.exports = mongoDB;
