const { getOneAdmin } = require("./admin.controller");
const { getOneStudent } = require("./student.controller");

const login = async (req, res) => {
  const { userID, password, userType } = req.body;

  try {
    if (userType === "admin") {
      const admin = await getOneAdmin(userID);
      if (admin && admin.password === password) {
        return res.status(200).json({
          message: "Login successful",
          id: `${admin.admin_id}`,
          name: `${admin.name}`,
          redirectTo: "AdminDashboard",
        });
      }
    } else if (userType === "student") {
      const student = await getOneStudent(userID);
      if (student && student.password === password) {
        return res.status(200).json({
          message: "Login successful",
          id: `${student.student_id}`,
          name: `${student.name}`,
          redirectTo: "StudentDashboard",
        });
      }
    }

    return res.status(401).json({ message: "Invalid ID, password, or user type" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { login };
