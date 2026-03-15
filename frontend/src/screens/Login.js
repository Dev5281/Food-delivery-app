import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
 
export default function Login() {
  const [credentials, setcredentials] = useState({email: "", password: "" })
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/loginuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({  email: credentials.email, password: credentials.password })
      });
      const json = await response.json()
      console.log(json);
  
      if (!json.success) {
        alert("Enter valid credentials")
      }
      if(json.success){
        localStorage.setItem("userEmail",credentials.email);
        localStorage.setItem("authToken",json.authToken);
        navigate("/");
      }
    } catch (error) {
      alert("Error logging in. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const onChange = (event) => {
    setcredentials({ ...credentials, [event.target.name]: event.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full mb-4">
            <FaSignInAlt className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your FoodHub account</p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-elevated p-8 space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              <FaEnvelope className="inline mr-2 text-orange-500" />
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 bg-gray-50 hover:bg-white"
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
              <FaLock className="inline mr-2 text-orange-500" />
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 bg-gray-50 hover:bg-white"
              placeholder="Enter your password" 
              name="password" 
              value={credentials.password} 
              onChange={onChange} 
              required 
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-3">
            <input 
              id="remember" 
              type="checkbox" 
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
              defaultChecked
            />
            <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FaSignInAlt className="text-lg" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center space-x-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">New to FoodHub?</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Sign Up Link */}
          <Link 
            to="/createuser" 
            className="w-full py-3 px-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-300 text-center block"
          >
            Create Account
          </Link>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By signing in, you agree to our{' '}
          <span className="text-orange-600 font-semibold cursor-pointer hover:text-pink-600">
            Terms & Conditions
          </span>
        </p>
      </div>
    </div>
  )
}
