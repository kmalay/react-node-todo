const passport = require('passport');
const models = require('../models/index');
const User = models.User;
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

// Create local Strategy
const localOptions = {usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify this email and password, call done with the user
	// if it is the correct email and password
	// otherwise, call done with false
	User.findOne({ where: { email: email }}).then(function(user) {
		if (!user) { return done(null, false); }
		// compare passwords is password = user.password?
		user.comparePassword(password, function(err, isMatch) {
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false); }

			return done(null, user);
		});
	});
});

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// See if the user ID in the payload exists in our database
	// If it does, call 'done' with that user
	// otherwise, call 'done' without a user object
	User.findById(payload.sub).then(function(user) {
		if (user) {
			done(null, user);
		} else {
			done(null, false);
		}
	});
});

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
