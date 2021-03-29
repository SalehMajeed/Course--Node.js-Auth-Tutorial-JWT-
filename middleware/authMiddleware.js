const jwt = require('jsonwebtoken');
const user_model = require('../models/User');

const require_auth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, 'public secret', (err, decoded_token) => {
			if (err) {
				res.redirect('/login');
			} else {
				next();
			}
		});
	} else {
		res.redirect('/login');
	}
};

const check_user = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, 'public secret', async (err, decoded_token) => {
			if (err) {
				res.redirect('/login');
				res.locals.user = null;
				next();
			} else {
				let user = await user_model.findById(decoded_token.id);
				res.locals.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};

module.exports = { require_auth, check_user };
