const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    transactionId: {
      type: Number,
      required: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
