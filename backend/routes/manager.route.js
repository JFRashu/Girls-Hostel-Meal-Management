const express = require('express')
const router = express.Router();

const { getAllManagers, getAllDetailsOfManagers, addNewManager, removeManager, checkManager } = require("../controllers/manager.controller");

router.get("/allManagerInfo", getAllManagers);
router.get("/getAllDetailsOfManagers", getAllDetailsOfManagers);
router.post("/addNewManager", addNewManager);
router.delete("/remove/:id", removeManager);
router.get("/checkManager/:id", checkManager);

module.exports = router;