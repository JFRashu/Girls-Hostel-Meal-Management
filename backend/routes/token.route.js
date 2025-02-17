const express = require('express')
const router = express.Router();

const { generateMonthlyToken, fetchTokens, updateTokens, getTotalTokens } = require("../controllers/token.controller");

router.post("/generateMonthlyToken", generateMonthlyToken);
router.get("/getOnesTokens", fetchTokens);
router.post("/updateTokens", updateTokens);
router.get("/getTotalTokens", getTotalTokens);

module.exports = router;