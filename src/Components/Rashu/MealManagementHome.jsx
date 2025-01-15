import React, { useState, useEffect } from "react";

const MealManagementHome = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(" ");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/demoJsons/notices.json');
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }
        const data = await response.json();
        setNotices(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load notices');
        setLoading(false);
      }
    };
  
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen  bg-stone-100 p-4">
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
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading notices...</div>
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors"
                  >
                    <h3 className="font-medium text-lg text-blue-700">
                      {notice.title}
                    </h3>
                    <p className="text-gray-700">{notice.details}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No notices available.
                </div>
              )}
            </div>
          </div>

          {/* Sign In Form */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-4">Sign In</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter Your ID"
                className="w-full p-2 rounded bg-green-100 border border-green-200"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="w-full p-2 rounded bg-green-100 border border-green-200"
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
    src="src/assets/tpr.jpg"
    alt="Taposhi Rabeya Hall"
    className="w-full h-48 object-cover rounded-lg mb-4"
  />
  <h3 className="text-center font-medium">Taposhi Rabeya Hall</h3>
  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
    <h4 className="font-medium">About Us:</h4>
    <p className="text-gray-700">
      Taposhi Rabeya Hall is a dedicated girls' hostel located in the heart of the Chittagong University of Engineering and Technology (CUET). The hostel offers a safe, comfortable, and supportive environment for female students pursuing their education at CUET. With a variety of modern facilities, including common rooms, study spaces, and recreational areas, the hostel aims to provide a balanced living experience for its residents.
    </p>
    <h4 className="font-medium mt-4">Our Website:</h4>
    <p className="text-gray-700">
      This website is designed to keep residents informed and engaged with all the latest updates, events, and announcements related to the hostel. Whether it's the latest notice board updates, facility requests, or community events, our platform ensures that every resident stays connected and up-to-date. The website also allows for easy access to resources, sign-in features, and other tools to enhance the overall hostel experience.
    </p>
  </div>
</div>
</div>
</div>
  );
};

export default MealManagementHome;
