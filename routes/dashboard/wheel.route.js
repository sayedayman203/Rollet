const express = require("express");
const router = express.Router();

// controllers
const { wheelController } = require("../../controllers/dashboard.controller");

// validation
const {
	newPrizeValidation,
	editPrizeValidation,
} = require("../../helpers/validations/dashboard/wheel.validation");

const {
	catchValidationError,
	catchValidationErrorForUpdates,
} = require("../../middlewares/validationError");

// auth
const { isAuth, isAdmin } = require("../../middlewares/isAuth");

// routes
router.route("/prizes").all(isAuth, isAdmin).get(wheelController.getAllPrizes);

router
	.route("/prize")
	.all(isAuth, isAdmin)
	.post(newPrizeValidation, catchValidationError, wheelController.newPrize);

router
	.route("/prize/:prizeId")
	.all(isAuth, isAdmin)
	.put(
		editPrizeValidation,
		catchValidationErrorForUpdates,
		wheelController.editPrize
	)
	.delete(wheelController.removePrize);
module.exports = router;
