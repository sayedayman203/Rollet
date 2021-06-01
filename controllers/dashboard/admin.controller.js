const createError = require("http-errors");

const { errorHandler } = require("../../helpers/errorHandler");
const { login } = require("../../services/user.service");

exports.login = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    const { user, token } = await login(userName, password, "admin");

    res.json({
      status: "success",
      user: {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (err) {
    const { status, message } = errorHandler(err);
    next(createError(status || 400, message));
  }
};
