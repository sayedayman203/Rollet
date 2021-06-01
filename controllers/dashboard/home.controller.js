const createError = require("http-errors");

const Setting = require("../../models/settings.model");

const userService = require("../../services/user.service");
const transactionService = require("../../services/transaction.service");

exports.getDashboard = async (req, res, next) => {
  try {
    const { userId, transactionId, points } = await Setting.findOne({
      name: "setting",
    });
    const users$ = userService.getUsers({
      limit: 10,
    });
    const transactions$ = transactionService.getTransactions({
      limit: 10,
    });

    const [{ users }, { data }] = await Promise.all([users$, transactions$]);

    return res.json({
      status: "success",
      details: {
        nOfUsers: userId,
        nOfTransactions: transactionId,
        nOfPoints: points,
      },
      users,
      transactions: data,
    });
  } catch (err) {
    return next(createError(err.status || 400, err.message || undefined));
  }
};
