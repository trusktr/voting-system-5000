



console.log('Setting up Account controller.');

var locomotive = require('locomotive'),
	AccountController = new locomotive.Controller(),
	passport = require('passport');

AccountController.authenticate = function() {
	console.log('### User is attempting authentication.');
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	})(this.req, this.res, this.next); // uses req, res, then continues to the next express middlewares.
};

AccountController.login = function() {
	console.log('### User has requested an authentication prompt.');
	this.title = 'voting-system-5000 >> login';
	this.render();
};

AccountController.logout = function() {
	console.log('### User is terminating authentication.');
	this.req.logout();
	this.redirect('/');
};

module.exports = AccountController;

console.log('Done setting up Account controller.');






