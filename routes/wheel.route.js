const express = require('express');
const router = express.Router();

const wheelController = require('../controllers/wheel.controller');

const { isAuth, isUser } = require('../middlewares/isAuth');

// Routes
router.get('/prizes', isAuth, isUser, wheelController.getPrizes);

router.post('/spin', isAuth, isUser, wheelController.spin);

module.exports = router;
