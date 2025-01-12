import React, { useState } from 'react';
import { Home, LogIn, User } from 'lucide-react';

const StudentDashboard = ({ isManager = true }) => {
  const [noticeText, setNoticeText] = useState('');
  
  // Sample data for demonstration
  const sampleTokenDates = {
    1: true,
    3: true,
    5: true,
    8: true,
    10: true,
    15: true,
    20: true
  };

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const handleCreateNotice = () => {
    // Handle notice creation
    console.log('Creating notice:', noticeText);
    setNoticeText('');
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4">
      

      {/* Dashboard Title */}
      <div className="text-center text-blue-600 text-xl font-bold mb-6">
        {isManager ? 'Manager Dashboard' : 'Student Dashboard'}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Student Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Information */}
            <div className="space-y-2">
              <div className="mb-4">
                <p className="mb-1">Name: Mahira Afroz</p>
                <p className="mb-1">ID: 12345678</p>
                <p className="mb-1">Room no: 220</p>
                <p className="mb-1">Due Amount: 1200 TK</p>
                <p>Refund Amount: 800 TK</p>
              </div>
            </div>

            {/* Token Status Calendar */}
            <div>
              <h2 className="font-semibold mb-3">Token Status</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-center font-medium mb-4">January 2025 </h3>
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map(day => (
                    <div 
                      key={day}
                      className={`flex items-center justify-center p-2 rounded-sm ${
                        sampleTokenDates[day] 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <span className="text-sm">{day}</span>
                      {sampleTokenDates[day] && (
                        <span className="ml-1 text-xs">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Section - Only visible if isManager is true */}
        {isManager && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Manager Stats */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg text-blue-600">Manager Statistics</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">Assigned Month: December, 2024</p>
                  <p className="text-gray-700">Token Count For 19th December: 98</p>
                  <p className="text-gray-700">Budget For this Month: 360000 Tk</p>
                </div>
              </div>

              {/* Notice Creation */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg text-blue-600">Notice Creation</h2>
                <textarea
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="Type your notice..."
                  className="w-full p-3 rounded bg-green-50 border border-green-100 h-32 resize-none"
                />
                <button
                  onClick={handleCreateNotice}
                  className="bg-blue-200 px-4 py-2 rounded hover:bg-blue-300 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;