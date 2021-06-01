const { check, oneOf } = require("express-validator");

const newPrizeValidation = [
	check("prizeType")
		.trim()
		.notEmpty()
		.withMessage("REQUIRED")
		.isIn(["points"])
		.withMessage("INVALID"),
	check("reward")
		.notEmpty()
		.withMessage("REQUIRED")
		.bail()
		.isInt({ min: 0 })
		.withMessage("NUMBER_MIN_0"),
	check("percent")
		.notEmpty()
		.withMessage("REQUIRED")
		.bail()
		.isInt({ min: 0, max: 100 })
		.withMessage("NUMBER_MIN_0_MAX_100"),
];

const editPrizeValidation = [
	oneOf(
		[
			check("prizeType")
				.trim()
				.notEmpty()
				.withMessage("REQUIRED")
				.bail()
				.isIn(["points"])
				.withMessage("INVALID"),
			check("percent")
				.notEmpty()
				.withMessage("REQUIRED")
				.bail()
				.isInt({ min: 0, max: 100 })
				.withMessage("NUMBER_MIN_0_MAX_100"),
		],
		"NO_UPDATE"
	),
	check("reward").custom((value, { req }) => {
		if (req.body.prizeType && !value) {
			throw new Error("REQUIRED");
		}

		return true;
	}),
];

module.exports = {
	newPrizeValidation,
	editPrizeValidation,
};
