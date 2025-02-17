const express = require('express')
const router = express.Router();

const { createNewNotice, getnotices } = require("../controllers/notice.controller");

router.get("/getnotices", getnotices);
router.post("/createNewNotice", createNewNotice);

module.exports = router;