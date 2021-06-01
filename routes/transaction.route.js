const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");
const {
  transactionValidation,
} = require("../helpers/validations/transaction.validation");
const { catchValidationError } = require("../middlewares/validationError");

const { isAuth, isUser } = require("../middlewares/isAuth");

// Routes
router.get(
  "/",
  isAuth,
  isUser,
  transactionValidation,
  catchValidationError,
  transactionController.getTransactions
);

module.exports = router;
