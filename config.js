require("dotenv").config();

const Setting = require("./models/settings.model");
const User = require("./models/user.model");
const { createUser } = require("./services/user.service");
const { connect, disconnect } = require("./db/db");
connect();

const main = async () => {
  // generate settings
  const settings = await Setting.findOne({ name: "setting" });
  if (!settings) {
    await Setting.create({
      name: "setting",
      userId: 0,
      transactionId: 0,
      points: 0,
    });
  }

  // Set Admin
  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    await createUser("admin", "admin", "admin", "0", true);
  }
  disconnect();
};
main();
