// Modules
const mongoose = require("mongoose");

// init
const dbURL = process.env.DB;

// Connect and listen
const connect = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`DB Connected.`);

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
  } catch (err) {
    console.log(`Mongoose default connection has occured ${err} error.`);
  }
};

const disconnect = async () => {
  await mongoose.disconnect();
};
// Export
module.exports = { connect, disconnect };
