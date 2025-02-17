const Duerefund = require("../models/duerefund.model");
const Student = require("../models/student.model");
const Tokenprice = require("../models/tokenprice.model");
const { getOneStudent } = require("../controllers/student.controller");
const { v4: uuidv4 } = require("uuid");

const updateDueRefund = async (req, res) => {
    try {
        console.log(req.body);
        const { studentID, month, year, type, amount } = req.body;

        // Validate all required fields
        if (!studentID || !month || !year || !type || !amount) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate the type (must be "Due" or "Refund")
        if (type !== "Due" && type !== "Refund") {
            return res.status(400).json({ message: "Invalid due refund type. Must be 'Due' or 'Refund'." });
        }

        // Find the existing due/refund entry for the student, month, and year
        const existingDueRefund = await Duerefund.findOne({
            student_id: studentID,
            month,
            year
        });

        if (existingDueRefund) {
            // If an existing entry is found, update the due or refund amount
            if (type === "Due") {
                existingDueRefund.due_amount = amount; // Update due amount
            } else if (type === "Refund") {
                existingDueRefund.refund_amount = amount; // Update refund amount
            }

            // Save the updated document
            await existingDueRefund.save();
            console.log("Updated existing due/refund entry.");
        } else {
            // If no existing entry is found, create a new one

            // Check if the student exists
            const student = await getOneStudent(studentID);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            const newDueRefund = new Duerefund({
                student_id: studentID,
                month,
                year,
                [type === "Due" ? "due_amount" : "refund_amount"]: amount // Dynamically set due or refund amount
            });

            // Insert the new due/refund entry into the database
            await newDueRefund.save();
            console.log("Created new due/refund entry.");
        }

        // Return success response
        res.status(201).json({ message: "Due/Refund updated successfully!" });
    } catch (error) {
        console.error("Error updating due/refund:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateTokenPrice = async (req, res) => {
    try {
        console.log(req.body);
        const { month, year, amount } = req.body;

        // Validate all required fields
        if (!month || !year || !amount) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Step 1: Update or Create Token Price Entry
        const existingTokenPrice = await Tokenprice.findOne({ month, year });

        if (existingTokenPrice) {
            // Update the existing token price
            await Tokenprice.updateOne({ month, year }, { $set: { amount } });
            console.log(`Updated token price for ${month} ${year} to ${amount}.`);
        } else {
            // Create a new token price entry
            const newTokenPrice = new Tokenprice({
                month,
                year,
                amount
            });
            await newTokenPrice.save();
            console.log(`Created new token price entry for ${month} ${year} with amount ${amount}.`);
        }

        // Step 2: Delete existing Duerefund entities for the specified month and year
        await Duerefund.deleteMany({ month, year });
        console.log(`Deleted existing Duerefund entries for ${month} ${year}.`);

        // Step 3: Fetch all student IDs from the Student model
        const students = await Student.find({}, { _id: 0, student_id: 1 }); // Fetch only student_id
        const studentIDs = students.map(student => student.student_id);
        console.log(`Fetched ${studentIDs.length} student IDs.`);

        // Step 4: Calculate the total days in the month
        const totalDaysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();
        console.log(`Total days in ${month} ${year}: ${totalDaysInMonth}`);

        // Step 5: Calculate the due amount (total_days_in_month * price_per_token * 2)
        const dueAmount = totalDaysInMonth * amount;
        console.log(`Calculated due amount: ${dueAmount}`);

        // Step 6: Create new Duerefund entities for each student
        const dueRefundEntries = studentIDs.map(studentID => ({
            student_id: studentID,
            month,
            year,
            due_amount: dueAmount,
            refund_amount: 0
        }));

        // Insert all new Duerefund entries into the database
        await Duerefund.insertMany(dueRefundEntries);
        console.log(`Created ${dueRefundEntries.length} new Duerefund entries.`);

        // Return success response
        res.status(201).json({ message: "Token price updated and due/refund entries created successfully!" });
    } catch (error) {
        console.error("Error updating token price:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const getDueRefunds = async (req, res) => {
    try {
        const { studentID } = req.query; // Get month and year from query as well
        if (!studentID) {
            return res.status(400).json({ message: "studentID, month, and year are required." });
        }

        // Query for all records with the specific studentID
        const dueRefunds = await Duerefund.find({ student_id: studentID });

        if (!dueRefunds || dueRefunds.length === 0) {
            return res.json("No due refund records found for this student.");
        }

        // Calculate total due amount and total refund amount
        let totalDueAmount = 0;
        let totalRefundAmount = 0;

        // Iterate over all instances to sum the values
        dueRefunds.forEach(refund => {
            totalDueAmount += refund.due_amount || 0;  // Ensure it's added even if value is undefined or null
            totalRefundAmount += refund.refund_amount || 0;
        });

        // Return the totals
        res.status(200).json({
            total_due_amount: totalDueAmount,
            total_refund_amount: totalRefundAmount
        });

    } catch (error) {
        console.error("Error fetching due refund data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { updateDueRefund, updateTokenPrice, getDueRefunds};
