import React from 'react';
import { MdDelete } from 'react-icons/md';
import { UseCart, UseDispatchCart } from '../components/ContextReducer';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
export default function Cart() {
  let data = UseCart() || [];  // ✅ Ensure `data` is always an array
  let dispatch = UseDispatchCart();
  console.log("cart COMPONENT render, cart data:", data);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="m-5 w-full text-center text-2xl font-semibold">The Cart is Empty!</div>
    );
  }

  const handleCheckOut = async () => {
  try {
    // Check login
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Please login before checkout.");
      return;
    }

    // Load Razorpay
    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    // 1. Create Razorpay order
    const response = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: totalPrice
      })
    });

    const result = await response.json();

    console.log("Create order response:", result);

    if (!response.ok || !result.success) {
      alert("Unable to create payment order.");
      return;
    }

    const razorpayOrder = result.order;

    console.log("Razorpay Order ID:", razorpayOrder.id);

    // 2. Open Razorpay Checkout
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      name: "GoFood",

      description: "Food Order",

      order_id: razorpayOrder.id,

      prefill: {
        email: userEmail
      },

      theme: {
        color: "#3399cc"
      },

      // 3. Payment successful
      handler: async function (paymentResponse) {

        console.log("Payment response:", paymentResponse);

        // 4. Verify payment on backend
        const verifyResponse = await fetch(
          "/api/payment/verify-payment",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              razorpay_order_id:
                paymentResponse.razorpay_order_id,

              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,

              razorpay_signature:
                paymentResponse.razorpay_signature
            })
          }
        );

        const verificationResult =
          await verifyResponse.json();

        console.log(
          "Payment verification:",
          verificationResult
        );

        // Payment verification failed
        if (!verificationResult.success) {
          alert("Payment verification failed.");
          return;
        }

        // 5. Create Order document
        const orderResponse = await fetch(
          "/api/orderdata",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              email: userEmail,

              order_data: data,

              totalAmount: totalPrice,

              paymentStatus: "paid",

              razorpayOrderId:
                paymentResponse.razorpay_order_id,

              razorpayPaymentId:
                paymentResponse.razorpay_payment_id,

              razorpaySignature:
                paymentResponse.razorpay_signature,

              order_date: new Date().toISOString()
            })
          }
        );

        const savedOrder = await orderResponse.json();

        console.log("Saved order:", savedOrder);

        // 6. Clear cart ONLY after order is saved
        if (orderResponse.ok && savedOrder.success) {
          dispatch({ type: "DROP" });

          alert("Payment successful! Order placed.");
        } else {
          alert(
            "Payment succeeded but order could not be saved."
          );
        }
      }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (error) {
    console.error("Checkout error:", error);

    alert("Something went wrong during checkout.");
  }
};
  
  let totalPrice = data.reduce((total, food) => total + (Number(food.price) || 0), 0);

  return (
    <div className="container mx-auto mt-5 p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-green-500 text-white text-lg">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Option</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={food.id || index} className="text-center bg-white border-b">
                <td className="p-3 border text-black">{index + 1}</td>
                <td className="p-3 border text-black">{food.name}</td>
                <td className="p-3 border text-black">{food.qty}</td>
                <td className="p-3 border text-black">{food.size}</td>
                <td className="p-3 border text-black">₹{Number(food.price) || 0}</td>
                <td className="p-3 border text-black">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => dispatch({ type: "REMOVE", index: index })}
                  >
                    <MdDelete size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-2xl font-semibold mt-4">Total Price: ₹{totalPrice}/-</div>
        <div className="mt-5">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            onClick={handleCheckOut}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
