const Setting = require("./models/settings.model");
const User = require("./models/user.model");
const { createUser } = require("./services/user.service");

require("dotenv").config();

require("./db/db").connect();

console.log("init config");
// reset Settings
await Setting.findOneAndUpdate(
	{ name: "setting" },
	{
		userId: 0,
		transactionId: 0,
		points: 0,
	}
);

// Set Admin
await createUser("H", "Man", "admin", "01150");
