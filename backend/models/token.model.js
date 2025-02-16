const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID v4

const tokenSchema = mongoose.Schema({
    token_id: {
        type: String,
        default: uuidv4, // Auto-generate token_id using UUID v4
        required: true
    },
    date: {
        type: Number,
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
    meal_type: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Token", tokenSchema);
