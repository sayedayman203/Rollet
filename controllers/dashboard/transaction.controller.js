const createError = require("http-errors");

const transactionService = require("../../services/transaction.service");

exports.getTransactions = async (req, res, next) => {
  const { userName, page, limit } = req.query;

  try {
    const {
      data,
      pagination,
    } = await transactionService.getTransactions({
      userName,
      page: +page,
      limit: +limit,
    });

    return res.json({
      status: "success",
      data,
      pagination,
      search: userName,
    });
  } catch (err) {
    return next(createError(err.status || 400, err.message || ""));
  }
};
