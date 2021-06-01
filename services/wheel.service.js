const WheelPrize = require("../models/wheelPrize.model");

const createPrize = (prizeType, reward, percent) => {
	return new Promise(async (resolve, reject) => {
		try {
			const prizeCount = await WheelPrize.countDocuments();

			if (prizeCount >= 8) {
				throw new Error("MAX_8");
			}

			// create new Prize
			const newPrize = new WheelPrize({
				prize: {
					prizeType,
					reward,
				},
				percent,
			});

			// save user
			await newPrize.save();

			resolve(newPrize);
		} catch (err) {
			err.status = 400;
			reject(err);
		}
	});
};

const updatePrize = (prizeId, updates = {}) => {
	const { prizeType, reward, percent } = updates;

	return new Promise(async (resolve, reject) => {
		try {
			if (!prizeType && !reward && !percent) {
				throw new Error("NO_UPDATES");
			}
			let prizeUpdate = {};

			if (prizeType) {
				prizeUpdate["prize.prizeType"] = prizeType;
				prizeUpdate["prize.reward"] = reward;
			}
			if (percent) {
				prizeUpdate["percent"] = percent;
			}

			let prize = await WheelPrize.findByIdAndUpdate(
				prizeId,
				prizeUpdate,
				{
					new: true,
				}
			);

			resolve(prize);
		} catch (err) {
			err.status = 400;
			reject(err);
		}
	});
};

const deletePrize = (prizeId) => {
	return new Promise(async (resolve, reject) => {
		try {
			await WheelPrize.findByIdAndDelete(prizeId);

			resolve();
		} catch (err) {
			err.status = 400;
			reject(err);
		}
	});
};

const getPrizes = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const Prizes = await WheelPrize.find({});
			resolve(Prizes);
		} catch (err) {
			err.status = 400;
			reject(err);
		}
	});
};

const spinWheel = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const prizes = await WheelPrize.find({});
			const prize = randomOfArr(prizes);

			resolve(prize);
		} catch (err) {
			err.status = 404;
			reject(err);
		}
	});
};

module.exports = {
	createPrize,
	updatePrize,
	deletePrize,
	getPrizes,
	spinWheel,
};

const randomOfArr = (items = []) => {
	const max = items.reduce((total, item) => total + item.percent, 0);
	const random = Math.floor(Math.random() * (max + 1));

	for (let i = 0, current = 0; i < items.length; i++) {
		const item = items[i];
		current += item.percent;

		if (random < current) {
			return item;
		}
	}

	// const expanded = items.flatMap((item) => Array(item.percent).fill(item));
	// return prize;
};
