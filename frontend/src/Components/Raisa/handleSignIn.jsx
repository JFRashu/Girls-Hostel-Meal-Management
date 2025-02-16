import axios from "axios";

const handleSignIn = async (e, userID, password, userType, navigate) => {
  e.preventDefault(); // Prevents page refresh

  if (!userType) {
    alert("Please select a user type.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4000/api/login", {
      userID,
      password,
      userType, // Now sending userType to the backend
    });

    console.log("Response:", response.data);
    alert("Login successful!");

    // Redirect based on response
    if (response.data.redirectTo) {
      navigate(response.data.redirectTo);
    }

    // Store user details
    localStorage.setItem("currentUserId", response.data.id);
    localStorage.setItem("currentUserName", response.data.name);
    localStorage.setItem("userType", userType);
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    alert("Login failed. Please check your credentials.");
  }
};

export default handleSignIn;
