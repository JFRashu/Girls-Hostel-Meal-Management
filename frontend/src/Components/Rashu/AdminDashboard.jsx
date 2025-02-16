import React, { useState, useEffect, useMemo } from 'react';
import { Home, LogIn, User, X } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [selectedDates, setSelectedDates] = useState({});
  const [updateDates, setUpdateDates] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStudentID, setselectedStudentID] = useState('');
  const [selectedStudentIDtoGMT, setselectedStudentIDtoGMT] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [studentIDtoUT, setstudentIDtoUT] = useState('');
  const [updateMonth, setUpdateMonth] = useState('');
  const [updateYear, setUpdateYear] = useState('');
  const [updateMealType, setUpdateMealType] = useState('');
  const [tokens, setTokens] = useState([]); // Store fetched tokens
  const [tokensToAdd, setTokensToAdd] = useState([]); // Track the days to add
  const [tokensToDelete, setTokensToDelete] = useState([]); // Track tokens to delete
  const [generateMonth, setGenerateMonth] = useState('');
  const [generateYear, setGenerateYear] = useState('');
  // const [totalStudents, setTotalStudents] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  // const [totalTokens, setTotalTokens] = useState('');
  const [budgetMonth, setBudgetMonth] = useState('');
  const [budgetYear, setBudgetYear] = useState('');
  const [isAllMarked, setIsAllMarked] = useState(false);

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uloading, setuLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminId = localStorage.getItem("currentUserId");
  const adminName = localStorage.getItem("currentUserName");

  useEffect(() => {

    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/managers/getAllDetailsOfManagers');
        setManagers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching managers:', error);
        setError('Failed to load managers');
        setLoading(false);
      }
    };    

    fetchManagers();
  }, []);
  const handleCreateNotice = async () => {
    // Handle notice creation logic here
    console.log('Notice Title:', noticeTitle);
    console.log('Notice Content:', noticeContent);

    if (!noticeTitle || !noticeContent) {
      alert("All fields are required.");
      window.location.reload();
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/api/notices/createNewNotice", {
        title: noticeTitle,
        content: noticeContent,
        role: "admin",
        id: adminId
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

  const handleRemoveManager = async (managerId) => {
    try {
      await axios.delete(`http://localhost:4000/api/managers/remove/${managerId}`);
      setManagers(managers.filter(manager => manager.student_id !== managerId));
    } catch (error) {
      console.error("Error removing manager:", error);
    }
  };
  

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const mealTypes = [
    'Lunch','Dinner'
  ];

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

  const generateCalendarDays = (month, year) => {
    const days = [];
    const daysInMonth = getDaysInMonth(month, year);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleToggleAll = () => {
    const days = generateCalendarDays(generateMonth, generateYear);
    if (isAllMarked) {
      // If all are marked, unmark all
      setSelectedDates({});
    } else {
      // If not all are marked, mark all
      const allDates = {};
      days.forEach(day => {
        allDates[day] = true;
      });
      setSelectedDates(allDates);
    }
    setIsAllMarked(!isAllMarked);
  };

  // Handle checkbox change
  const toggleDaySelection = (day) => {
    setUpdateDates((prev) => {
      const newState = { ...prev, [day]: !prev[day] };

      if (!newState[day]) {
        // If unselected, remove from add list and add to delete list
        const tokenToRemove = tokens.find(token => token.date === day);
        if (tokenToRemove) {
          setTokensToDelete((prevDeleteList) => [...prevDeleteList, tokenToRemove.token_id]);
          setTokensToAdd((prevAddList) => prevAddList.filter(date => date !== day)); // Remove from add list
        }
      } else {
        // If selected, add to add list and remove from delete list
        setTokensToAdd((prevAddList) => [...prevAddList, day]);
        setTokensToDelete((prevDeleteList) => prevDeleteList.filter(id => id !== tokens.find(token => token.date === day)?.token_id)); // Remove from delete list
      }

      return newState;
    });
  };


  const handleAddManager = async () => {
    // Add manager logic here
    console.log('Adding manager for', selectedMonth, selectedYear);

    if (!selectedStudentID || !selectedMonth || !selectedYear) {
      alert("All fields are required.");
      window.location.reload();
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/api/managers/addNewManager", {
        selectedStudentID,
        adminId,
        selectedMonth,
        selectedYear,
      });
  
      console.log("Response:", response.data);
      alert("Adding new manager successful!");
      
      window.location.reload();

    } catch (error) {
      console.error("adding new manager failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || error.message);
      window.location.reload();
    }
  };

  const handleCreateBudget = async () => {
    // Create budget logic here
    console.log('Creating budget for', budgetMonth, budgetYear, 'Total budget:', totalBudget);

    if (!budgetMonth || !budgetYear || !totalBudget) {
      alert("All fields are required.");
      window.location.reload();
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/api/budgets/createNewBudget", {
        month: budgetMonth,
        year: budgetYear,
        amount: totalBudget,
      });
  
      console.log("Response:", response.data);
      alert("Adding new budget successful!");
      
      window.location.reload();

    } catch (error) {
      console.error("adding new budget failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || error.message);
      window.location.reload();
    }
  };

  const handleGenerateMonthlyToken = async () => {
    console.log('Generating Monthly Token for', selectedStudentIDtoGMT, generateMonth, generateYear);

    if (!selectedStudentIDtoGMT || !generateMonth || !generateYear) {
        alert("All fields are required.");
        return;
    }

    // Extract selected days (only those marked as true)
    const selectedDays = Object.keys(selectedDates)
        .filter(day => selectedDates[day]) // Keep only selected days
        .map(Number); // Convert string keys to numbers

    if (selectedDays.length === 0) {
        alert("Please select at least one day.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:4000/api/tokens/generateMonthlyToken", {
            studentID: selectedStudentIDtoGMT,
            adminId,
            month: generateMonth,
            year: generateYear,
            selectedDays, // Send the selected days as an array
        });

        console.log("Response:", response.data);
        alert("Generating Monthly Tokens successful!");
        window.location.reload();

    } catch (error) {
        console.error("Generating Monthly Tokens failed:", error.response?.data || error.message);
        alert(error.response?.data?.message || error.message);
        window.location.reload();
    }
  };

  // Function to fetch tokens from the backend
  const fetchTokens = async () => {
    console.log(studentIDtoUT, updateMonth, updateYear);
    if (!studentIDtoUT || !updateMonth || !updateYear) return;

    setuLoading(true);

    try {
      const response = await axios.get(`http://localhost:4000/api/tokens/getOnesTokens`, {
        params: { studentID: studentIDtoUT, month: updateMonth, year: updateYear, mealType: updateMealType },
      });

      const fetchedTokens = response.data;
      console.log("fetched tokens: ", fetchTokens);


      // if(fetchTokens.length === 0){
      //   alert("Token was not generated for this month.");
      //   // window.location.reload();
      // }

      setTokens(fetchedTokens);

      console.log("Fetched Tokens:", response.data); // Log the response to debug
        
        if (!Array.isArray(fetchedTokens)) {
            throw new Error("Invalid response format: Expected an array");
        }

      // Populate updateDates from fetched tokens
      const updatedCalendar = {};
      fetchedTokens.forEach(token => {
        updatedCalendar[token.date] = true;
      });
      setUpdateDates(updatedCalendar);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setuLoading(false);
    }
  };

  const handleUpdate = async () => {
    // Check if there are tokens to add or delete
    if (tokensToAdd.length === 0 && tokensToDelete.length === 0) {
      alert("No changes to update. Load the tokens first.");
      return;
    }
  
    try {
      // Add tokens
      if (tokensToAdd.length > 0 || tokensToDelete.length > 0) {
        await axios.post('http://localhost:4000/api/tokens/updateTokens', {
          studentID: studentIDtoUT,
          month: updateMonth,
          year: updateYear,
          mealType: updateMealType,
          daysToAdd: tokensToAdd,
          tokensToDelete: tokensToDelete
        });
        console.log("Updated Tokens:");
      }
  
      // Clear the added and deleted tokens after updating
      setTokensToAdd([]);
      setTokensToDelete([]);

      alert("Updating Tokens successful!");
      window.location.reload();

    } catch (error) {
      console.error("Error updating tokens:", error);
    }
  };
  

  const renderCurrentManagers = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-semibold mb-3">Current Manager</h2>
      <div className=" space-y-3">
        {loading ? (
          <div className="text-center text-gray-500">Loading managers...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : managers.length > 0 ? (
          managers.map((manager) => (
            <div key={manager.student_id} className="bg-blue-100 p-3 rounded-lg shadow flex justify-between items-center">
              <div className="flex  items-center gap-3">
                <User className="w-6 h-6" />
                <div>
                  <p className="font-medium">{manager.name}</p>
                  <p className="text-sm text-gray-600">ID: {manager.student_id}</p>
                  <p className="text-sm text-gray-600">Room no: {manager.room_number}</p>
                  <p className="text-sm text-gray-600">{manager.month}, {manager.year}</p>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveManager(manager.student_id)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No managers available.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 p-4 pt-4">
      {/* Header */}
      <div className="text-center text-blue-600 text-xl font-bold mb-6 mt-0">
        Admin Dashboard
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6 ">
          {/* Admin Info */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="mb-2">Name: {adminName}</p>
            <p className="mb-4">ID: {adminId}</p>
          </div>
          {/* Add the renderCurrentManagers here */}
          {renderCurrentManagers()}

          {/* Add New Manager */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-3">Add New Manager</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter ID"
                className="w-full p-2 rounded bg-green-100 border border-green-200"
                value={selectedStudentID}
                onChange={(e) => setselectedStudentID(e.target.value)}
              />
              <div className="flex gap-3">
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
              </div>
              <button
                onClick={handleAddManager}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
              >
                Add Manager
              </button>
            </div>
          </div>
         

          {/* Create Monthly Budget */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-3">Create Monthly Budget</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <select
                  className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                  value={budgetMonth}
                  onChange={(e) => setBudgetMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                  value={budgetYear}
                  onChange={(e) => setBudgetYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
              <input
                type="number"
                placeholder="Total Budget"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full p-2 rounded bg-green-100 border border-green-200"
              />
              </div>
              <button
                onClick={handleCreateBudget}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 "
              >
                Create Budget
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notice Creation */}
          
        <div className="bg-white p-4 rounded-lg shadow-md">
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
          <button className="mt-2  text-white bg-blue-500 px-4 py-1 rounded  hover:bg-blue-600" onClick={handleCreateNotice}>Create</button>
      
      
          </div>

          {/* Generate Monthly Token */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-3">Generate Monthly Token</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter ID"
                className="w-full p-2 rounded bg-green-100 border border-green-200"
                value={selectedStudentIDtoGMT}
                onChange={(e) => setselectedStudentIDtoGMT(e.target.value)}
              />
              <div className="flex gap-3 mb-3">
                <select
                  className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                  value={generateMonth}
                  onChange={(e) => setGenerateMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  className="p-2 rounded bg-green-50 border border-green-100 flex-1"
                  value={generateYear}
                  onChange={(e) => setGenerateYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {generateMonth && generateYear && (
                <div className="bg-lime-50 p-4 rounded-lg shadow">
                  <h3 className="text-center font-medium mb-4">{generateMonth} {generateYear}</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays(generateMonth, generateYear).map(day => (
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
              )}
              <div className="flex justify-between mt-3">
                <button
                  onClick={handleToggleAll}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  {isAllMarked ? 'Unmark All' : 'Mark All'}
                </button>
                <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                onClick={handleGenerateMonthlyToken}>
                  Generate
                </button>
              </div>
            </div>
          </div>


          {/* Update Token */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-3">Update Token</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter ID"
                className="w-full p-2 rounded bg-green-100 border border-green-200"
                value={studentIDtoUT}
                onChange={(e) => {
                  setstudentIDtoUT(e.target.value);
                  setuLoading(true);
                }}
              />
              <div className="flex gap-3 mb-3">
                <select className="p-2 rounded bg-green-50 border border-green-100 flex-1" value={updateMonth} onChange={(e) => {
                  setUpdateMonth(e.target.value);
                  setuLoading(true);
                }}>
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select className="p-2 rounded bg-green-50 border border-green-100 flex-1" value={updateYear} onChange={(e) => {
                  setUpdateYear(e.target.value);
                  setuLoading(true);
                }}>
                  <option value="">Select Year</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select className="p-2 rounded bg-green-50 border border-green-100 flex-1" value={updateMealType} onChange={(e) => {
                  setUpdateMealType(e.target.value);
                  setuLoading(true);
                }}>
                  <option value="">Select Meal Type</option>
                  {mealTypes.map(mealType => (
                    <option key={mealType} value={mealType}>{mealType}</option>
                  ))}
                </select>
              </div>
              <button onClick={fetchTokens} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                Load Tokens
              </button>

              {!uloading && updateMonth && updateYear && updateMealType && (
                <div className="bg-lime-50 p-4 rounded-lg shadow">
                  <h3 className="text-center font-medium mb-4">{updateMonth} {updateYear}</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays(updateMonth, updateYear).map(day => (
                      <label key={day} className="flex items-center justify-center">
                        <input type="checkbox" checked={updateDates[day] || false} onChange={() => toggleDaySelection(day)} className="mr-1" />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-3">
                <button onClick={handleUpdate} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                  Update
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;