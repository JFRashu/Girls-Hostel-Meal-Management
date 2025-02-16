import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {

  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  const [studentData, setStudentData] = useState('');
  const [noticeText, setNoticeText] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMealType, setSelectedMealType] = useState(`Lunch`);
  const [tokenData, setTokenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);

  const studentId = localStorage.getItem("currentUserId");

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const mealTypes = ['Lunch', 'Dinner'];

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/students/getStudentDetails/${studentId}`);
        setStudentData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students details:', error);
        setError('Failed to load student details');
        setLoading(false);
      }
    };

    const fetchManagerData = async () => {
      if (!studentId) return; // Prevent unnecessary requests
    
      try {
        const response = await axios.get(`http://localhost:4000/api/managers/checkManager/${studentId}`);
    
        console.log("Manager Response:", response.data);
    
        if (response.data) {
          setIsManager(true);
          console.log(response.data);
          setManagerData(response.data); // Store manager details
        } else {
          setIsManager(false);
        }
      } catch (error) {
        console.error("Error checking manager status:", error);
        setIsManager(false);
      }
    };

    const handleGetBudget = async () => {
      const today = new Date();
      const currentMonth = today.toLocaleString('default', { month: 'long' });
      const currentYear = today.getFullYear();
    
      try {
        const response = await axios.get('http://localhost:4000/api/budgets/getBudget', {
          params: { currentMonth, currentYear }
        });
    
        console.log(response.data);
        setBudgetData(response.data); // Ensure it's always an object
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    };
    
    handleGetBudget();
    fetchStudentData();
    fetchManagerData();
  }, []);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!selectedMonth || !selectedYear || !selectedMealType) return;
    
      try {
        const response = await axios.get('http://localhost:4000/api/tokens/getOnesTokens', {
          params: {
            studentID: studentId,
            month: selectedMonth,
            year: selectedYear,
            mealType: selectedMealType
          }
        });
    
        const tokenDays = Array.isArray(response.data) ? response.data.map(token => token.date) : []; // Ensure it's always an array of days
        console.log("Fetched Token Days:", tokenDays);
        
        setTokenData(tokenDays);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setTokenData([]); // Reset token data on failure
      }
    };    
  
    fetchTokenData();
  }, [selectedMonth, selectedYear, selectedMealType]); 

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

  const getTokenStatus = (day) => {
  
    // If the month & year match the current date
    if (selectedMonth === currentMonth && selectedYear == currentYear) {
      if (tokenData.includes(day)) {
        return day < currentDate ? "taken" : "not-served"; // Past days are taken, future are not served
      } else {
        return "not-taken"; // If the student returned the token
      }
    }
  
    // If it's a **past month**, assume all token days are "taken", others "not-taken"
    if (new Date(selectedYear, months.indexOf(selectedMonth)) < new Date(currentYear, today.getMonth())) {
      return tokenData.includes(day) ? "taken" : "not-taken";
    }
  
    // If it's a **future month**, all token days are "not served"
    return tokenData.includes(day) ? "not-served" : "not-taken";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken':
        return 'bg-green-100 text-green-800'; // Meal Taken
      case 'not-served':
        return 'bg-gray-100 text-gray-800'; // Meal Not Served
      case 'not-taken':
        return 'bg-red-100 text-red-800'; // Meal Not Taken
      default:
        return 'bg-gray-50 text-gray-400'; // Default case
    }
  };

  const handleCreateNotice = async () => {
    if (!noticeTitle || !noticeContent) {
      alert("All fields are required.");
      window.location.reload();
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/api/notices/createNewNotice", {
        title: noticeTitle,
        content: noticeContent,
        role: "manager",
        id: studentId
      });
  
      console.log("Response:", response.data);
      alert("Adding new Notice successful!");
      
      window.location.reload();

    } catch (error) {
      console.error("adding new notice failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || error.message);
      window.location.reload();
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

    for (let i = 1; i <= daysInMonth; i++) {
      const status = getTokenStatus(i);
      days.push({ day: i, status });
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 gap-3">
      <div className="text-center text-blue-600 text-xl font-bold mb-6">
        Student Dashboard
      </div>

      <div className="space-y-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="mb-4">
                <p className="mb-1">Name: {studentData.name}</p>
                <p className="mb-1">ID: {studentData.student_id}</p>
                <p className="mb-1">Room no: {studentData.room_number}</p>
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
                        <div className="w-4 h-4 rounded bg-gray-100 mr-2"></div>
                        <span>Meal Not Served</span>
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
        {isManager && managerData && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Manager Stats */}
              <div className="space-y-3">
                <h2 className="font-semibold text-lg text-blue-600">Manager Statistics</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">Assigned Month: {managerData.month}, {managerData.year}</p>
                  <p className="text-gray-700">Token Count For 19th December: 98</p>
                  <p className="text-gray-700"> Budget For this Month: {budgetData ? budgetData.amount : "N/A"} Tk </p>
                </div>
              </div>

              {/* Notice Creation */}
              <div className="bg-transparent p-4">
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
                <button onClick={handleCreateNotice} className="mt-2 text-white bg-blue-500 px-4 py-1 rounded hover:bg-blue-600">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;