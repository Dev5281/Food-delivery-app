const mongoose = require('mongoose')

const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('order', OrderSchema)