import React, { useState } from 'react';
import { Home, LogIn, User, X } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [updateDates, setUpdateDates] = useState({});
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const handleCheckAll = () => {
    const allDates = {};
    generateCalendarDays().forEach(day => {
      allDates[day] = true;
    });
    setSelectedDates(allDates);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 pt-4">
      {/* Header */}
      

      {/* Admin Dashboard Title */}
      <div className="text-center text-blue-600 text-xl font-bold mb-6 mt-0">
        Admin Dashboard
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Admin Info */}
          <div>
            <p className="mb-2">Name: Salma Akter</p>
            <p className="mb-4">ID: 123456</p>
          </div>

          {/* Current Manager */}
          <div>
            <h2 className="font-semibold mb-3">Current Manager</h2>
            <div className="space-y-3">
              {['Asfa Mehfuza', 'Jannatul Nayem'].map((manager, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6" />
                    <div>
                      <p className="font-medium">{manager}</p>
                      <p className="text-sm text-gray-600">ID: {idx === 0 ? '2004200' : '2004190'}</p>
                      <p className="text-sm text-gray-600">Room no: {idx === 0 ? '106' : '216'}</p>
                      <p className="text-sm text-gray-600">December, 2024</p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Manager */}
          <div>
            <h2 className="font-semibold mb-3">Add New Manager</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter ID"
                className="w-full p-2 rounded bg-green-100 border border-green-200"
              />
              <div className="flex gap-3">
                <select className="p-2 rounded bg-green-50 border border-green-100 flex-1">
                  <option>Month</option>
                </select>
                <select className="p-2 rounded bg-green-50 border border-green-100 flex-1">
                  <option>Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notice Creation */}
          <div>
            <h2 className="font-semibold mb-3">Notice Creation</h2>
            <textarea
              placeholder="Type your notice..."
              className="w-full p-3 rounded bg-green-50 border border-green-100 h-32 resize-none"
            />
            <button className="mt-2 bg-blue-200 px-4 py-1 rounded">Create</button>
          </div>

          {/* Generate Monthly Token */}
          <div>
            <h2 className="font-semibold mb-3">Generate Monthly Token</h2>
            <input
              type="text"
              placeholder="Enter ID"
              className="w-full p-2 rounded bg-green-50 border border-green-100 mb-3"
            />
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-center font-medium mb-4">December</h3>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map(day => (
                  <label key={day} className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedDates[day] || false}
                      onChange={() => {
                        setSelectedDates(prev => ({
                          ...prev,
                          [day]: !prev[day]
                        }));
                      }}
                      className="mr-1"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <button 
                onClick={handleCheckAll}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Mark All
              </button>
              <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                Generate
              </button>
            </div>
          </div>

          {/* Update Token */}
          <div>
            <h2 className="font-semibold mb-3">Update Token</h2>
            <input
              type="text"
              placeholder="Enter ID"
              className="w-full p-2 rounded bg-green-50 border border-green-100 mb-3"
            />
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-center font-medium mb-4">December</h3>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map(day => (
                  <label key={day} className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={updateDates[day] || false}
                      onChange={() => {
                        setUpdateDates(prev => ({
                          ...prev,
                          [day]: !prev[day]
                        }));
                      }}
                      className="mr-1"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;