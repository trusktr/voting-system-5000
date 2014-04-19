

console.log('Begin passport initializers.');

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

/* Get the Voter model so we can query voters from the DB. */
var Voter = require("../../app/models/voter.js");

function findById(id, fn) {
    console.log('Finding user by id.');
    Voter.findById(id, function(err, voter) {
        if (voter) {
            console.log('User found.');
            fn(null, voter);
        } else {
            console.log('User not found.');
            fn(new Error('User ' + id + ' does not exist'));
        }
    });
}

function findByUsername(uname, fn) {
    console.log('Finding user by username.');
    Voter.findOne({username: uname}, function(err, voter) {
        if (voter) {
            console.log('User found.');
            fn(null, voter);
        } else {
            console.log('User not found.');
            fn(new Error('User ' + uname + ' does not exist'));
        }
    });
}




passport.use(
    new LocalStrategy(function(username, password, done) {
        // passport can only use one instance of a require('passport-local').Strategy (right?)

        // asynchronous verification, for effect...
        process.nextTick(function () { // nextTick?
            console.log('Attempting to authenticate user.');

            var SHA256 = require ("crypto-js").SHA256;
            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user "' + username +'".'}); }
                console.log(user.password);
                console.log(SHA256(user.salt + password).toString());


                if (user.password != SHA256(user.salt + password).toString()) { return done(null, false, { message: 'Invalid password' }); }

                // ^^^ TODO: use a hash function to check  hash value instead of a
                // plaintext password.

                console.log('User authenticated.');
                return done(null, user);
            })

        });
    })
);


/*
 * Return a criteria that makes the user unique.
 */
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

/*
 * And back. Kinda like a hash function.
 */
passport.deserializeUser(function(name, done) {
    findByUsername(name, function (err, user) {
        done(err, user);
    });
});

console.log('End passport initializers.');


