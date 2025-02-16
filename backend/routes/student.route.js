const express = require('express')
const router = express.Router();

const { getAllStudents, getOneStudent, getStudentDetails } = require("../controllers/student.controller");

router.get("/allStudentInfo", getAllStudents);
router.get("/getStudentDetails/:id", getStudentDetails);

module.exports = router;