const jwt = require('jwt-simple');
const models = require('../models/index');
const User = models.User;
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.get('id'), iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User has already had their email and password auth'd
	// We just need to give them a token
	console.log(req.user.get('id'));
	console.log(req.user.get('email'));
	res.send({
		token: tokenForUser(req.user),
		userId: req.user.get('id')
	});
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password'});
	}

	// See if a user with the given email exists
	User.findOne({ where: {email: email} }).then(function(user) {
		// If a user with email does exist, return an error
		if (user) {
			console.log(user.get('email'));
			return res.status(422).send({ error: 'Email is in use' });
		}

		// If a user doesn't exist, create one and return a JWT
		User.create({
    	email: email,
    	password: password
  	}).then(function(user) {
    	res.json({
    		token: tokenForUser(user),
    		userId: user.get('id')
    	});
  	});
	});
}

exports.test = function(req, res, next) {
	User.findAll({}).then(function(users) {
		res.json(users);
	});
}
