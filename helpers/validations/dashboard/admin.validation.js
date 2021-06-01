const { check, oneOf } = require('express-validator');

const loginValidation = [
	check('userName').trim().notEmpty().withMessage('REQUIRED'),
	check('password').trim().notEmpty().withMessage('REQUIRED'),
];

const updateUserValidation = [
	oneOf(
		[
			check('firstName').trim().notEmpty().withMessage('REQUIRED'),
			check('lastName').trim().notEmpty().withMessage('REQUIRED'),
		],
		'NO_UPDATE',
	),
];

const updateStatusValidation = [
	check('status')
		.trim()
		.notEmpty()
		.withMessage('REQUIRED')
		.bail()
		.isIn(['active', 'deactive', 'deleted'])
		.withMessage('INVALID_VALUE'),
];

module.exports = {
	loginValidation,
	updateUserValidation,
	updateStatusValidation,
};
