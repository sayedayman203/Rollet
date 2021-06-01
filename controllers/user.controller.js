const createError = require("http-errors");

const { errorHandler } = require("../helpers/errorHandler");
const {
	createUser,
	login,
	updateUser,
	changePassword,
} = require("../services/user.service");

exports.register = async (req, res, next) => {
	const { firstName, lastName, userName, password } = req.body;

	try {
		const { user, token } = await createUser(
			firstName,
			lastName,
			userName,
			password
		);
		res.status(201).json({
			status: "success",
			user: {
				userName: user.userName,
				firstName: user.firstName,
				lastName: user.lastName,
				points: user.points,
			},
			token,
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.login = async (req, res, next) => {
	const { userName, password, rememberMe } = req.body;

	try {
		const { user, token } = await login(
			userName,
			password,
			"user",
			rememberMe
		);
		res.json({
			status: "success",
			user: {
				userName: user.userName,
				firstName: user.firstName,
				lastName: user.lastName,
				points: user.points,
			},
			token,
		});
	} catch (err) {
		console.log(err);
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.getProfile = async (req, res, next) => {
	res.json({
		status: "success",
		user: req.user,
	});
};

exports.updateProfile = async (req, res, next) => {
	const { firstName, lastName } = req.body;
	const { userName } = req.user;

	try {
		await updateUser(userName, { firstName, lastName });

		res.json({
			status: "success",
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.changeUserPassword = async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;
	const { userName } = req.user;

	try {
		await changePassword(userName, { oldPassword, newPassword });

		res.json({
			status: "success",
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};
