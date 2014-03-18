



console.log('Setting up Pages controller.');

var locomotive = require('locomotive'),
	PagesController = new locomotive.Controller();

PagesController.all = function() {
	console.log('### All...');
	return this.next();
};

PagesController.main = function() {
	console.log('### Main...');
	this.title = 'Voting System 5000';
	this.render();
};

module.exports = PagesController;

console.log('Done setting up Pages controller.');






