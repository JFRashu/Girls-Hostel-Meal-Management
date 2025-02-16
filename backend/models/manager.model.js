const mongoose = require("mongoose");

const managerSchema = mongoose.Schema({
    student_id: {
        type: String,
        required: true
    },
    admin_id: {
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
    }
});

module.exports = mongoose.model("Manager", managerSchema);