// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

console.log('Setting up routes.');

/* -------------- ROUTES */
module.exports = function routes() {
    console.log('Constructing routes.');

    this.match('*', 'pages#all'); // PagesController.all() will be called for all pages first.

    //this.match(/^((?!^\/login$).)*$/, [lock]);
    this.match('/', 'pages#root');
    this.match('/register', 'pages#register', {via: ['get','post']});
    this.match('/vote', [lock, isNotAdmin]);
    this.match('/vote', 'pages#vote', {via: ['get', 'post']});
    this.match('/results', 'pages#results');
    this.match('/admin', [lock, isAdmin]);
    this.match('/admin', 'pages#admin', {via: ['get', 'post']});

    this.match('/login', 'account#login', {via: 'get'}); // login form.
    this.match('/login', 'account#authenticate', {via: 'post'}); // submission of the login form.
    this.match('/logout', 'account#logout', {via: 'get'}); // logs out the user.

    console.log('Done constructing routes.');
}

console.log('Done setting up routes.');



/*
 * Used to prevent access to a page unless the user is logged in.
 */
function lock(req, res, done) {
    console.log('### Checking user authentication status.');
    global.urlAttempted = req.url;
    if (req.isAuthenticated()) { return done(); }
    else {res.redirect('/login'); return;}
}

/*
 * Used to prevent access to a page unless user is admin.
 */
function isAdmin(req, res, done) {
    console.log('### Checking user admin status.');
    if (req.user.username == "admin") { return done(); }
    else {res.redirect('/'); return;}
}

/*
 * Used to prevent access to a page unless user is admin.
 */
function isNotAdmin(req, res, done) {
    console.log('### Checking user is not admin.');
    if (req.user.username != "admin") { return done(); }
    else {res.redirect('/'); return;}
}

