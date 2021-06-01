const createError = require("http-errors");

const settingService = require("../services/setting.service");
const { errorHandler } = require("../helpers/errorHandler");
const { getPrizes, spinWheel } = require("../services/wheel.service");

exports.getPrizes = async (req, res, next) => {
	try {
		const items = await getPrizes();
		const prizes = items.map((item) => ({
			id: item._id,
			prize: item.prize,
		}));
		res.status(201).json({
			status: "success",
			prizes,
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.spin = async (req, res, next) => {
	try {
		const user = req.user;

		if (user.points < 5) {
			throw new Error("NOT_ENOUGH");
		}

		user.points -= 5;
		const prize = await spinWheel();
		user.points += prize.prize.reward;

		await Promise.all([
			user.save(),
			settingService.editPoints(prize.prize.reward - 5),
		]);
		res.json({
			status: "success",
			prizeId: prize._id,
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};
