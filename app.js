const express = require('express');
const mongoose = require('mongoose');
const auth_routes = require('./routes/auth_routes');
const app = express();
const cookie_parser = require('cookie-parser');
const { require_auth, check_user } = require('./middleware/authMiddleware');

app.disable('x-powered-by');

app.use(express.json());
app.use(express.static('public'));
app.use(cookie_parser());

app.set('view engine', 'ejs');

const db_uri = 'mongodb://localhost:27017/node-auth';
mongoose
	.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(result => {
		console.log('working');
		app.listen(3000);
	})
	.catch(err => console.log(err));

app.get('*', check_user);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', require_auth, (req, res) => res.render('smoothies'));

// app.get('/set-cookies', (req, res) => {
// 	// res.setHeader('Set-Cookie', 'newUser=true');

// 	res.cookie('newUser', false);
// 	res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, secure: false, httpOnly: true });

// 	res.send('you got the cookies');
// });

// app.get('/read-cookies', (req, res) => {
// 	const cookies = req.cookies;
// 	console.log(cookies);
// 	res.json(cookies);
// });
app.use(auth_routes);
