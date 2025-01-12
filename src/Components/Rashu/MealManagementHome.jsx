import React, { useState } from 'react';


const MealManagementHome = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      {/* Header */}
      

      {/* Main Content */}
      <div className="text-center text-blue-600 text-xl font-bold mb-6">
        Home Page
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Notice Board */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-3">Notice Board</h2>
            <div className="space-y-2">
              <div className="h-6 bg-gray-100 rounded"></div>
              <div className="h-6 bg-gray-100 rounded"></div>
              <div className="h-6 bg-gray-100 rounded"></div>
            </div>
          </div>

          {/* Sign In Form */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-4">Sign In</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter Your ID"
                className="w-full p-2 rounded bg-green-50 border border-green-100"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="w-full p-2 rounded bg-green-50 border border-green-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 text-gray-500"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <button className="bg-blue-200 px-6 py-1 rounded text-blue-800 hover:bg-blue-300 transition-colors">
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Building Image and Info */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src="/api/placeholder/400/300"
            alt="Taposhi Rabeya Hall"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-center font-medium">Taposhi Rabeya Hall</h3>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium">About Us :</h4>
            <p className="text-gray-700">A girls hostel in CUET.....</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealManagementHome;