import React, { useState, useEffect } from 'react';


const StudentDashboard = ({ isManager = true }) => {
  const [noticeText, setNoticeText] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [tokenData, setTokenData] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const mealTypes = ['Lunch', 'Dinner'];

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate loading the JSON data
    const fetchTokenData = async () => {
      try {
        const response = await fetch('/demoJsons/meal-tokens.json');
        const data = await response.json();
        setTokenData(data.tokens);
      } catch (error) {
        console.error('Error loading token data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -1; i < 4; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, months.indexOf(month) + 1, 0).getDate();
  };

  const getTokenStatus = (day, month, year, mealType) => {
    const dateStr = `${year}-${String(months.indexOf(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayToken = tokenData.find(token =>
      token.date === dateStr &&
      token.mealType === mealType
    );

    if (!dayToken) return 'no-data';
    return dayToken.status ? 'taken' : 'not-taken';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken':
        return 'bg-green-100 text-green-800';
      case 'not-taken':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-50 text-gray-400';
    }
  };

  const handleCreateNotice = () => {
    // Handle notice creation
    console.log('Creating notice:', noticeText);
    setNoticeText('');
  };

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

    for (let i = 1; i <= daysInMonth; i++) {
      const status = getTokenStatus(i, selectedMonth || 'January', selectedYear || '2025', selectedMealType || 'Lunch');
      days.push({ day: i, status });
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4 gap-3">
      <div className="text-center text-blue-600 text-xl font-bold mb-6">
        Student Dashboard
      </div>

      <div className="space-y-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="mb-4">
                <p className="mb-1">Name: Mahira Afroz</p>
                <p className="mb-1">ID: 12345678</p>
                <p className="mb-1">Room no: 220</p>
                <p className="mb-1">Due Amount: 1200 TK</p>
                <p>Refund Amount: 800 TK</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3">Token Status</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex gap-3 mb-4">
                  <select
                    className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value)}
                  >
                    <option value="">Select Meal Type</option>
                    {mealTypes.map(mealType => (
                      <option key={mealType} value={mealType}>{mealType}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <h3 className="text-center font-medium mb-4">
                    {selectedMonth && selectedYear ? `${selectedMonth} ${selectedYear}` : 'Select Month and Year'}
                  </h3>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {generateCalendarDays().map(({ day, status }) => (
                      <div
                        key={day}
                        className={`flex items-center justify-center p-2 rounded-sm ${getStatusColor(status)}`}
                      >
                        <span className="text-sm">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Legend:</h3>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-green-100 mr-2"></div>
                        <span>Meal Taken</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-red-100 mr-2"></div>
                        <span>Meal Not Taken</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded bg-gray-50 mr-2"></div>
                        <span>No Meal Served</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Manager Section - Only visible if isManager is true */}
        {isManager && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
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

                <div className="bg-transparent p-4  ">
                  <h2 className="font-semibold mb-3">Notice Creation</h2>

                  {/* Title Input */}
                  <input
                    type="text"
                    placeholder="Notice Title"
                    className="input input-bordered w-full mb-4 p-2 rounded bg-green-100 border border-green-200"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                  />

                  {/* Content Textarea */}
                  <textarea
                    placeholder="Type your notice content..."
                    className="textarea textarea-bordered w-full h-32 mb-4 p-2 rounded bg-green-100 border border-green-200"
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                  />

                  {/* Create Button */}
                  <button className="mt-2  text-white bg-blue-500 px-4 py-1 rounded  hover:bg-blue-600">Create</button>


                </div>

              </div>
            </div>
         
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;