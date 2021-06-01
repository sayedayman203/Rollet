const createError = require("http-errors");

const transactionService = require("../services/transaction.service");

exports.getTransactions = async (req, res, next) => {
	const { page, limit } = req.body;
	const { userName } = req.user;
	try {
		const {
			transactions,
			pagination,
		} = await transactionService.getTransactions({
			userName,
			page,
			limit,
		});

		return res.json({
			status: "success",
			transactions,
			pagination,
		});
	} catch (err) {
		return next(createError(400, err.message || ""));
	}
};
