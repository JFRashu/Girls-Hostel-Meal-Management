const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    admin_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Admin", adminSchema);