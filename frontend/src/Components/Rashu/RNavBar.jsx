import React from 'react';
import { Home, LogOut, User, Salad, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import handleLogOut from '../Raisa/handleLogOut';

export const RNavBar = () => {
  const navigate = useNavigate();

  // Refactored navigation logic inside the component
  const navigateToUserDashboard = () => {
    const userID = localStorage.getItem("currentUserId");
    const userType = localStorage.getItem("userType");

    if (!userID || !userType) {
        alert("You are not logged in.");
        return;
    }

    console.log("User Type:", userType);

    // Directly navigate based on the stored userType
    if (userType === "admin") {
        console.log("Navigating to admin dashboard...");
        navigate("/AdminDashboard");
    } else if (userType === "student") {
        console.log("Navigating to student dashboard...");
        navigate("/StudentDashboard");
    } else {
        console.error("Unknown user type");
        alert("Unknown user type.");
    }
  };

  return (
    <div className="bg-blue-200 p-3 rounded-lg flex justify-between items-center mb-0">
      <Home className="w-6 h-6 cursor-pointer" onClick={() => navigate('/')} />
      <div className="flex items-center gap-2">
        <Utensils className="w-4 h-5" />
        <div className="font-semibold">Meal Management</div>
        <Salad className="w-4 h-5" />
      </div>
      <div className="flex gap-2">
        <LogOut className="w-6 h-6 cursor-pointer" onClick={() => handleLogOut(navigate)} />
        <User
          className="w-6 h-6 cursor-pointer"
          onClick={navigateToUserDashboard} // ✅ Now it's correct
        />
      </div>
    </div>
  );
};

export default RNavBar;
