const Admin = require("../models/admin.model");

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Fix: Make getOneAdmin return data instead of handling response
const getOneAdmin = async (adminID) => {
    try {
        console.log("getOneAdmin called with ID:", adminID);
        return await Admin.findOne({ admin_id: adminID });
    } catch (error) {
        console.error("Error fetching admin:", error);
        return null; // Instead of throwing, return null for better error handling
    }
};

module.exports = { getAllAdmins, getOneAdmin };
