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
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        
       
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://cdn.pixabay.com/photo/2016/10/10/14/46/icon-1728552_1280.jpg" 
              className="h-8" 
              alt="Go Food Logo" 
            />
            <span className="text-2xl font-semibold dark:text-white">Go Food</span>
          </Link>

          <Link to="/" className="text-lg font-medium text-gray-700 hover:text-blue-700 dark:text-white">
            Home
          </Link>

          {auth && (
            <Link to="/myorder" className="text-lg font-medium text-gray-700 hover:text-blue-700 dark:text-white">
              My Orders
            </Link>
          )}
        </div>

        
        <div className="ml-auto flex items-center space-x-6">
          {auth ? (
            <>
              <button
                onClick={() => setCartView(true)}
                className="relative text-lg text-blue-700 hover:text-blue-900 dark:text-white"
              >
                <FaShoppingCart className="text-2xl" />
              </button>

              {cartView && <Modal onClose={() => setCartView(false)} ><Cart/></Modal>}

              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                Login
              </Link>
              <Link 
                to="/createuser" 
                className="px-4 py-2 text-blue-700 border border-blue-700 rounded-lg hover:bg-blue-700 hover:text-white"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
