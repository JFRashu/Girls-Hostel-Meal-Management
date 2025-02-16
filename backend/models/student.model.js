const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    student_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    room_number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Student", studentSchema);