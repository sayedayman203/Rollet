const { validationResult } = require('express-validator');

const validationResultAfterFormation = validationResult.withDefaults({
	formatter: (error) => {
		return {
			value: error.value,
			msg: error.msg,
			param: error.param,
		};
	},
});

const catchValidationError = (req, res, next) => {
	const result = validationResultAfterFormation(req);
	if (!result.isEmpty()) {
		return res.status(400).json({
			status: 'failed',
			message: 'VALIDATION_ERROR',
			errors: result.array(),
		});
	}
	next();
};

const catchValidationErrorForUpdates = (req, res, next) => {
	const result = validationResultAfterFormation(req);
	if (!result.isEmpty()) {
		const errors = result.array();

		if (errors.some((err) => err.message === 'NO_UPDATE')) {
			return res.status(400).json({
				status: 'failed',
				message: 'NO_UPDATES',
			});
		}

		return res.status(400).json({
			status: 'failed',
			message: 'VALIDATION_ERROR',
			errors: errors,
		});
	}
	next();
};

module.exports = { catchValidationError, catchValidationErrorForUpdates };
