const createError = require("http-errors");

const userService = require("../../services/user.service");
const transactionService = require("../../services/transaction.service");
const settingService = require("../../services/setting.service");
const { errorHandler } = require("../../helpers/errorHandler");

exports.getUsers = async (req, res, next) => {
	const { page, limit, userName } = req.query;

	try {
		const { users, pagination } = await userService.getUsers({
			userName,
			page: +page,
			limit: +limit,
		});
		return res.json({
			status: "success",
			users,
			pagination,
			search: userName || "",
		});
	} catch (err) {
		return next(createError(err.status || 400, err.message || ""));
	}
};

exports.getUser = async (req, res, next) => {
	const { userName } = req.params;
	try {
		const user = await userService.getUserByUserName(userName);
		const transactions = await transactionService.getTransactions({
			userName,
		});
		return res.json({
			status: "success",
			user,
			transactions,
		});
	} catch (err) {
		return next(createError(err.status || 400, err.message || ""));
	}
};

exports.addPoints = async (req, res, next) => {
	const { userName } = req.params;
	let { points } = req.body;

	try {
		const user = await userService.getUserByUserName(userName);
		if (!user) return next(createError(404, "user not found"));

		user.points += points;

		await Promise.all([
			user.save(),
			transactionService.addPoints({
				points,
				from: req.user._id,
				to: user._id,
			}),
			settingService.editPoints(points),
		]);

		return res.json({
			status: "success",
		});
	} catch (err) {
		return next(createError(err.status || 400, err.message || ""));
	}
};

exports.minusPoints = async (req, res, next) => {
	const { userName } = req.params;
	let { points } = req.body;

	try {
		const user = await userService.getUserByUserName(userName);
		if (!user) return next(createError(404, "user not found"));

		user.points -= points;

		if (user.points < 0) throw new Error("NEGATIVE_POINTS");

		await Promise.all([
			user.save(),
			transactionService.addPoints({
				points: -points,
				from: req.user._id,
				to: user._id,
			}),
			settingService.editPoints(-points),
		]);

		return res.json({
			status: "success",
		});
	} catch (err) {
		return next(createError(err.status || 400, err.message || ""));
	}
};

exports.takeGift = async (req, res, next) => {
	const { userName } = req.params;

	try {
		const user = await userService.getUserByUserName(userName);

		const lastGiftDiff = Math.floor(
			(new Date().setHours(0, 0, 0, 0) - new Date(user.lastGift)) /
				(1000 * 60 * 60 * 24)
		);

		if (user.lastGift && lastGiftDiff < 1)
			return next(createError(400, "ALREADY_TAKEN"));

		user.points += 1;
		user.lastGift = new Date().setHours(0, 0, 0, 0);

		await Promise.all([user.save(), settingService.editPoints(1)]);

		return res.json({
			status: "success",
		});
	} catch (err) {
		return next(createError(err.status || 400, err.message || ""));
	}
};

exports.updateUser = async (req, res, next) => {
	const { firstName, lastName } = req.body;
	const { userName } = req.params;

	try {
		await userService.updateUser(userName, { firstName, lastName });

		res.json({
			status: "success",
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.changeUserStatus = async (req, res, next) => {
	const { status } = req.body;
	const { userName } = req.params;

	try {
		const user = await userService.getUserByUserName(userName);

		if (!user) return next(createError(404, "USER_NOTFOUNT"));

		let promises = [userService.changeStatus(userName, status)];

		if (status === "deleted") {
			promises.push(settingService.editPoints(-user.points));
		}

		await Promise.all(promises);

		res.json({
			status: "success",
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};
