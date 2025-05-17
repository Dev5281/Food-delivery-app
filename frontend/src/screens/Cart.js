import React from 'react';
import { MdDelete } from 'react-icons/md';
import { UseCart, UseDispatchCart } from '../components/ContextReducer';

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
    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email is missing! Please log in.");
      alert("User email is missing! Please log in.");
      return;
    }
    let response = await fetch("/api/orderdata", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString()
      })
    });

    console.log("JSON RESPONSE:::::", response.status);
    if (response.status === 200 && typeof dispatch === "function") {
      dispatch({ type: "DROP" });
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
