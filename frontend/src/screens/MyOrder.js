import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyOrder = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching orders for:', userEmail);
      
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          order_data: [] 
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      
      const existingOrder = data.orderData || [];
      console.log('Processed order data:', existingOrder);

      setOrderData(existingOrder);

    } catch (error) {
      console.error("Error fetching order data:", error);
      setError(error.message || "Failed to fetch orders. Please try again later.");
      setOrderData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto mt-8 p-4 text-center">
          <div className="animate-pulse">Loading orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto mt-8 p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div><Navbar /></div>
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-semibold text-center mb-6">My Orders</h2>
        
        {orderData.length === 0 ? (
          <div className="text-center text-gray-500">No orders found</div>
        ) : (
          <div className="space-y-8">
            {orderData.map((orderGroup, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                
                {orderGroup.find(item => item.Order_date) && (
                  <div className="text-xl font-bold text-gray-800 mb-4">
                    {new Date(orderGroup.find(item => item.Order_date).Order_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orderGroup.filter(item => !item.Order_date).map((item, itemIndex) => (
                    <div key={itemIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-600">Quantity: {item.qty}</p>
                        <p className="text-gray-600">Size: {item.size}</p>
                        <p className="text-lg font-bold text-green-600">₹{item.price}/-</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div><Footer /></div>
    </div>
  );
}