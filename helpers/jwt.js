const jwt = require("jsonwebtoken");

exports.createToken = (payload, rememberMe) => {
	const expiresIn = rememberMe
		? 7 * 24 * 60 * 60 * 1000
		: 24 * 24 * 60 * 60 * 1000;
	const token = jwt.sign(payload, process.env.JWTSecret, { expiresIn });
	return { token, expiresIn: expiresIn.toString() };
};

exports.verifyToken = (token) => {
	try {
		const data = jwt.verify(token, process.env.JWTSecret);
		return {
			isValid: true,
			data,
		};
	} catch (err) {
		return {
			isValid: false,
		};
	}
};
