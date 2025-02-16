const Manager = require("../models/manager.model");
const { getOneStudent } = require("../controllers/student.controller");
const { findOne } = require("../models/student.model");

const getAllManagers = async (req,res)=>{
    try {
        const managers = await Manager.find();
        console.log(managers);
        res.status(200).json(managers);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getAllDetailsOfManagers = async (req, res) => {
    try {
        const managers = await Manager.find();
        console.log("Managers fetched:", managers);

        // Process each manager to attach student details
        const detailedManagers = await Promise.all(
            managers.map(async (manager) => {
                // Ensure conversion to a plain object
                let managerObj = manager.toObject();

                // Fetch student details
                const student = await getOneStudent(manager.student_id);

                // Add student data if found
                if (student) {
                    managerObj.name = student.name;
                    managerObj.room_number = student.room_number;
                } else {
                    managerObj.name = "Unknown";
                    managerObj.room_number = "Not Assigned";
                }

                return managerObj;
            })
        );

        res.status(200).json(detailedManagers);
    } catch (error) {
        console.error("Error fetching manager details:", error);
        res.status(500).send(error.message);
    }
};

const addNewManager = async (req, res) => {
    try {
        console.log(req.body);
        const { selectedStudentID, adminId, selectedMonth, selectedYear } = req.body; // Extract data from request body

        // Validate input
        if (!selectedStudentID || !adminId || !selectedMonth || !selectedYear) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if this id is already a manager
        const manager = await Manager.findOne({student_id: selectedStudentID});
        if(manager){
            return res.status(501).json({message: "This student is already a manager."})
        }

        // Check if the student exists
        const student = await getOneStudent(selectedStudentID);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Create new Manager object
        const newManager = new Manager({
            student_id: selectedStudentID,
            admin_id: adminId,
            month: selectedMonth,
            year: selectedYear
        });        

        // Save to the database
        await newManager.save();

        res.status(201).json({ message: "New manager added successfully!", manager: newManager });
    } catch (error) {
        console.error("Error adding new manager:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const removeManager = async (req, res) => {
    try {
        const { id } = req.params; // Get manager ID from URL params

        if (!id) {
            return res.status(400).json({ message: "Manager ID is required" });
        }

        const deletedManager = await Manager.findOneAndDelete({student_id: id});

        if (!deletedManager) {
            return res.status(404).json({ message: "Manager not found" });
        }

        res.status(200).json({ message: "Manager removed successfully", manager: deletedManager });
    } catch (error) {
        console.error("Error removing manager:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkManager = async (req, res) => {
    try {
        const student_id = req.params.id;
        if (!student_id) {
            return res.status(400).json({ message: "Manager ID is required" });
        }

        const manager = await Manager.findOne({student_id});
        console.log(manager);
        res.status(200).json(manager);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = { getAllManagers, getAllDetailsOfManagers, addNewManager, removeManager, checkManager };
