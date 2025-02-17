const express = require('express')
const router = express.Router();

const { createNewBudget, getBudget } = require("../controllers/budget.controller");

router.get("/getBudget", getBudget);
router.post("/createNewBudget", createNewBudget);

module.exports = router;