const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");

const apiRouter = require("./routes/api.route");

const app = express();

app.use(cors());

app.use(
	logger(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//** api
app.use("/api", apiRouter);

// Development
app.use(
	["/assets", "/admin/assets"],
	express.static(path.join(__dirname, "assets"))
);

//** Host Admin App
app.use(
	"/admin",
	express.static(path.join(__dirname, "public", "admin-panel"))
);
app.use("/admin", (req, res, next) => {
	res.sendFile(path.join(__dirname, "public", "admin-panel", "index.html"));
});

//** Host User App
app.use(express.static(path.join(__dirname, "public", "user-panel")));
app.use((req, res) => {
	res.sendFile(path.join(__dirname, "public", "user-panel", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500).json({
		status: "error",
		message: err.message || "SERVER_ERROR",
	});
});

module.exports = app;
