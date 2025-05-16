const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://Admin:Devbullet500@cluster0.v48a9.mongodb.net/gofoodmern?retryWrites=true&w=majority';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

  
    const fetched_data = await mongoose.connection.db.collection('food_items').find({}).toArray();

  
    const fetched_category = await mongoose.connection.db.collection('foodcategory').find({}).toArray();

    if (fetched_data.length === 0) {
      console.log('No data found in food_items collection');
    } else {
      global.food_items = fetched_data;
    }

    if (fetched_category.length === 0) {
      console.log('No data found in foodCategory collection');
    } else {
      global.foodcategory = fetched_category;
    }

    console.log('Fetched food_items:', global.food_items);
    console.log('Fetched foodcategory:', global.foodcategory);
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = mongoDB;
