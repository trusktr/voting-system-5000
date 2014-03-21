// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

console.log('Setting up routes.');

function lock(req, res, next) {
	console.log('### Checking user authentication status.');
	if (req.isAuthenticated()) { return next(); }
        else {res.redirect('/login'); return;}
}

//var PagesController = new (require('../app/contollers/pages_controller.js'));

//ROUTES
module.exports = function routes() {
	console.log('Constructing routes.');

	this.match('*', 'pages#all'); // PagesController.all() will be called for all pages first.

	// this.match('/', [lock]);
	this.match('/', 'pages#root');
	this.match('/register', 'pages#register');
        this.match('/vote', 'pages#vote');
        this.match('/results', 'pages#results');
        this.match('/admin', 'pages#admin');

        // Don't worry about log in stuff yet. Technically we can do that in the
        // second assignment.
	this.match('/login', 'account#login', {via: 'get'}); // login form.
	this.match('/login', 'account#authenticate', {via: 'post'}); // submission of the login form.
	this.match('/logout', 'account#logout', {via: 'get'}); // logs out the user.

	console.log('Done constructing routes.');
}

console.log('Done setting up routes.');



