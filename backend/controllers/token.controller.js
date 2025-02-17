const Token = require("../models/token.model");
const Duerefund = require("../models/duerefund.model");
const Tokenprice = require("../models/tokenprice.model");
const { getOneStudent } = require("../controllers/student.controller");
const { v4: uuidv4 } = require("uuid");

const generateMonthlyToken = async (req, res) => {
    try {
        console.log(req.body);
        const { studentID, adminId, month, year, selectedDays } = req.body;

        if (!studentID || !adminId || !month || !year || !selectedDays || selectedDays.length === 0) {
            return res.status(400).json({ message: "All fields are required, including selectedDays." });
        }

        // Step 1: Fetch the token price for the given month & year
        const tokenPriceEntry = await Tokenprice.findOne({ month, year });
        if (!tokenPriceEntry) {
            return res.status(400).json({ message: "Token price is not set for this month. Please set it first." });
        }

        const tokenPrice = tokenPriceEntry.amount || 0; // Ensure tokenPrice is valid

        // Step 2: Fetch the existing due amount for the student
        const dueEntry = await Duerefund.findOne({ student_id: studentID, month, year });
        if (!dueEntry) {
            return res.status(400).json({ message: "Please set the token price for this student before generating tokens." });
        }

        const existingDueAmount = dueEntry.due_amount || 0; // Ensure due_amount is valid
        // console.log(dueEntry);

        // Step 3: Calculate total days in the selected month
        const totalDaysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();

        // Step 4: Calculate days without tokens
        const daysWithoutTokens = totalDaysInMonth - selectedDays.length;

        // Step 5: Calculate the maximum amount the student can avoid paying
        const maxAvoidableAmount = totalDaysInMonth * tokenPrice;

        // Step 6: Determine the new due amount
        const newDueAmount = daysWithoutTokens * tokenPrice * 2 > maxAvoidableAmount 
            ? daysWithoutTokens * tokenPrice * 2 - maxAvoidableAmount 
            : 0;

        console.log(`Student: ${studentID}, Existing Due: ${existingDueAmount}, Days Without Tokens: ${daysWithoutTokens}, Max Avoidable: ${maxAvoidableAmount}, New Due: ${newDueAmount}`);

        // Step 7: Update the due amount in Duerefund
        await Duerefund.updateOne({ student_id: studentID, month, year }, { $set: { due_amount: newDueAmount } });

        // Step 8: Fetch existing tokens and delete them
        const existingTokens = await Token.find({
            student_id: studentID,
            month,
            year,
            meal_type: { $in: ["Lunch", "Dinner"] },
        });

        if (existingTokens.length > 0) {
            const tokenIdsToDelete = existingTokens.map(token => token.token_id);
            await Token.deleteMany({ token_id: { $in: tokenIdsToDelete } });
            console.log(`Deleted ${existingTokens.length} existing tokens.`);
        }

        // Step 9: Generate new tokens for Lunch and Dinner
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

        // Fetch the token price for the given month & year
        const tokenPriceEntry = await Tokenprice.findOne({ month, year });
        if (!tokenPriceEntry) {
            return res.status(400).json({ message: "Token price is not set for this month. Please set it first." });
        }

        const tokenPrice = tokenPriceEntry.amount; // Ensure tokenPrice is valid

        // Fetch the existing refund amount for the student
        const refundEntry = await Duerefund.findOne({ student_id: studentID, month, year });
        if (!refundEntry) {
            return res.status(400).json({ message: "Refund details are not set for this student. Please update the due/refund records first." });
        }

        let existingRefundAmount = refundEntry.refund_amount || 0; // Ensure refund_amount is valid

        // Calculate total days in the selected month
        const totalDaysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();

        // Step 1: Process token deletions
        if (tokensToDelete && tokensToDelete.length > 0) {
            // Calculate refund increment
            const refundIncrement = tokensToDelete.length * tokenPrice / 2;

            // Ensure refund does not exceed max possible refund
            const maxRefund = totalDaysInMonth * tokenPrice;
            existingRefundAmount = Math.min(maxRefund, existingRefundAmount + refundIncrement);

            // Delete tokens
            const result = await Token.deleteMany({ token_id: { $in: tokensToDelete } });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "No tokens found to delete." });
            }
        }

        // Step 2: Process token additions
        if (daysToAdd && daysToAdd.length > 0) {
            // Calculate refund decrement
            const refundDecrement = daysToAdd.length * tokenPrice;

            // Ensure refund does not go negative
            existingRefundAmount = Math.max(0, existingRefundAmount - refundDecrement);

            // Insert new tokens
            const newTokens = daysToAdd.map((day) => ({
                token_id: uuidv4(),
                date: day,
                month,
                year,
                meal_type: mealType,
                student_id: studentID,
            }));

            await Token.insertMany(newTokens);
        }

        // Step 3: Update the refund amount in Duerefund
        await Duerefund.updateOne({ student_id: studentID, month, year }, { $set: { refund_amount: existingRefundAmount } });

        res.status(200).json({ message: "Tokens updated successfully!" });
    } catch (error) {
        console.error("Error updating tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getTotalTokens = async (req, res) => {
    try {
      const { dates, month, year } = req.query;
      if (!dates || !Array.isArray(dates)) {
        return res.status(400).json({ message: "Invalid date parameters" });
      }
  
      const tokenCounts = {};
      for (let date of dates) {
        const count = await Token.countDocuments({ date, month, year });
        tokenCounts[date] = count;
      }
  
      res.status(200).json(tokenCounts);
    } catch (error) {
      console.error("Error fetching token counts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = { generateMonthlyToken, fetchTokens, updateTokens, getTotalTokens };
