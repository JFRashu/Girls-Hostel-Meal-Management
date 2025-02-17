const handleLogOut = (navigate) => {
    // Remove user details from local storage
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("userType");
  
    // Redirect to the login page
    navigate("/");
  };
  
  export default handleLogOut;
  