const { check } = require("express-validator");

const editPointsValidation = [
  check("points")
    .notEmpty()
    .withMessage("REQUIRED")
    .bail()
    .isInt({ min: 0 })
    .withMessage("NUMBER_MIN_0"),
];

module.exports = {
  editPointsValidation,
};
