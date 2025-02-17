const express = require('express');
const cors = require("cors");
require("./config/db");

const studentRouter = require("./routes/student.route");
const adminRouter = require("./routes/admin.route");
const authRouter = require("./routes/auth.route");
const managerRouter = require("./routes/manager.route");
const tokenRouter = require("./routes/token.route");
const budgetRouter = require("./routes/budget.route");
const noticeRouter = require("./routes/notice.route");
const duerefundRouter = require("./routes/duerefund.route");

const app = express();

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/api/students", studentRouter);
app.use("/api/admins", adminRouter);
app.use("/api/login", authRouter);
app.use("/api/managers", managerRouter);
app.use("/api/tokens", tokenRouter);
app.use("/api/budgets", budgetRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/dueRefunds", duerefundRouter);

app.get("/", (req,res) => {
    res.send("server is running");
})

//route not found
app.use( (req,res, next) => {
    res.status(404).json({
        message: 'route not found'
    });
})

//server error
app.use( (err, req,res, next) => {
    res.status(500).json({
        message: 'something broke'
    });
})

module.exports = app;