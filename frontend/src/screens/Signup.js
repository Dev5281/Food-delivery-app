import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaUserPlus } from 'react-icons/fa';


export default function Signup() {
  const [credentials, setcredentials] = useState({ name: "", email: "", password: "", location: "" })
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.location })
      });
      const json = await response.json()
      console.log(json);

      if (!json.success) {
        alert("Enter valid credentials")
      } else {
        alert("Account created successfully! Please login.");
      }
    } catch (error) {
      alert("Error creating account. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onChange = (event) => {
    setcredentials({ ...credentials, [event.target.name]: event.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full mb-4">
            <FaUserPlus className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Join FoodHub</h1>
          <p className="text-gray-600">Create your account and start ordering</p>
        </div>

        {/* Signup Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-elevated p-8 space-y-5">
          
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              <FaUser className="inline mr-2 text-pink-500" />
              Full Name
            </label>
            <input 
              type="text" 
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="Enter your full name" 
              name="name" 
              value={credentials.name} 
              onChange={onChange} 
              required 
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              <FaEnvelope className="inline mr-2 text-pink-500" />
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="Enter your email" 
              name="email" 
              value={credentials.email} 
              onChange={onChange} 
              required 
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              <FaLock className="inline mr-2 text-pink-500" />
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="Create a strong password" 
              name="password" 
              value={credentials.password} 
              onChange={onChange} 
              required 
            />
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              <FaMapMarkerAlt className="inline mr-2 text-pink-500" />
              Delivery Location
            </label>
            <input 
              type="text" 
              id="location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="Enter your address" 
              name="location" 
              value={credentials.location} 
              onChange={onChange} 
              required 
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3 pt-2">
            <input 
              id="agree" 
              type="checkbox" 
              className="w-4 h-4 accent-pink-500 rounded cursor-pointer mt-1"
              required
            />
            <label htmlFor="agree" className="text-sm font-medium text-gray-600 cursor-pointer">
              I agree to the{' '}
              <span className="text-pink-600 font-semibold">Terms & Conditions</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FaUserPlus className="text-lg" />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center space-x-4 my-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">Already have an account?</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Sign In Link */}
          <Link 
            to="/login" 
            className="w-full py-3 px-4 border-2 border-pink-500 text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-300 text-center block"
          >
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}
