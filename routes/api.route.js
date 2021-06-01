const express = require("express");
const router = express.Router();

const userRouter = require("./user.route");
const wheelRouter = require("./wheel.route");
const transactionRouter = require("./transaction.route");
const dashboardRouter = require("./dashboard/dashboard.route");

router.use("/user", userRouter);
router.use("/transaction", transactionRouter);
router.use("/wheel", wheelRouter);
router.use("/dashboard", dashboardRouter);
module.exports = router;
