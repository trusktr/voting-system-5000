



console.log('Setting up Account controller.');

var locomotive = require('locomotive'),
	AccountController = new locomotive.Controller(),
	passport = require('passport'); // passport is already initialized by now, get a reference to it (a singleton).

AccountController.authenticate = function() {
	passport.authenticate('local', {
		successRedirect: global.urlAttempted, // TODO: Doesn't always redirect to the proper page. needs testing.
		failureRedirect: '/login'
	//})(this.req, this.res, this.next); // uses req, res, then continues to the next express middlewares.
	})(this.req, this.res, this.__next); // this.__next instead of this.next solves a bug with locomotive (https://github.com/jaredhanson/locomotive/issues/161).
};

AccountController.login = function() {
        this.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
	this.render();
};

AccountController.logout = function() {
	this.req.logout();
	this.redirect('/');
};

module.exports = AccountController;

console.log('Done setting up Account controller.');






