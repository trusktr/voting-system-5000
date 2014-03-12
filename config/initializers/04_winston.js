

console.log('Setting up Winston logger.');

// TODO: Find the best place to initialize WInston logger.
var winston = require('winston');
var logger = new (winston.Logger)({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: '../node.access.log' }),
//			new winston.transports.MongoDB({ db: 'db', level: 'info'}),
	],
	exceptionHandlers: [
		new winston.transports.File({ filename: '../node.error.log' })
	]
});

console.log('Done setting up Winston logger.');