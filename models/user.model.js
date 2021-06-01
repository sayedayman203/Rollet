const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      min: 0,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "deactive", "deleted"],
    },
    lastGift: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  let user = this.toObject();
  delete user.password;
  delete user.role;
  if (user.status === "deleted") {
    delete user.status;
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  // hash the password
  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.isValidPass = async function (password) {
  try {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  } catch (err) {
    return err;
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
