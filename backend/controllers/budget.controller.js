const Budget = require("../models/budget.model");
const { getOneStudent } = require("../controllers/student.controller");
const { v4: uuidv4 } = require("uuid");

const createNewBudget = async (req, res) => {
    try {
        console.log(req.body);
        const { month, year, amount } = req.body;

        if (!month || !year || !amount) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Fetch existing tokens
        const existingBudget = await Budget.find({
            month,
            year
        });

        if (existingBudget.length > 0) {
            // Extract existing token IDs
            const budgetIdsToDelete = existingBudget.map(budget => budget.budget_id);

            // Delete existing tokens
            await Budget.deleteMany({ budget_id: { $in: budgetIdsToDelete } });
            console.log(`Deleted ${budgetIdsToDelete.length} existing budgets.`);
        }

        // Generate new budget
        const newBudget = new Budget({
            month,
            year,
            amount
        }); 

        // Insert new budget into the database
        await newBudget.save();

        res.status(201).json({ message: "Budget created successfully!" });
    } catch (error) {
        console.error("Error creating budgets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Fetch budget
const getBudget = async (req, res) => {
    try {
        const { currentMonth, currentYear } = req.query;
        console.log(currentMonth, currentYear);
        if (!currentMonth || !currentYear) {
            return res.status(400).json({ message: "month, year are required." });
        }

        const budget = await Budget.findOne({ month: currentMonth, year: currentYear });
        console.log(budget);

        if (!budget) {
            return res.json("Budget is not set yet."); // Ensure an empty array is returned
        }

        res.status(200).json(budget);
    } catch (error) {
        console.error("Error fetching tokens:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createNewBudget, getBudget};
