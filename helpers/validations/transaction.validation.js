const { check } = require("express-validator");

const transactionValidation = [
  check("page").optional().isInt({ min: 0 }).withMessage("NUMBER_MIN_0"),
  check("limit").optional().isInt({ min: 0 }).withMessage("NUMBER_MIN_0"),
];

module.exports = {
  transactionValidation,
};
