const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const user_schema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please enter an password'],
		lowercase: true,
		minlength: [6, 'Minimum password length is 6 characters'],
	},
});

user_schema.post('save', function (doc, next) {
	console.log('new user was created & saved', doc);
	next();
});

user_schema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

user_schema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });

	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('incorrect password');
	}
	throw Error('incorrect email');
};

const user_model = mongoose.model('user', user_schema);

module.exports = user_model;
