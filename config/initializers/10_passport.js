

console.log('Begin passport initializers.');

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  console.log('Finding user by id.');
  var idx = id - 1;
  if (users[idx]) {
    console.log('User found.');
    fn(null, users[idx]);
  } else {
    console.log('User not found.');
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  console.log('Finding user by username.');
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      console.log('User found.');
      return fn(null, user);
    }
  }
  console.log('User not found.');
  return fn(null, null);
}




passport.use(new LocalStrategy( // passport can only use one instance of a require('passport-local').Strategy (right?)
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log('Attempting to authenticate user.');

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }

        return done(null, user);
      })

      console.log('Done attempting to authenticate user.');
    });
  }
));



//passport.use(new LocalStrategy(
//	function(username, password, done) {
//		User.findOne({ username: username }, function(err, user) {
//			if (err) { return done(err); }
//			if (!user) {
//				return done(null, false, { message: 'Unknown user' });
//			}
//			if (!user.validPassword(password)) {
//				return done(null, false, { message: 'Invalid password' });
//			}
//			return done(null, user);
//		});
//	}
//));



passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});

console.log('End passport initializers.');


