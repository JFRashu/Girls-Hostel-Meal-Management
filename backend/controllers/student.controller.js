const Student = require("../models/student.model");

const getAllStudents = async (req,res)=>{
    try {
        const students = await Student.find();
        console.log(students);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getOneStudent = async (studentId) => {
    try {
        return await Student.findOne({ student_id: studentId });
    } catch (error) {
        return null;
    }
};

const getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findOne({student_id: req.params.id});
        console.log(student);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).send(error.message); 
    }
}

module.exports = { getAllStudents, getOneStudent, getStudentDetails }