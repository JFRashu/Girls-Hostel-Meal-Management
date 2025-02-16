const Token = require("../models/token.model");
const { getOneStudent } = require("../controllers/student.controller");
const { v4: uuidv4 } = require("uuid");

const generateMonthlyToken = async (req, res) => {
    try {
        console.log(req.body);
        const { studentID, adminId, month, year, selectedDays } = req.body;

        if (!studentID || !adminId || !month || !year || !selectedDays || selectedDays.length === 0) {
            return res.status(400).json({ message: "All fields are required, including selectedDays." });
        }

        // Fetch existing tokens
        const existingTokens = await Token.find({
            student_id: studentID,
            month,
            year,
            meal_type: { $in: ["Lunch", "Dinner"] }, // Both meal types
        });

        if (existingTokens.length > 0) {
            // Extract existing token IDs
            const tokenIdsToDelete = existingTokens.map(token => token.token_id);

            // Delete existing tokens
            await Token.deleteMany({ token_id: { $in: tokenIdsToDelete } });
            console.log(`Deleted ${existingTokens.length} existing tokens.`);
        }

        // Generate new tokens
        const tokensForLunch = selectedDays.map((day) => ({
            token_id: uuidv4(),
            date: day,
            month,
            year,
            meal_type: "Lunch",
            student_id: studentID,
        }));

        const tokensForDinner = selectedDays.map((day) => ({
            token_id: uuidv4(),
            date: day,
            month,
            year,
            meal_type: "Dinner",
            student_id: studentID,
        }));

        // Insert new tokens into the database
        await Token.insertMany([...tokensForLunch, ...tokensForDinner]);

        res.status(201).json({ message: "Tokens updated successfully!" });
    } catch (error) {
        console.error("Error updating tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Fetch Tokens
const fetchTokens = async (req, res) => {
    try {
        const { studentID, month, year, mealType } = req.query;
        console.log(studentID, month, year, mealType);
        if (!studentID || !month || !year || !mealType) {
            return res.status(400).json({ message: "studentID, month, year and mealType are required." });
        }

        // Find the student to ensure valid student ID
        const student = await getOneStudent(studentID);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const tokens = await Token.find({ student_id: studentID, month, year, meal_type: mealType });
        console.log(tokens);

        if (!tokens || tokens.length === 0) {
            return res.json([]); // Ensure an empty array is returned
        }

        res.status(200).json(tokens);
    } catch (error) {
        console.error("Error fetching tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const updateTokens = async (req, res) => {
    try {
        const { studentID, month, year, mealType, daysToAdd, tokensToDelete } = req.body;

        // Ensure necessary fields are provided
        if (!studentID || !mealType || !month || !year || (!daysToAdd && !tokensToDelete)) {
            return res.status(400).json({ message: "All fields are required, including daysToAdd or tokensToDelete." });
        }

        // Ensure the provided mealType is valid
        if (!["Lunch", "Dinner"].includes(mealType)) {
            return res.status(400).json({ message: "Invalid meal type. It should be either 'Lunch' or 'Dinner'." });
        }

        // Find the student to ensure valid student ID
        const student = await getOneStudent(studentID);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Handling adding new tokens for the specified mealType
        if (daysToAdd && daysToAdd.length > 0) {
            const newTokens = daysToAdd.map((day) => ({
                token_id: uuidv4(),
                date: day,
                month,
                year,
                meal_type: mealType, // Ensure only the specified meal type is added
                student_id: studentID,
            }));

            await Token.insertMany(newTokens);
        }

        // Handling deleting tokens
        if (tokensToDelete && tokensToDelete.length > 0) {
            const result = await Token.deleteMany({ token_id: { $in: tokensToDelete } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "No tokens found to delete." });
            }
        }

        res.status(200).json({ message: "Tokens updated successfully!" });
    } catch (error) {
        console.error("Error updating tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { generateMonthlyToken, fetchTokens, updateTokens };
