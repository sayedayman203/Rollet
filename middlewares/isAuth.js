const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
exports.isAuth = async (req, res, next) => {
  try {
    // check token
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) throw new Error();
    const decodedToken = jwt.verify(token, process.env.JWTSecret);
    // check user
    const user = await User.findById(decodedToken.id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    next(createError(401, "UNAUTHORIZED"));
  }
};

exports.isUser = (req, res, next) => {
  if (req.user.role === "user") {
    return next();
  }
  next(createError(401, "UNAUTHORIZED"));
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  next(createError(401, "UNAUTHORIZED"));
};
