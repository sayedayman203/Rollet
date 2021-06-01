const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
	name: {
		type: String,
		default: "setting",
	},
	userId: {
		type: Number,
		min: 0,
		required: true,
	},
	transactionId: {
		type: Number,
		min: 0,
		required: true,
	},
	points: {
		type: Number,
		min: 0,
		required: true,
	},
});

const Setting = mongoose.model("setting", settingsSchema);

module.exports = Setting;
