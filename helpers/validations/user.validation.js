const { check } = require("express-validator");

const registerValidation = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("REQUIRED")
    .bail()
    .isLength({ min: 3, max: 15 })
    .withMessage("NUMBER_MIN_3_MAX_15"),
  check("lastName")
    .trim()
    .notEmpty()
    .withMessage("REQUIRED")
    .bail()
    .isLength({ min: 3, max: 15 })
    .withMessage("NUMBER_MIN_3_MAX_15"),
  check("userName")
    .trim()
    .notEmpty()
    .withMessage("REQUIRED")
    .bail()
    .isLength({ min: 5, max: 20 })
    .withMessage("NUMBER_MIN_5_MAX_20"),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("REQUIRED")
    .bail()
    .isLength({ min: 8, max: 20 })
    .withMessage("NUMBER_MIN_8"),
];

const loginValidation = [
  check("userName").trim().notEmpty().withMessage("REQUIRED"),
  check("password").trim().notEmpty().withMessage("REQUIRED"),
];

module.exports = {
  registerValidation,
  loginValidation,
};
