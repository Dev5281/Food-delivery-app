const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");

router.post("/orderData", async (req, res) => {
  try {
    let data = req.body.order_data;
    const email = req.body.email;
    
    
    if (!data || data.length === 0) {
      const existingOrder = await Order.findOne({ email: email });
      return res.json({ 
        success: true, 
        orderData: existingOrder ? existingOrder.order_data : [] 
      });
    }

    
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid order data format" });
    }

    
    data.splice(0, 0, { Order_date: req.body.order_date });

    console.log("Received order for email:", email);

    // Check if the email exists in the database
    let existingOrder = await Order.findOne({ email: email });

    if (!existingOrder) {
      // If no existing order, create a new one
      await Order.create({
        email: email,
        order_data: [data],
      });

      return res.status(201).json({ success: true, message: "Order created successfully" });
    } else {
      // If email exists, update the existing order
      await Order.findOneAndUpdate(
        { email: email },
        { $push: { order_data: data } }
      );

      return res.status(200).json({ success: true, message: "Order updated successfully" });
    }
  } catch (error) {
    console.error("Order processing error:", error.message);
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
  
});

module.exports = router;