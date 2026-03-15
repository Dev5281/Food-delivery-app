import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import Modal from '../Modal';
import Cart from '../screens/Cart';

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  const [auth, setAuth] = useState(localStorage.getItem("authToken"));
  let navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      console.log("AuthToken from Storage:", token); 
      setAuth(token);
    };

    checkAuth(); 

    window.addEventListener("storage", checkAuth); 

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("authToken");
    setAuth(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 via-orange-400 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🍕</span>
              </div>
              <span className="text-2xl font-bold text-white hidden sm:inline drop-shadow-md">FoodHub</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300">
                Home
              </Link>

              {auth && (
                <Link to="/myorder" className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300">
                  My Orders
                </Link>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {auth ? (
              <>
                {/* Cart Button */}
                <button
                  onClick={() => setCartView(true)}
                  className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-300 group"
                >
                  <FaShoppingCart className="text-2xl" />
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse-glow">
                    🛒
                  </span>
                </button>

                {cartView && <Modal onClose={() => setCartView(false)} ><Cart/></Modal>}

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="px-5 py-2 text-sm font-semibold text-orange-600 bg-white rounded-lg hover:bg-red-50 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
                {/* Signup Button */}
                <Link 
                  to="/createuser" 
                  className="px-5 py-2 text-sm font-semibold text-orange-600 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg hidden sm:inline-block"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
