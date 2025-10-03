const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");

router.post("/orderData", async (req, res) => {
  try {
    let data = req.body.order_data;
    const email = req.body.email;

  
    if (!data || data.length === 0) {
      const existingOrder = await Order.findOne({ email: email });
      console.log(`📦 Fetching orders for ${email}`);
      return res.json({ 
        success: true, 
        orderData: existingOrder ? existingOrder.order_data : [] 
      });
    }

    
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid order data format" });
    }

    
    data.splice(0, 0, { Order_date: req.body.order_date });

    console.log("📦 Received order for email:", email);

    
    let existingOrder = await Order.findOne({ email: email });

    if (!existingOrder) {

      await Order.create({
        email: email,
        order_data: [data],
      });

      console.log("✅ New order created");
      return res.status(201).json({ success: true, message: "Order created successfully" });
    } else {
    
      await Order.findOneAndUpdate(
        { email: email },
        { $push: { order_data: data } }
      );

      console.log("✅ Order updated");
      return res.status(200).json({ success: true, message: "Order updated successfully" });
    }
  } catch (error) {
    console.error(" Order processing error:", error.message);
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
});


router.get("/myOrderData", async (req, res) => {
  try {
    const email = req.query.email;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const orders = await Order.findOne({ email: email });
    
    res.json({ 
      success: true, 
      orderData: orders ? orders.order_data : [] 
    });
    
  } catch (error) {
    console.error(" Error fetching orders:", error.message);
    res.status(500).json({ error: "Server Error", message: error.message });
  }
});

module.exports = router;