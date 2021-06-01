const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const {
	registerValidation,
	loginValidation,
} = require("../helpers/validations/user.validation");
const { catchValidationError } = require("../middlewares/validationError");

const { isAuth, isUser } = require("../middlewares/isAuth");

// Routes
router.post(
	"/register",
	registerValidation,
	catchValidationError,
	userController.register
);

router.post(
	"/login",
	loginValidation,
	catchValidationError,
	userController.login
);

router.get("/profile", isAuth, isUser, userController.getProfile);
router.put("/profile", isAuth, isUser, userController.updateProfile);
router.post(
	"/changePassword",
	isAuth,
	isUser,
	userController.changeUserPassword
);

module.exports = router;
