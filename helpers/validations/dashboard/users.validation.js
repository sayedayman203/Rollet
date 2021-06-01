const { check } = require("express-validator");

const usersValidation = [
  check("page").optional().isInt({ min: 0 }).withMessage("NUMBER_MIN_0"),
  check("limit").optional().isInt({ min: 0 }).withMessage("NUMBER_MIN_0"),
  check("userName").trim().optional(),
];

module.exports = {
  usersValidation,
};
