const Notice = require("../models/notice.model");
const Admin = require("../models/admin.model");
const Manager = require("../models/manager.model");
const { v4: uuidv4 } = require("uuid");

const createNewNotice = async (req, res) => {
    try {
        console.log(req.body);
        const { title, content, role, id} = req.body;

        if (!title || !content || !role || !id ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if(role === "admin"){
            // Check if the student exists
            const admin = await Admin.findOne({admin_id: id});
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            // Create new Notice
            const newNotice = new Notice({
                title,
                content,
                admin_id: id
            });

            // Insert new notice into the database
            await newNotice.save();
        }
        else if(role === "manager"){
            // Check if the student exists
            const manager = await Manager.findOne({student_id: id});
            if (!manager) {
                return res.status(404).json({ message: "Manager not found" });
            }

            // Create new Notice
            const newNotice = new Notice({
                title,
                content,
                student_id: id
            }); 

            // Insert new notice into the database
            await newNotice.save();
        }
        
        res.status(201).json({ message: "Notice created successfully!" });
    } catch (error) {
        console.error("Error creating notice:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Fetch notices
const getnotices = async (req, res) => {
    try {
        const notices = await Notice.find();
        console.log(notices);

        if (!notices || notices.length === 0) {
            return res.json([]); // Ensure an empty array is returned
        }

        res.status(200).json(notices);
    } catch (error) {
        console.error("Error fetching notices:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createNewNotice, getnotices};
