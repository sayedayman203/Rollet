const Setting = require("../models/settings.model");

exports.nextUser = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { userId } = await Setting.findOneAndUpdate(
				{ name: "setting" },
				{
					$inc: { userId: 1 },
				},
				{
					new: true,
				}
			).select("userId");

			resolve(userId);
		} catch (err) {
			reject(err);
		}
	});
};

exports.nextTransaction = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { transactionId } = await Setting.findOneAndUpdate(
				{ name: "setting" },
				{
					$inc: { transactionId: 1 },
				},
				{
					new: true,
				}
			).select("transactionId");

			resolve(transactionId);
		} catch (err) {
			reject(err);
		}
	});
};

exports.editPoints = async (n) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { points } = await Setting.findOneAndUpdate(
				{ name: "setting" },
				{
					$inc: { points: n },
				},
				{
					new: true,
				}
			).select("points");

			resolve(points);
		} catch (err) {
			reject(err);
		}
	});
};
