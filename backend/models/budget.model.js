const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID v4

const budgetSchema = mongoose.Schema({
    budget_id: {
        type: String,
        default: uuidv4, // Auto-generate budget_id using UUID v4
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("budget", budgetSchema);