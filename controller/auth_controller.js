const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handle_errors = err => {
	const error = { email: '', password: '' };

	if (err.message == 'incorrect email') {
		error.email = 'that email is not registered';
	}

	if (err.message == 'incorrect password') {
		error.password = 'that password is not registered';
	}

	if (err.code == 11000) {
		error.email = 'that email is already registered';
	} else if (err.message.includes('user validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			error[properties.path] = properties.message;
		});
	}

	return error;
};

const max_age = 3 * 24 * 60 * 60;

const create_token = id => {
	return jwt.sign({ id }, 'public secret', {
		expiresIn: max_age,
	});
};

module.exports.signup_get = (req, res) => {
	res.render('signup');
};

module.exports.signup_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.create({
			email,
			password,
		});

		const token = create_token(user._id);

		res.cookie('jwt', token, { httpOnly: true, maxAge: max_age * 1000 });
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handle_errors(err);
		res.status(400).send({ errors });
	}
};

module.exports.login_get = (req, res) => {
	res.render('login');
};

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email, password);
		const token = create_token(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: max_age * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = handle_errors(err);
		res.status(400).json({ errors });
	}
};

module.exports.logout_get = (req, res) => {
	res.cookie('jwt', '', { max_age: 1 });
	res.redirect('/');
};
