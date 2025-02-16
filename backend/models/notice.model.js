const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID v4

const noticeSchema = mongoose.Schema({
    notice_id: {
        type: String,
        default: uuidv4, // Auto-generate budget_id using UUID v4
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creation_time: {
        type: Date,
        default: Date.now
    },
    admin_id: {
        type: String,
    },
    student_id: {
        type: String
    }
});

module.exports = mongoose.model("Notice", noticeSchema);