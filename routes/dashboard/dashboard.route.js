const express = require("express");
const router = express.Router();

const {
	adminController,
	homeController,
	userController,
	transactionController,
} = require("../../controllers/dashboard.controller");

const {
	loginValidation,
	updateUserValidation,
	updateStatusValidation,
} = require("../../helpers/validations/dashboard/admin.validation");
const {
	usersValidation,
} = require("../../helpers/validations/dashboard/users.validation");
const {
	transactionsValidation,
} = require("../../helpers/validations/dashboard/transactions.validation");
const {
	editPointsValidation,
} = require("../../helpers/validations/dashboard/user.validation");

const {
	catchValidationError,
	catchValidationErrorForUpdates,
} = require("../../middlewares/validationError");

const { isAuth, isAdmin } = require("../../middlewares/isAuth");

const wheelRouter = require("./wheel.route");

// Auth
router.post(
	"/login",
	loginValidation,
	catchValidationError,
	adminController.login
);

/* GET pages. */
router.get("/", isAuth, isAdmin, homeController.getDashboard);
router.get(
	"/users",
	isAuth,
	isAdmin,
	usersValidation,
	catchValidationError,
	userController.getUsers
);
router.get("/user/:userName", isAuth, isAdmin, userController.getUser);
router.get(
	"/transactions",
	isAuth,
	isAdmin,
	transactionsValidation,
	catchValidationError,
	transactionController.getTransactions
);

/* Add Points */
router.post(
	"/user/:userName/addPoints",
	isAuth,
	isAdmin,
	editPointsValidation,
	catchValidationError,
	userController.addPoints
);
router.post(
	"/user/:userName/minusPoints",
	isAuth,
	isAdmin,
	editPointsValidation,
	catchValidationError,
	userController.minusPoints
);
router.post("/user/:userName/gift", isAuth, isAdmin, userController.takeGift);

//User
router.put(
	"/user/:userName",
	isAuth,
	isAdmin,
	updateUserValidation,
	catchValidationErrorForUpdates,
	userController.updateUser
);

router.put(
	"/user/:userName/status",
	isAuth,
	isAdmin,
	updateStatusValidation,
	catchValidationError,
	userController.changeUserStatus
);

// Wheel
router.use("/wheel", wheelRouter);

module.exports = router;
