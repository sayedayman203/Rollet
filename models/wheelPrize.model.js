const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const prizeSchema = new Schema(
	{
		prizeType: {
			type: String,
			required: true,
			enum: ["points"],
			default: ["points"],
		},
		reward: {
			type: Schema.Types.Mixed,
			required: true,
		},
	},
	{
		_id: false,
	}
);

const wheelPrizeSchema = new Schema({
	prize: prizeSchema,
	percent: {
		type: Number,
		min: 0,
		max: 100,
	},
});
const wheelPrize = mongoose.model("wheelPrize", wheelPrizeSchema);

module.exports = wheelPrize;
