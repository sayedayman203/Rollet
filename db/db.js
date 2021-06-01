// Modules
const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

// init
const dbURL = process.env.DB;

// Connect and listen
const connect = () => {
	mongoose
		.connect(dbURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		})
		.then(() => {
			console.log(`DB Connected.`);
		})
		.catch((err) => {
			console.log(
				`Mongoose default connection has occured ${err} error.`
			);
		});

	mongoose.plugin(slug);

	mongoose.connection.on("disconnected", () => {
		console.log("Mongoose default connection is disconnected.");
	});

	process.on("SIGINT", () => {
		mongoose.connection.close(() => {
			console.log(
				"Mongoose default connection is disconnected due to application termination."
			);
			process.exit(0);
		});
	});
};

// Export
module.exports = { connect };
