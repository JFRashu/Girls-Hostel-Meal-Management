const express = require('express')
const router = express.Router();

const { updateDueRefund, updateTokenPrice, getDueRefunds } = require("../controllers/duerefund.controller");

// router.get("/getBudget", getBudget);
router.post("/updateDueRefund", updateDueRefund);
router.post("/updateTokenPrice", updateTokenPrice);
router.get("/getDueRefunds", getDueRefunds);

module.exports = router;