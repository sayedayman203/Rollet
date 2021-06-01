const createError = require("http-errors");

const { errorHandler } = require("../../helpers/errorHandler");
const {
	getPrizes,
	createPrize,
	updatePrize,
	deletePrize,
} = require("../../services/wheel.service");

exports.getAllPrizes = async (req, res, next) => {
	try {
		const prizes = await getPrizes();
		res.status(201).json({
			status: "success",
			prizes,
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.newPrize = async (req, res, next) => {
	const { prizeType, reward, percent } = req.body;

	try {
		const newPrize = await createPrize(prizeType, reward, percent);

		res.json({
			status: "success",
			prize: newPrize,
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.editPrize = async (req, res, next) => {
	const { prizeType, reward, percent } = req.body;
	const { prizeId } = req.params;

	try {
		await updatePrize(prizeId, { prizeType, reward, percent });

		res.json({
			status: "success",
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};

exports.removePrize = async (req, res, next) => {
	const { prizeId } = req.params;

	try {
		await deletePrize(prizeId);

		res.json({
			status: "success",
		});
	} catch (err) {
		const { status, message } = errorHandler(err);
		next(createError(status || 400, message));
	}
};
