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
	res.redirect('/login'); return;
}

//var PagesController = new (require('../app/contollers/pages_controller.js'));

//ROUTES
module.exports = function routes() {
	console.log('Constructing routes.');

	this.match('*', 'pages#all'); // all

	// this.match('/', [lock]);
	this.match('/', 'pages#main');

	this.match('/login', 'account#login', {via: 'get'}); // login form.
	this.match('/login', 'account#authenticate', {via: 'post'}); // submission of the login form.
	this.match('/logout', 'account#logout', {via: 'get'}); // logs out the user.
	
	
	
	/*Links*/
	this.match('/lets-find-a-cure-for-ahmad', 'link#director');

	console.log('Done constructing routes.');
}

console.log('Done setting up routes.');



