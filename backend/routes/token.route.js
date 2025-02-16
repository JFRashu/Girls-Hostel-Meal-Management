const express = require('express')
const router = express.Router();

const { generateMonthlyToken, fetchTokens, updateTokens } = require("../controllers/token.controller");

router.post("/generateMonthlyToken", generateMonthlyToken);
router.get("/getOnesTokens", fetchTokens);
router.post("/updateTokens", updateTokens);

module.exports = router;