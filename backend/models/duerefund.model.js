const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID v4

const duerefundSchema = mongoose.Schema({
    duerefund_id: {
        type: String,
        default: uuidv4, // Auto-generate budget_id using UUID v4
        required: true
    },
    student_id: {
        type: String,
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
    due_amount: {
        type: Number,
        default: 0
    },
    refund_amount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("deurefund", duerefundSchema);