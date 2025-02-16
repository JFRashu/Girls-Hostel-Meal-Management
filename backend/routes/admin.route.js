const express = require('express')
const router = express.Router();

const { getAllAdmins, getOneAdmin } = require("../controllers/admin.controller");

router.get("/allAdminInfo", getAllAdmins);

module.exports = router;